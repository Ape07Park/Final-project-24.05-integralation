import React from 'react';
import StarIcon from '@mui/icons-material/Star';

const StarRating = ({ rating }) => {
  // rating 값을 0과 5 사이로 제한
  const roundedRating = Math.max(0, Math.min(5, rating / 10));

  // 별 아이콘 배열 생성
  const stars = Array.from({ length: 5 }, (_, index) => (
    <StarIcon key={index} style={{ color: index < roundedRating ? '#FFB300' : '#cacaca' }} />
  ));

  return (
    <div>
      {stars}
    </div>
  );
};

export default StarRating;