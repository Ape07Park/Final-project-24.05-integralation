import React, { useState, useEffect } from 'react';

const Rating = ({ item, strSize }) => {
  const [popularity, setPopularity] = useState(0);
  const [ratesResArr, setRatesResArr] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (item && item.totalSta) {
      setPopularity(item.totalSta / 10);
    }
  }, [item]);

  const STAR_IDX_ARR = ['1', '2', '3', '4', '5'];

  const calcStarRates = () => {
    let tempStarRatesArr = [0, 0, 0, 0, 0];
    let starVerScore = (popularity * 70) / 5;

    let idx = 0;
    while (starVerScore > 14) {
      tempStarRatesArr[idx] = 14;
      idx += 1;
      starVerScore -= 14;
    }
    tempStarRatesArr[idx] = starVerScore;

    return tempStarRatesArr;
  };

  useEffect(() => {
    setRatesResArr(calcStarRates());
  }, [popularity]);

  return (
    <div>
      {ratesResArr.map((rate, idx) => (
        <span className='star_icon' key={idx}>
          <svg width={strSize} height={strSize} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 13' fill='#cacaca'>
            <clipPath id={`${item.iid}_${idx}StarClip`}>
              <rect width={rate} height='39' />
            </clipPath>
            <path
              id={`${item.iid}_${idx}Star`}
              d='M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z'
              transform='translate(-2 -2)'
            />
            <use clipPath={`url(#${item.iid}_${idx}StarClip)`} href={`#${item.iid}_${idx}Star`} fill='#FFB300' />
          </svg>
        </span>
      ))}
      <span>{popularity}</span><span>점</span>
    </div>
  );
};

export default Rating;
