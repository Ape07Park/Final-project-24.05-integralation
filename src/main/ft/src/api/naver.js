import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Naver = () => {
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");

    const client_id = process.env.REACT_APP_NAVER_API_CLIENT_ID;
    const client_secret = process.env.REACT_APP_NAVER_API_CLIENT_SECRET;
    const redirect_uri = `${window.location.origin}/callback/naver`;

    const getNaverToken = async (code) => {
      try {
        const response = await fetch("https://nid.naver.com/oauth2.0/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Naver token");
        }
        const data = await response.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
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
