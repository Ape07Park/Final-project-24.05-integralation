import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Toolbar } from '@mui/material'; // MUI에서 제공하는 Button 및 Toolbar 컴포넌트를 import

export default function AdminCategoryBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleItemClick = (path) => {
    navigate(path);
    setActiveTab(path);
  };

  const buttonStyle = {
    backgroundColor: '#ffffff',
    color: 'black',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    width: '150px',
    height: '63px',
    boxShadow: 'none', 
    borderRadius : 0,
    margin:'0',
    padding: '0',
  };

  return (
    <Toolbar
      style={{
        backgroundColor: 'white',
        padding: '0', 
        margin: '0',
        borderBottom: '2px solid red',
        justifyContent: 'center',
        height: 60 ,
        marginBottom: 30,
      }}
    >
      <Button
        onClick={() => handleItemClick('/admin/itemlist')}
        variant="contained"
        style={{
          ...buttonStyle,
          backgroundColor: activeTab === '/admin/itemlist' ? '#ff3333' : '#ffffff',
          color: activeTab === '/admin/itemlist' ? '#ffffff' : 'black',
        }}
      >
        상품 관리
      </Button>
      <Button
        onClick={() => handleItemClick('/admin/QnAlist')}
        variant="contained"
        style={{
          ...buttonStyle,
          backgroundColor: activeTab === '/admin/QnAlist' ? '#ff3333' : '#ffffff',
          color: activeTab === '/admin/QnAlist' ? '#ffffff' : 'black',
        }}
      >
        문의 내역
      </Button>
      <Button
        onClick={() => handleItemClick('/admin/order/list')}
        variant="contained"
        style={{
          ...buttonStyle,
          backgroundColor: activeTab === '/admin/order/list' ? '#ff3333' : '#ffffff',
          color: activeTab === '/admin/order/list' ? '#ffffff' : 'black',
        }}
      >
        주문 내역
      </Button>
      <Button
        onClick={() => handleItemClick('/admin/products')}
        variant="contained"
        style={{
          ...buttonStyle,
          backgroundColor: activeTab === '/admin/products' ? '#ff3333' : '#ffffff',
          color: activeTab === '/admin/products' ? '#ffffff' : 'black',
        }}
      >
        상품분석
      </Button>
      <Button
        onClick={() => handleItemClick('/admin/chart')}
        variant="contained"
        style={{
          ...buttonStyle,
          backgroundColor: activeTab === '/admin/chart' ? '#ff3333' : '#ffffff',
          color: activeTab === '/admin/chart' ? '#ffffff' : 'black',
        }}
      >
        통계
      </Button>
    </Toolbar>
  );
}
