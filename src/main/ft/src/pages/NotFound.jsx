import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const handle = () => {
    // 로그인 페이지로 이동
    navigate('/');
  };

  return (
    <div style={{margin: '20px'}}>
      <h1>Page Not Found!!!
        <span>
          <Button onClick={handle}>홈</Button>
        </span>
      </h1>
      <img src='/img/not-found.png' alt='error' />
    </div>
  )
}
