import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, signOut, updateProfile, signInWithEmailAndPassword,
  onAuthStateChanged, sendPasswordResetEmail, OAuthProvider, deleteUser, 
  sendEmailVerification, RecaptchaVerifier, signInWithPhoneNumber, updatePassword } from "firebase/auth";
  import {getDatabase, ref, set, get, remove, update } from "firebase/database";
  
  
  const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

export { auth, updatePassword, signInWithEmailAndPassword };

/*========================= login =========================*/
export function login({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password)  // email, password 받기
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      return user;
    })
    .catch((error) => {
      // 로그인 실패
      const errorMessage = error.message;
      console.log('로그인 실패:', errorMessage);
      // 오류 메시지에 따라 알림창 띄우기
      let alertMessage = '';
      if (errorMessage === '올바르지 않은 이메일 형식입니다.') {
        alertMessage = '올바르지 않은 이메일 형식입니다.';
      } else if (errorMessage === '아이디나 비밀번호가 잘못되었습니다.') {
        alertMessage = '아이디나 비밀번호가 잘못되었습니다.';
      } else if (errorMessage === '존재하지 않는 사용자입니다.') {
        alertMessage = '존재하지 않는 사용자입니다.';
      } else {
        alertMessage = '아이디나 비밀번호가 잘못되었습니다.';
      }
      alert(alertMessage);
      throw error; // 오류를 호출한 곳으로 전달
    });
}

// # 구글 로그인
export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
  .then((result) => {

      
      insertUserDataWithSocial(result.user.email, result.user.displayName) // 사용자 정보 db에 저장
      return result.user; // 사용자 정보 반환
    })
    
    .catch(error => {
      console.log("Google 로그인 오류:", error);
      throw error; // 오류 재 throw
    });
}

// # 카카오 로그인
export function loginWithKakao(){
  const provider = new OAuthProvider('oidc.kakao');
  
  return signInWithPopup(auth, provider)
  .then((result) => {  
    // User is signed in.
    // IdP data available using getAdditionalUserInfo(result)

    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    const idToken = credential.idToken;
    
    insertUserDataWithSocial(result.user.email, result.user.displayName) // 사용자 정보 db에 저장
    return result.user;
  })
  .catch((error) => {
    console.log("kakao 로그인 오류:", error);
      throw error; // 오류 재 throw
  });
}

export function logout() {
  signOut(auth).catch(console.log);
}

// --------------------- #login 끝 ----------------------

/*========================= # Authentication =========================*/

// 사용자 등록
export function authRegister({ email, password, name, postCode, addr, detailAddr, 
  tel, req}) { //  사용처에서 obj로 처리하기에 그것에 맞춰서 제공 

  createUserWithEmailAndPassword(auth, email, password)
  
    // user 등록하기
    .then(() => {
      updateProfile(auth.currentUser, {
        email: email,
        password:password,
        name: name,
        postCode:postCode,
        addr: addr,
        detailAddr: detailAddr,
        tel: tel,
        req: req,       
      })
    })  
    .then(() => {
      insertUserData(email, password, name, postCode, addr, detailAddr, tel, 
        req);
        
    })
    .then(() => {logout()})
    
    .catch((error) => {
      // Firebase Authentication에 사용자 생성 중 오류 발생한 경우
      const errorCode = error.code;
      console.log("Error creating user:", error);

      // 오류 코드에 따라 다른 메시지 출력
      let errorMessage = "사용자 등록 중 오류가 발생했습니다. 나중에 다시 시도해주세요.";
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "이미 사용 중인 이메일 주소입니다. 다른 이메일 주소를 사용하세요.";
      }

      alert(errorMessage); // 오류 메시지 출력
      window.location.replace("/signUp")
    });
}

// Authentication에서 user 제거하고 DB에서도 제거 
export function authRemoveUser() {
  const user = auth.currentUser; // 현재 로그인된 사용자 가져오기

  // Firebase Authentication에서 사용자 삭제
  deleteUser(user).then(() => {
   
    // DB에서 사용자 삭제
    deleteUserData(user.email).then(() => {
      
    }).catch((error) => {
      // DB에서 사용자 삭제 중 오류 발생한 경우
      console.log("Error deleting user from Database:", error);
    });
  })
  .catch((error) => {
    // Firebase Authentication에서 사용자 삭제 중 오류 발생한 경우
    console.log("Error deleting user from Authentication:", error);
  });
}

