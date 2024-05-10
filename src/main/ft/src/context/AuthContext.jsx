// import { createContext, useContext, useEffect, useState } from "react";
// import { logout, onUserStateChanged, getAdminUser } from '../api/firebase';


// const AuthContext = createContext();

// export function AuthContextProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onUserStateChanged( async user => {
//       if (user) {
//         // 사용자가 인증된 경우, 관리자 정보를 가져와서 사용자 객체에 추가
//         const adminUser = await getAdminUser(user); // 사용자의 관리자 여부 확인
//         console.log("AuthContext "+ adminUser)
//         setUser(adminUser); // 관리자 여부가 추가된 사용자 객체를 상태에 설정
//         console.log(user);
//       } 
//     });
//     return () => user.unsubscribe(); // 클린업 함수에서 리스너 해제
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, logout }}>
//       { children }
//     </AuthContext.Provider>
//   );
// }

// export function useAuthContext() {
//   const auth = useContext(AuthContext);
//   return auth;
// }

import { createContext, useContext, useEffect, useState } from "react";
import { logout, onUserStateChanged, getAdminUser } from '../api/firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onUserStateChanged(async user => {
      if (user) {
        // 사용자가 인증된 경우, 관리자 정보를 가져와서 사용자 객체에 추가
        const adminUser = await getAdminUser(user); // 사용자의 관리자 여부 확인
        setUser(adminUser); // 관리자 여부가 추가된 사용자 객체를 상태에 설정
      } else {
        setUser(null); // 사용자가 로그아웃한 경우, 사용자 객체를 null로 설정
      }
    });
    
    return () => unsubscribe(); // 클린업 함수에서 리스너 해제
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      { children }
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const auth = useContext(AuthContext);
  return auth;
}


