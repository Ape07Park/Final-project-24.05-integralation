import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Grid, TextField } from "@mui/material";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addItemSale } from '../../api/itemApi';

export default function SaleModal({ open, onClose, iid, cost, price, ordSaleDate, ordSalePrice}) {
  const [salePrice, setSalePrice] = useState('');
  const [saleDate, setSaleDate] = useState(new Date());

  useEffect(() => {
    setSalePrice(ordSalePrice || 0)
    setSaleDate(ordSaleDate || new Date())
  },[ordSalePrice])

  const handleChange = (event) => {
    setSalePrice(event.target.value);
  }

  const handleDateChange = (date) => {
    setSaleDate(date);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const isConfirmed = window.confirm('정말 등록하시겠습니까?');
  
    if (isConfirmed) {
      const formattedSaleDate = new Date(saleDate).toISOString();
      
      const formData = {
        iid: iid,
        salePrice: salePrice,
        saleDate: formattedSaleDate
      };
  
      addItemSale(formData)
        .then(res => {
          setSalePrice(null)
          setSaleDate(null)
          onClose(); // 모달 닫기
        })
        .catch(error => {
          console.log('Error:', error);

        });
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: 20 }}>
        <Typography variant="h5">세일 설정</Typography>
        <Button onClick={onClose} style={{ position: 'absolute', top: 5, right: 5 }}>X</Button> {/* 닫기 버튼 추가 */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <Typography variant="h6" style={{marginTop:1}}>원가: {cost ? cost.toLocaleString() + ' 원' : ''}</Typography>
            <Typography variant="h6" style={{marginTop:1}}>판매가: {price ? price.toLocaleString() + ' 원' : ''}</Typography>
              <TextField label='세일가격' value={salePrice} onChange={handleChange} fullWidth style={{marginTop:5}}/>
              <Typography variant="h6" style={{marginTop:1}}>할인율: {((price - salePrice) / price * 100).toFixed(0)}%</Typography>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                selected={saleDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="세일 기간 선택"
                showTimeInput
                className="form-control"
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button type='submit' variant='contained' style={{ marginTop: '10px' }}>등록</Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}