// 받은 이메일로 비번 바꾸기 기능 
export function changePassword (email) {
  sendPasswordResetEmail(auth, email) // 비밀번호 재설정 이메일 보내기
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

/*========================= # Authentication 끝=========================*/

/*========================= DAO =========================*/
function insertUserData(email, password, name, postCode, addr, detailAddr, 
  tel, req) {
  if (!email) {
    console.log("이메일이 유효하지 않습니다.");
    return;
  }
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
  // Firebase Realtime Database에 사용자 정보를 저장하는 코드
  set(ref(database, 'users/' + sanitizedEmail), {
    email: email,
    password: password,
    name: name,
    postCode:postCode,
    addr: addr,
    detailAddr: detailAddr,
    tel: tel,
    req: req,
  }).then(() => {
    
    window.location.reload();
  }).catch((error) => {
    console.log("사용자 정보 저장 중 오류가 발생했습니다:", error);
  });
}

// 소셜 로그인을 이용하여 로그인 한 경우 DB에 데이터 저장
function insertUserDataWithSocial(email, displayName) {
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
  // Firebase Realtime Database에 사용자 정보를 저장하는 코드
  set(ref(database, 'users/' + sanitizedEmail), {
    email: email,
    name: displayName,
    password:'N/A', 
    postCode:'',
    addr: '',
    detailAddr: '',
    tel: '',
    req: '',
  }).then(() => {
  }).catch((error) => {
    console.log("사용자 정보 저장 중 오류가 발생했습니다:", error);
  });
}

export async function selectUserData(email) {

  if (!email) {
    console.log("이메일이 유효하지 않습니다.");
    return null;
  }
  
  const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일

  return get(ref(database, `users/${sanitizedEmail}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } 
      return null;
    })
    .catch(error => {
      console.log("사용자 정보를 가져오는 중 오류가 발생했습니다:", error);
      return null;
    });
}

export async function selectUserEmailPassword(email) {
  try {
    if (!email) {
      throw new Error("이메일이 유효하지 않습니다.");
    }

    const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일

    const snapshot = await get(ref(database, `users/${sanitizedEmail}`));

    if (snapshot.exists()) {
      const { email, password } = snapshot.val();
      const result = { email, password };
      
      return result;
    } else {
      console.log("사용자 정보가 존재하지 않습니다.");
      return null;
    }
  } catch (error) {
    console.log("사용자 정보를 가져오는 중 오류가 발생했습니다:", error);
    return null;
  }
}

export async function changePasswordFromDB(email, newPassword) {
  try {
    // 이메일이 정의되어 있지 않다면 오류를 발생시킵니다.
    if (!email) {
      throw new Error('이메일이 없습니다.');
    }

    // 이메일에서 특수 문자를 제거하여 정제합니다.
    const sanitizedEmail = email.replace(/[.#$[\]]/g, '');

    // 데이터베이스에서 해당 이메일을 가진 사용자의 정보를 업데이트합니다.
    await update(ref(database, `users/${sanitizedEmail}`), {
      password: newPassword // 새로운 비밀번호로 업데이트합니다.
    });
   
  } catch (error) {
    console.log('비밀번호 업데이트 중 오류가 발생했습니다:', error);
  }
}

// update
export async function updateUserData(user) {
  const { email, password, name, postCode, addr, detailAddr, tel, req } = user;
  try {
    // email이 정의되어 있을 때만 업데이트를 시도합니다.
    if (email) {
      const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
      await update(ref(database, `users/${sanitizedEmail}`), {
        name,
        password,
        postCode,
        addr,
        detailAddr,
        tel,
        req
      });
    } else {
      throw new Error('이메일이 없습니다.'); // email이 없으면 오류를 발생시킵니다.
    }
  } catch (error) {
    console.log('사용자 정보 업데이트 중 오류:', error);
  }
}

export async function deleteUserData(email) {
  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, ''); // 특수 문자를 제거한 이메일
    await remove(ref(database, `users/${sanitizedEmail}`));
    return { success: true, message: '사용자 정보가 성공적으로 삭제되었습니다.' };
  } catch (error) {
    console.log('사용자 정보 삭제 중 오류:', error);
    return { success: false, message: '사용자 정보 삭제 중 오류가 발생했습니다.' };
  }
}
/*========================= DAO 끝 =========================*/

/*========================= 인증 상태, 관리자 확인 끝 ==================*/

// # 사용자의 인증 상태가 변경될 때 호출되는 콜백 함수를 등록하고, 해제할 수 있는 unsubscribe 함수 반환
export function onUserStateChanged(callback) {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // 사용자가 인증된 경우, 관리자 정보를 가져와서 사용자 객체에 추가
      const adminUser = user ? await getAdminUser(user) : null;
      callback(adminUser);
    } else {
      // 사용자가 인증되지 않은 경우, 콜백 함수에 null 전달
      callback(null);
    }
  });

  return unsubscribe; // unsubscribe 함수 반환
}

// ====================

// # 관리자 가져오기 함수 

export async function getAdminUser(user) {
  try {
    const snapshot = await get(ref(database, 'admin'));
    if (snapshot.exists()) {
      const admins = snapshot.val();
      // 관리자 여부 확인 후 맞으면 true 
      const isAdmin = admins.includes(user.email);   
      return { ...user, isAdmin };
    }
    return user;
  } catch (error) {
    console.log("Error getting admin user:", error);
    return user; // 에러 발생 시 기본 사용자 정보 반환
  }
}
/*========================= 인증 상태, 관리자 확인 끝==================*/