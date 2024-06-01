import React from 'react';
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div >
      <IoIosArrowDropup
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '60px',
          right: '10px',
          fontSize: '35px',
          color: 'rgba(0, 0, 0, 0.5)', // 연한 색상 (검정색의 50% 투명도)
          cursor: 'pointer',
          zIndex: 999,
        }}
      />
      <IoIosArrowDropdown
        onClick={scrollToBottom}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '10px',
          fontSize: '35px',
          color: 'rgba(0, 0, 0, 0.5)', // 연한 색상 (검정색의 50% 투명도)
          cursor: 'pointer',
          zIndex: 999,
        }}
      />
    </div>
  );
}



