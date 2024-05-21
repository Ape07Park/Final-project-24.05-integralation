import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const FindPassModal = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const getEmailMessage = async (email) => {
    try {
        const response = await axios.post('/ft/email/message', null, {
            params: { email: email }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching email message:', error);
        throw error;
    }
};

  // const handleBlur = async () => {
  //   try {
  //     const msg = await getEmailMessage(email);
  //     setMessage(msg);
  //   } catch (error) {
  //     console.error('Error fetching email message:', error);
  //   }
  // };

  return (
    <div>
      <p>
        이메일을 입력하세요
      </p>
      <TextField
        type="email"
        value={email}
        onChange={handleInputChange}
        // onBlur={handleBlur}
        placeholder="Enter your email"
      />
      <Button variant='contained' onClick={() => getEmailMessage(email)}>
        제출
      </Button>
      {message && (
        <div>
          <h1>이메일 주소 확인</h1>
          <p>아래 확인 코드를 회원가입 화면에서 입력해주세요.</p>
          <div>
            {/* <table>
              <tbody>
                <tr>
                  <td>{message}</td>
                </tr>
              </tbody>
            </table> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPassModal;