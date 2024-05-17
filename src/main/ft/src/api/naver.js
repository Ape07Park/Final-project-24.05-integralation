import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

const Naver = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  function generateStateToken() {
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");
    const returnedStateToken = params.get("state");

    const client_id = process.env.REACT_APP_NAVER_API_CLIENT_ID;
    const client_secret = process.env.REACT_APP_NAVER_API_CLIENT_SECRET;
    const redirect_uri = `${window.location.origin}/callback/naver`;

    const stateToken = generateStateToken();
    const encodedStateToken = encodeURIComponent(stateToken);

    // 상태 토큰을 세션 스토리지에 저장
    sessionStorage.setItem('stateToken', stateToken);

    // 네이버 OAuth 인증 URL 생성
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${encodedStateToken}`;

    console.log('Naver Auth URL:', naverAuthUrl);

    // 네이버 로그인 버튼 클릭 시 이 URL로 리디렉션
    window.location.href = naverAuthUrl;

    // 원래의 상태 토큰 가져오기
    const originalStateToken = sessionStorage.getItem('stateToken');

    // 상태 토큰 검증
    if (returnedStateToken !== originalStateToken) {
      console.error("State token mismatch. Possible CSRF attack.");
      navigate('/');
      return;
    }

    const getNaverToken = async (code) => {
      try {
        const response = await fetch("https://nid.naver.com/oauth2.0/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}`,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Naver token");
        }
        const data = await response.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
          window.Kakao.naver.setAccessToken(data.access_token);
        } else {
          throw new Error("Access token not found in response");
        }
      } catch (error) {
        console.error("Error getting Naver token:", error);
        navigate('/');
      }
    };

    // 코드가 존재하는 경우 토큰 가져오기
    if (code) {
      getNaverToken(code);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      {accessToken && <p>Access Token: {accessToken}</p>}
    </div>
  );
}

export default Naver;