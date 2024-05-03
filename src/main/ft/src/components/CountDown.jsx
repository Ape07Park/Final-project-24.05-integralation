import React, { useEffect, useState } from "react";

function CountDown({ saleDate }) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      if (saleDate) {
        const targetDateTime_ = saleDate.replace("T", " ");
        const targetDateTime = targetDateTime_.replace("-", "/");
        const endTime = new Date(targetDateTime);
        const timeDifference = endTime.getTime() - now.getTime();

        if (timeDifference > 0) {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          if (days === 0) {
            setTimeRemaining(`${twoDigit(hours)}:${twoDigit(minutes)}:${twoDigit(seconds)}`);
          } else {
            setTimeRemaining(`${days}일${twoDigit(hours)}:${twoDigit(minutes)}:${twoDigit(seconds)}`);
          }
        } else {
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [saleDate]);

  function twoDigit(num) {
    return (num < 10) ? '0' + num : String(num);
  }

  return <span>{timeRemaining}</span>;
}

export default CountDown;