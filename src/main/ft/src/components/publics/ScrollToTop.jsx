import React from 'react';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드럽게 스크롤
    });
  };

  return (
    <div> {/* 긴 페이지를 위한 예제 스타일 */}
      <button onClick={scrollToTop} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
        Scroll to Top
      </button>
    </div>
  );
}
