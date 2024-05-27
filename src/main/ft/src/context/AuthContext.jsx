import { createContext, useContext, useEffect, useState } from "react";
import { logout, onUserStateChanged, getAdminUser } from '../api/firebase';

// AuthContext 생성
const AuthContext = createContext();

// 세션 타임아웃 시간 설정 (12시간을 밀리초 단위로 계산)
const SESSION_TIMEOUT = 1000 * 60 * 60 * 12; // 12시간 (밀리초 단위), 1000이 1초

// AuthContextProvider 컴포넌트 정의
export function AuthContextProvider({ children }) {
  // 사용자 상태를 관리하는 state
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 세션 만료 여부를 확인하는 함수
    const checkSessionTimeout = () => {
      const loginTime = localStorage.getItem('loginTime'); // 로그인 시간 가져오기
      if (loginTime) {
        const currentTime = new Date().getTime(); // 현재 시간 가져오기
        if (currentTime - loginTime > SESSION_TIMEOUT) {
          handleLogout(); // 세션이 만료되었으면 로그아웃 처리
        }
      }
    };

    // 로그아웃을 처리하는 함수
    const handleLogout = async () => {
      await logout(); // Firebase 로그아웃 함수 호출
      setUser(null); // 사용자 상태를 null로 설정
      localStorage.removeItem('loginTime'); // localStorage에서 로그인 시간 제거
      alert("일정 시간이 지나 로그아웃 되었습니다.")
    };

    // 사용자 상태 변경을 감지하는 함수
    const unsubscribe = onUserStateChanged(async user => {
      if (user) {
        const adminUser = await getAdminUser(user); // 관리자 여부 확인
        setUser(adminUser); // 사용자 상태에 관리자 여부 추가하여 설정
        localStorage.setItem('loginTime', new Date().getTime()); // 현재 시간을 로그인 시간으로 저장
      } else {
        setUser(null); // 사용자 상태를 null로 설정
        localStorage.removeItem('loginTime'); // localStorage에서 로그인 시간 제거
      }
    });

    // 일정 간격으로 세션 만료 여부를 확인하는 타이머 설정 (1분마다 확인)
    const interval = setInterval(checkSessionTimeout, 1000 * 60 * 60 * 6); // 6시간마다 확인 1000 * 60 * 60 * 6

    // 컴포넌트 언마운트 시 정리 작업 수행 (리스너 해제 및 타이머 제거)
    return () => {
      unsubscribe(); // onUserStateChanged 리스너 해제
      clearInterval(interval); // 타이머 제거
    };
  }, []);

  // AuthContext.Provider를 통해 자식 컴포넌트에 사용자 상태와 로그아웃 함수 제공
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// AuthContext를 사용하는 커스텀 훅 정의
export function useAuthContext() {
  const auth = useContext(AuthContext); // AuthContext 값 가져오기
  return auth; // AuthContext 값 반환
}
