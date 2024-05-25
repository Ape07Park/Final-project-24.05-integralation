import React, { useState } from 'react';
import { Typography } from '@mui/material';

const Circle = ({ id, name, description, imgUrl, onClick }) => { 
  const circleStyle = {
    width: '100px',
    height: '100px',
    margin: '10px',
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  const hoverStyle = {
    backgroundColor: '#d0d0d0',
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const [hover, setHover] = useState(false);

  return (
    <div
      style={hover ? { ...circleStyle, ...hoverStyle } : circleStyle}
      onClick={() => onClick(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={imgUrl} alt={name} style={imgStyle} /> 
      <p>{description}</p> 
    </div>
  );
};

const DeveloperPage = () => {
  const [selectedCircle, setSelectedCircle] = useState(null);
  const circles = [
    { id: 1, name: '이강성 :', description: '상품, 리뷰, 문의의 기능과 결제, 택배 api, 통합 담당', imgUrl: '/img/circle01.png' },
    { id: 2, name: '송햇님 :', description: '나는 집에 가고싶다.', imgUrl: '/img/circle02.png' },
    { id: 3, name: '정아름 :', description: '휴먼양아치 지구망해라', imgUrl: '/img/circle03.png' },
    { id: 4, name: '박성민 :', description: '위에 망해라 ', imgUrl: '/img/circle04.png' },
    { id: 5, name: '홍시표 :', description: '이타치 ', imgUrl: '/img/circle05.png' },
    { id: 6, name: '김용현 :', description: '강점 ', imgUrl: '/img/circle06.png' },
  ];

  const handleCircleClick = (id) => {
    setSelectedCircle(circles.find(circle => circle.id === id));
  };

  const appStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  };


  return (
    <div style={appStyle}>
      <img src={'/img/topimage.png'} alt="Main" style={{ width: '50%', height: 'auto', objectFit: 'cover', margin: '20px auto' }} /> 
      <Typography  variant="h5">
      Furniture함께 만들어간 우리들의 소개
      </Typography>
      <div >
        {circles.map(circle => (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
            <Circle key={circle.id} id={circle.id} name={circle.name} description={circle.description} imgUrl={circle.imgUrl} onClick={handleCircleClick} />
            <div>{circle.name}</div>
            <div>{circle.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperPage;
