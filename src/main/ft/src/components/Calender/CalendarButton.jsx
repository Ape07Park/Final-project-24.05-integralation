import React from 'react';
import { BiCalendar } from "react-icons/bi";// RiCalendar2Fill 아이콘을 가져옴
import '../../css/CalendarButton.css'; // CalendarButton 스타일 시트를 가져옴

// CalendarButton 컴포넌트 정의
const CalendarButton = ({ goOrderListView }) => {
  return (
    <a
      href="#ar-mytmall_cal"                                          
      onClick={() => goOrderListView('CAL')} // 클릭 시 goOrderListView 함수 호출
      className="btn_sort_type calendar" // 클래스명 추가: btn_sort_type과 calendar
      role="tab" // 탭 역할을 수행
      aria-controls="ar-mytmall_cal" // 관련 콘텐츠의 ID
      aria-selected="false" // 선택되지 않음
      data-log-actionid-area="orderinfo_delivery" // 로그 영역 식별자
      data-log-actionid-label="sort_type" // 로그 라벨 식별자
      data-log-body='{"btn_name":"캘린더보기"}' // 로그에 기록될 정보
    >
      {/*  BiCalendar 아이콘 */}
      < BiCalendar style={{ marginRight: '3px', fontSize: '18px', color: '#888', textAlign:'end' }} />

      {/* 캘린더보기 텍스트 */}
      <span style={{ fontSize: '14px' }}>캘린더보기  </span>
       
    </a>
      
  );
};

export default CalendarButton; // CalendarButton 컴포넌트를 내보냄
