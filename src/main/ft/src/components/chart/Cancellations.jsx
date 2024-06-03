import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, Box } from '@mui/material';

const CancellationStatusList = () => {
  const [cancellationStatusCounts, setCancellationStatusCounts] = useState({
    cancelCount: 0,
    returnCount: 0,
    exchangeCount: 0,
  });

  useEffect(() => {
    const fetchCancellationStatusCounts = async () => {
      try {
        const response = await axios.get('/ft/admin/sales/cancel');
        const result = response.data;

        setCancellationStatusCounts({
          cancelCount: result.cancelCount,
          returnCount: result.returnCount,
          exchangeCount: result.exchangeCount
        });
      } catch (error) {
        console.log('취소/반품/교환 상태 조회 중 오류:', error);
      }
    };

    fetchCancellationStatusCounts();
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" align="center" gutterBottom>
        취소/반품/교환 상태별 현황
      </Typography>
      <List style={{ textAlign: 'center' }}>
        <ListItem style={{ fontWeight: 'bold' }}>
          취소: {cancellationStatusCounts.cancelCount}건
        </ListItem>
        <ListItem style={{ fontWeight: 'bold' }}>
          교환: {cancellationStatusCounts.returnCount}건
        </ListItem>
        <ListItem style={{ fontWeight: 'bold' }}>
          반품: {cancellationStatusCounts.exchangeCount}건
        </ListItem>
      </List>
    </Box>
  );
};

export default CancellationStatusList;
