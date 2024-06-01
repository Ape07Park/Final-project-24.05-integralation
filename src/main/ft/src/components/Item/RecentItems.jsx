import React, { useState, useRef } from 'react';
import { Icon, List, ListItemText, Paper, Grid, CardMedia, Container } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

function TableCellWithEllipsis({ children, maxLength }) {
  const displayText = children.length > maxLength ? `${children.substring(0, maxLength)}...` : children;

  return <span style={{fontSize: 11}}>{displayText}</span>;
}

function RecentItems() {
  const recentItems = JSON.parse(localStorage.getItem('recentItems')) || [];
  const itemsToShow = recentItems.slice(0, 9);
  const [isExpanded, setIsExpanded] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate(); 

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  // 다른 곳을 클릭했을 때 팝업을 닫습니다.
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickCard = (item) => {
    navigate(`/item/detail/${item.iid}`)
    setIsExpanded(false);
  };

  return (
    <Container>
      {/* 팝업이 닫힐 때 뒷 배경 */}
      {isExpanded && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999, // 팝업보다 아래에 위치

          }}
          onClick={() => setIsExpanded(false)} // 백그라운드 클릭 시 팝업 닫기
        />
      )}
      <Paper
        ref={popupRef}
        style={{
          borderRadius: '5px',
          padding: isExpanded ? '10px' : '5px',
          maxHeight: isExpanded ? '530px' : '50px',
          overflowY: 'auto', 
          position: 'fixed',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: isExpanded ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0)',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          width: isExpanded ? '400px' : '30px',
          border: isExpanded ? '1px solid gray' : '0px'
        }}
      >
        <h1
          onClick={handleToggle}
          style={{
            fontSize: '1rem',
            marginBottom: isExpanded ? '10px' : '0px',
            marginTop: isExpanded ? '10px' : '5px',
            cursor: 'pointer',
            display: isExpanded ? 'none' : 'block', // 팝업이 닫혀있을 때는 보이게 함
          }}
        >
          <Icon component={AccessTimeIcon} />
        </h1>
        <h1
          style={{
            fontSize: '1rem',
            marginBottom: isExpanded ? '10px' : '0px',
            marginTop: isExpanded ? '10px' : '5px',
            cursor: 'pointer',
            display: isExpanded ? 'block' : 'none', // 팝업이 열려있을 때는 보이게 함
          }}
        >
          최근에 본 상품
          <span
            style={{
              float: 'right',
              cursor: 'pointer',
              marginRight: '5px',
            }}
            onClick={handleClose}
          >
            X
          </span>
        </h1>
        {isExpanded && (
          <List>
            <Grid container spacing={2}>
              {itemsToShow.map((item, index) => (
                <Grid item key={index} md={4} style={{ marginBottom: '1px', cursor: 'pointer', }} onClick={() => handleClickCard(item)}>
                  <div 
                    style={{ 
                        border: '1px solid rgba(211, 211, 211, 1)', 
                        padding: 5, 
                        textAlign: 'center', 
                        transition: 'border-color 0.3s', 
                        }}
                    onMouseOver={(e) => {e.currentTarget.style.borderColor = 'rgba(100, 100, 100, 1)';}} 
                    onMouseOut={(e) => {e.currentTarget.style.borderColor = 'rgba(211, 211, 211, 1)';}} 
                    onClick={() => handleClickCard(item)}
                  >
                    <CardMedia
                        component="img"
                        image={item.img1}
                        alt={item.name}
                        style={{ height: 100, width: 100, objectFit: 'cover', objectPosition: 'center', margin: 'auto' }}
                    />
                    <ListItemText
                        primary={<TableCellWithEllipsis maxLength={9}>{item.name}</TableCellWithEllipsis>}
                        secondary={item.description}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default RecentItems;
