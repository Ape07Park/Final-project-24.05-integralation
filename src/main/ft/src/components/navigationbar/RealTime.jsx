import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Box, Typography } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../css/RealTime.css';

const queryClient = new QueryClient();

export default function RealTime() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="real-time-container">
        <RealTimeContent />
      </div>
    </QueryClientProvider>
  );
}

function RealTimeContent() {
  const { data: listData, error, refetch } = useQuery('realTimeList', async () => {
    const response = await axios.get('/ft/realTime/list');
    return response.data;
  }, {
    refetchInterval: 5000,
  });

  const [rank, setRank] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setRank(prevRank => (prevRank === 9 ? 0 : prevRank + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const styles = {
    term: {
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column', // Change the direction to column for vertical alignment
      height: 20,
    },
    rankContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 50, // 숫자와 텍스트를 더 오른쪽으로 이동
      minHeight: '20px', // Ensure a minimum height to avoid jumping
    },
    rank: {
      color: 'orange',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      marginRight: 10,
    },
    rankName: {
      fontFamily: 'Arial, sans-serif',
      cursor: 'pointer',
    },
    menuPaper: {
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translateX(-30%)',
      width: '300px',
      marginTop: '10px'
    }
  };

  const handleListOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleListClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (query) => {
    navigate(`/itemlist/${query}`);
    handleListClose();
  };

  if (error) return <div>Error fetching data</div>;
  if (!listData) return <div>Loading...</div>;

  return (
    <Box >
      <div style={styles.term} onClick={handleListOpen}>
        <TransitionGroup>
          <CSSTransition
            key={rank}
            timeout={300} // 애니메이션 지속 시간
            classNames="slide"
          >
            <div style={styles.rankContainer}>
              <span style={styles.rank}>{(rank + 1).toString().padStart(2, '0')}</span>
              <span style={styles.rankName} >
                {listData[rank]?.query}
              </span>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleListClose}
        PaperProps={{
          style: styles.menuPaper,
        }}
        
        disableScrollLock
      >
        <Box sx={{ px: 2, pb: 2, mt: 2, }}>
          <Typography variant="subtitle2" color="textSecondary" align="center" gutterBottom>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            실시간 쇼핑 검색어
          </Typography>
        </Box>
        {listData.map((item, index) => (
          <MenuItem key={index} onClick={() => handleMenuItemClick(item.query)}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: 'orange', marginRight: 2, fontWeight:'bold' }}>
                {(index + 1).toString().padStart(2, '0')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'black' }}>
                {item.query}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}