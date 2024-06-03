import axios from 'axios';
import React, { useState, useEffect } from 'react';

const TrackerComponent = ({ order }) => {
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const TRACKER_URL = 'https://apis.tracker.delivery';
    const [carrierId, setCarrierId] = useState('kr.cjlogistics');
    useEffect(() => {
        const callLogAPI = async () => {
            try {
                const response = await fetch(`${TRACKER_URL}/carriers/${carrierId}/tracks/${order.way.toString().replace(/-/g, '')}`);
                if (response.ok) {
                    const data = await response.json();
                    processDeliveryData(data);
                } else {
                    // Handle error response
                    console.log('Error fetching delivery information:', response.statusText);
                }
            } catch (error) {
                console.log('Error fetching delivery information:', error);
            }
        };

        const processDeliveryData = (data) => {
            if (data.message) {
                setDeliveryInfo({
                    description: '실패했을때 메시지',
                    deliveryWorker: '실패했을때 메시지',
                    time: '실패했을때 메시지',
                    location: '실패했을때 메시지',
                    status: '실패했을때 메시지',
                    carrierId: order.way,
                    company: '실패했을때 메시지', // Assuming deliComName is obtained elsewhere
                    allProgress: []
                });
            } else {
                const { carrier, progresses, state } = data;
                const { id: carrierId } = carrier;
                const { text: status } = state;

                const progressInfo = progresses.map(progress => {
                    const { description, location, time, status } = progress;
                    const { name } = location;
                    return { description, location: name, time, status };
                });

                setDeliveryInfo({
                    carrierId,
                    status,
                    allProgress: progressInfo
                });
            }
        };

        callLogAPI();
    }, [order]); // Include dependency trackId

    useEffect(() => {
        const statusUpdate = async () => {
            try {
                // 주문 상태 업데이트 요청
                await axios.post(`/ft/order/statusUpdate`, { status: deliveryInfo.status, oid: order.oid }); // deliveryInfo.status와 order.oid 사용
                // 주문 목록 다시 불러오기
            } catch (error) {
                console.log('주문 상태 업데이트 중 에러:', error);
            }
        };

        if (deliveryInfo) {
            statusUpdate();
        }
    }, [deliveryInfo, order.oid]); 

    if (!deliveryInfo) {
        return <div>Loading...</div>;
    }
    return (
        <div id='newStatus'>
            {/* {deliveryInfo.status} */}
            {deliveryInfo.status === '배송완료' ? deliveryInfo.status : '배송중'}
        </div>
    )   
}

export default TrackerComponent;
