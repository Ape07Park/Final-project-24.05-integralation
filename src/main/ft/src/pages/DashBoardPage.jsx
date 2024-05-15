import React from 'react';
import OrderStatus from '../components/chart/OrderStatus';
import Cancellations from '../components/chart/Cancellations';
import RevenueItems from '../components/chart/RevenueItems';
import SoldItem from '../components/chart/SoldItem';
import WeeklySales from '../components/chart/WeeklySales';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import AdminCategoryBar from '../components/AdminCategoryBar';

const DashboardPage = () => {
  return (
    <>
      <AdminCategoryBar/>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Top section with WeeklySales and RevenueItems */}
        <Box className="graph-section" mb={5} sx={{ width: "55%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <WeeklySales />
          <RevenueItems />
        </Box>
        {/* Bottom section with OrderStatus, Cancellations, and SoldItem */}
        <Box className="graph-section" mb={10} sx={{ width: "80%", display: "flex", flexDirection: "row", justifyContent: "space-between", border: "1px solid #ccc", padding: "10px" }}>
          <Grid container spacing={2}>
            {/* Left column for OrderStatus and Cancellations */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <OrderStatus />
                <Cancellations />
              </Box>
            </Grid>
            {/* Right column for SoldItem */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <SoldItem />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;
