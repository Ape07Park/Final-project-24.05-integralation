import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

const LineChart = () => {
  const [weeklySalesData, setWeeklySalesData] = useState([]);

  useEffect(() => {
    const fetchWeeklySalesData = async () => {
      try {
        const response = await axios.get("/ft/admin/sales/last30days");
        setWeeklySalesData(response.data);
      } catch (error) {
        console.log("최근 30일간 주간 판매 추이 조회 중 오류:", error);
      }
    };

    fetchWeeklySalesData();
  }, []);

  // Chart.js 데이터 포맷 생성
  const chartData = {
    labels: weeklySalesData.map((week) => `${week.orderDate}`),
    datasets: [
      {
        label: "주간 판매 추이",
        data: weeklySalesData.map((week) => week.totalPrice),
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 1)", // 바의 배경 색상을 보라색으로 설정
        borderColor: "rgba(153, 102, 255, 1)", // 바의 테두리 색상을 보라색으로 설정
        tension: 0.1,
        pointStyle: 'circle', // 포인트 모양을 원 모양으로 지정
        radius: 4 // 포인트 크기를 굵게 조절
      },
    ],
  };

  const option = {
    plugins: {
        datalabels: {
            display: false,          
        },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10, // 최대 표시할 x 축 레이블 개수
        },
      },
    },
  };

return (
  <Box>
    <Typography variant="h5" mt={5} mb={1}>최근 30일간 주간 판매 추이</Typography>
    <Line data={chartData} options={option} height={300} width={500} />
  </Box>
);
};

export default LineChart;
