import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const SoldItem = () => {
  const [topSoldItems, setTopSoldItems] = useState([]);

  useEffect(() => {
    const fetchTopSoldItems = async () => {
      try {
        const response = await axios.get('/ft/admin/sales/sold');
        setTopSoldItems(response.data);
      } catch (error) {
        console.log('가장 많이 팔린 상품 Top 5 조회 중 오류:', error);
      }
    };

    fetchTopSoldItems();
  }, []);

  const handleItemClick = (event, item) => {
    if (item.length > 0) {
      const clickedItem = topSoldItems[item[0].index];
      if (clickedItem && clickedItem.productId) {
        const productId = clickedItem.productId;
        const width = 1000;
        const height = 800;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;
        window.open(`/item/detail/${productId}`, '_blank',specs);
      }
    }
  };

  // Chart.js 데이터 포맷 생성
  const chartData = {
    labels: topSoldItems.map((item) => {
      return item.productName.length > 5 ? `${item.productName.slice(0, 5)}..` : item.productName;
    }),
    datasets: [
      {
        label: '판매량 Top 5',
        data: topSoldItems.map((item) => item.totalSoldQuantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66ff99', '#ffcc99'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66ff99', '#ffcc99'],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value}개`;
          },
        },
      },
    },
    onClick: handleItemClick
  };

  return (
    <Box p={2} width="65%" textAlign="center">
      <Typography variant="h5" gutterBottom>
        가장 많이 팔린 상품 Top 5
      </Typography>
      <Pie data={chartData} options={options} height={200} width={200} />
    </Box>
  );
};

export default SoldItem;