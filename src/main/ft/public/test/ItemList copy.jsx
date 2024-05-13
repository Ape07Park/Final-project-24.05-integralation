// 오리지널

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceData, setInvoiceData] = useState(null);
    const [trackingDetails, setTrackingDetails] = useState([]);

    useEffect(() => {
        const myKey = "JUI5lF7RHlbZHdNPCjhfYw";

        axios.get(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${myKey}`)
            .then(response => {
                const companies = response.data.Company;
                setCompanyList(companies);
            })
            .catch(error => {
                console.error('Error fetching company list:', error);
            });
    }, []);

    const handleTrackButtonClick = () => {
      console.log(selectedCompany);
        if (!selectedCompany || !invoiceNumber) {
            alert('Please select a company and enter an invoice number');
            return;
        }

        const myKey = "JUI5lF7RHlbZHdNPCjhfYw";
        
        axios.get(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${myKey}&t_code=${selectedCompany}&t_invoice=${invoiceNumber}`)
            .then(response => {
                const data = response.data;
                setInvoiceData(data);
                if (data.status === false) {
                    alert(data.msg);
                } else {
                    setTrackingDetails(data.trackingDetails);
                }
            })
            .catch(error => {
                console.error('Error fetching tracking information:', error);
            });
    };
  return (
    <div>
            <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                <option value="04">Select a company</option>
                {companyList.map(company => (
                    <option key={company.Code} value={company.Code}>{company.Name}</option>
                ))}
            </select>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            <button onClick={handleTrackButtonClick}>Track</button>

            {invoiceData && (
                <div>
                    <p>Sender: {invoiceData.senderName}</p>
                    <p>Item: {invoiceData.itemName}</p>
                    <p>Invoice Number: {invoiceData.invoiceNo}</p>
                    <p>Receiver Address: {invoiceData.receiverAddr}</p>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {trackingDetails.map((detail, index) => (
                        <tr key={index}>
                            <td>{detail.timeString}</td>
                            <td>{detail.where}</td>
                            <td>{detail.kind}</td>
                            <td>{detail.telno}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
  );
};

export default ApiTest;