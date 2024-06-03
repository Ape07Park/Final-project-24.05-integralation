import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const OrderStatusList = () => {
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    orderCount: 0,
    deliveryCount: 0,
    payCompleteCount: 0,
    delivertcompleteCount: 0,
  });

  useEffect(() => {
    const fetchOrderStatusCounts = async () => {
      try {
        const response = await axios.get("/ft/admin/sales/status");
        const result = response.data;

        setOrderStatusCounts({
          orderCount: result.orderCount,
          payCompleteCount: result.payCompleteCount,
          deliveryCount: result.deliveryCount,
          delivertcompleteCount: result.delivertcompleteCount,
        });
      } catch (error) {
        console.log("주문/배송 상태 조회 중 오류:", error);
      }
    };

    fetchOrderStatusCounts();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" align="center" gutterBottom>
        주문/배송 상태별 현황
      </Typography>
      <List style={{ textAlign: 'center' }}>
        <ListItem>
          <ListItemText primary={`결제완료: ${orderStatusCounts.payCompleteCount}건`} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`주문완료: ${orderStatusCounts.orderCount}건`} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`배송중: ${orderStatusCounts.deliveryCount}건`} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`배송완료: ${orderStatusCounts.delivertcompleteCount}건`} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
        </ListItem>
      </List>
    </Box>
  );
};

export default OrderStatusList;
