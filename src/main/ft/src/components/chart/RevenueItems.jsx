import React, { useState, useEffect } from "react";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ChartDataLabels,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
);

const RevenueItems = () => {
  const [top5RevenueItems, setTop5RevenueItems] = useState([]);

  useEffect(() => {
    const fetchTop5RevenueItems = async () => {
      try {
        const response = await axios.get("/ft/admin/sales/revenue");
        setTop5RevenueItems(response.data);
      } catch (error) {
        console.log("순이익 Top 5 상품 조회 중 오류:", error);
      }
    };

    fetchTop5RevenueItems();
  }, []);

  const handleItemClick = (event, item) => {
    if (item.length > 0) {
      const clickedItem = top5RevenueItems[item[0].index];
      if (clickedItem && clickedItem.productId) {
        const productId = clickedItem.productId;
        const width = 1000;
        const height = 800;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        const specs = `width=${width}, height=${height}, left=${left}, top=${top}`;
        window.open(`/item/detail/${productId}`, "_blank",specs);
      } 
    }
  };

  // Chart.js 데이터 포맷 생성
  const chartData = {
    labels: top5RevenueItems.map((item) => item.productName),
    datasets: [
      {
        label: "순이익 Top 5 상품",
        data: top5RevenueItems.map((item) => item.totalRevenue),
      },
    ],
  };

  const options = {
    plugins: {
      labels: ['1','2','3','4','5'],
      datalabels: {
        color: "black",
        anchor: "end",
        clamp: true,
        clip: false,
        align: "start",
        offset: '-20',  // 데이터 레이블 위아래 정렬
        formatter: function (value, context) {
          let result = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return result + "원";
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45, // 레이블 최대 회전 각도
          minRotation: 0, // 레이블 최소 회전 각도
          autoSkip: true, // 레이블 자동 스킵 여부
          maxTicksLimit: 10, // 최대 표시할 레이블 수
          callback: function (index) {
            const label = index + 1; // 레이블 값 가져오기
            return label;
          },
        },
      },
      y: {
        display: false, // y축을 표시하지 않음
      },
    },
    elements: {
      bar: {
        backgroundColor: "rgba(153, 102, 255, 1)", // 바의 배경 색상을 보라색으로 설정
        borderColor: "rgba(153, 102, 255, 1)", // 바의 테두리 색상을 보라색으로 설정
        
      }
    },
    onClick: handleItemClick
  };

  return (
    <Box>
      <Typography variant="h5" mt={5} mb={1}>순이익 Top 5 상품</Typography>
      <Bar data={chartData} options={options} height={300} width={330} />
    </Box>
  );
};

export default RevenueItems;