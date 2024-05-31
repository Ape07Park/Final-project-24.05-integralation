import React, { useState } from 'react';
import { Card, Typography } from '@mui/material';

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
    { id: 1, 
      name: '이강성 :', 
      description: '상품, 리뷰, 문의의 기능과 결제(toss), 택배(DeliveryTracker), Karlo, cloudinary api, 통합',
      oneLine: '기획할 때 API가 너무 많아 걱정이 되었습니다. 구현 실패한 API도 있었지만 API 사용방법을 공부하게 되어 좋은경험이었습니다.' , 
      imgUrl: '/img/circle01.png' },
    { id: 2, 
      name: '송햇님', 
      description: '택배(스마트택배) API, 주문내역캘린더, 문의, 비회원주문, 개발자페이지, 하트 토글',
      oneLine: '스마트 택배 API를 사용하면서 무료 이용량의 제한이 불편했고, 그래서 다른 팀원이 찾은 API를' + 
                '활용하여 문제를 해결했습니다. 모두가 새로운 API를 사용하면서 어려움을 겪었지만, 서로 도와가며' +
                '작업을 해서 더 친해지고 언어공부도 할 수 있는 좋은 기회가 되었습니다.',
      imgUrl: '/img/circle02.png' },
    { id: 3, 
      name: '정아름', 
      description: '후기, 회원 주문, footer, ERD, 통계(상품 분석), 실시간 검색어', 
      oneLine: 'React를 사용하면서 타 언어보다 효과적이게 작업 할 수 있다는 걸 알게 됐습니다. ' +
                '이걸 계기로 리액트 공부에 더 집중할 수 있도록 하겠습니다. ' +
                '그리고 검색 활용을 많이 해야 되는 걸 느꼈습니다. ' +
                '코드 에러가 나면 무엇 때문인지 찾는 게 재밌고 전보다 많은 공부를 하게 됐습니다.',
      imgUrl: '/img/circle03.png' },
    { id: 4, 
      name: '박성민', 
      description:  '주문, Firebase를 이용한 유저, 소셜로그인 기능과 RealtimeDB, Karlo, CoolSMS api', 
      oneLine: '개발 중 복잡한 문제를 쪼개어 해결한 후 통합하는 방식이 더 효율적임을 깨달았습니다. ' +
                '또한 파이어베이스를 공부하며 새로운 기술을 빠르게 습득하는 역량과 검색 및 자료 활용 능력이 ' +
                '개발자에게 중요하다는 것을 깨달았습니다.',
      imgUrl: '/img/circle04.png' },
    { id: 5, 
      name: '홍시표', 
      description: '최근 상품, 장바구니와 관리자 분석, 통계 페이지', 
      oneLine: 'react를 이용해서 웹을 띄우는게 처음으로 작업하는거라 코드 잡기가 어려웠습니다. ' +
                '또한 back단에서 axios를 이용해서 데이터를 넘겨줄때도 많은 오류가 발생해서 어떤 오류가' +
                '발생했고 왜 발생했는지 이유를 찾고 해결방안을 찾으면서 공부를 많이 한거같습니다. ',
      imgUrl: '/img/circle05.png' },
    { id: 6, 
      name: '김용현', 
      description: '디자인, 유저인터페이스, 페이지 데이터 출력 기능 연결', 
      oneLine: '이른 퇴근은 건강에 이롭다',
      imgUrl: '/img/circle06.png' },
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
            <div style={{fontWeight:'bold'}}>{circle.name}</div>
              <Card style={{padding: 5, textAlign:'left', width:'70%'}}>
                <div>
                  <span style={{fontWeight:'bold', fontSize: '0.9em'}}>담당: </span>
                  <span style={{fontSize: '0.8em'}}>{circle.description}</span>
                </div>
                <div>
                  <span style={{fontWeight:'bold', fontSize: '0.9em'}}>소감: </span>
                  <span style={{fontSize: '0.8em'}}>{circle.oneLine}</span>
                </div>
              </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperPage;
