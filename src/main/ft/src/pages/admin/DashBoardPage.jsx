import React, { useEffect, useState } from 'react';
import OrderStatus from '../../components/chart/OrderStatus';
import Cancellations from '../../components/chart/Cancellations';
import RevenueItems from '../../components/chart/RevenueItems';
import SoldItem from '../../components/chart/SoldItem';
import WeeklySales from '../../components/chart/WeeklySales';
import Box from '@mui/material/Box';
import { Button, Container, Grid } from '@mui/material';
import AdminCategoryBar from '../../components/admin/AdminCategoryBar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Calendar from '../../components/calendar/Calendar';

const DashboardPage = () => {
  const [showCalendar, setShowCalendar] = useState(false); // 캘린더 표시 여부 상태

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 
  
  return (
    <Container>
      <AdminCategoryBar/>
      <Box>
        {/* 캘린더 보기 버튼 */}
        <Box display="flex" justifyContent="flex-end" sx={{ marginBottom: 1,  }}>
          <Button variant="contained" onClick={() => setShowCalendar(!showCalendar)}>
            {showCalendar ? '통계' : <CalendarMonthIcon></CalendarMonthIcon>}
          </Button>
        </Box>

        {showCalendar ? (
          <Calendar />
          ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box className="graph-section" mb={5} sx={{ width: "75%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <WeeklySales />
              <RevenueItems />
            </Box>
            <Box className="graph-section" mb={10} sx={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between", border: "1px solid #ccc", padding: "10px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <OrderStatus />
                    <Cancellations />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <SoldItem />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;
