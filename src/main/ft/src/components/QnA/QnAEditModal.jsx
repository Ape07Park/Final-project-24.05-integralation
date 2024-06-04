import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Modal } from '@mui/material';
import { uploadImage } from "../../api/cloudinary";
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { updateBoard } from '../../api/boardApi';

export default function QnAEditModal({ isOpen, handleClose, posts }) {
  const [inquiry, setInquiry] = useState('');
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [receiveNotification, setReceiveNotification] = useState(false);
  const [form, setForm] = useState({ img: '' });
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      } else {
        setCurrentUserEmail(null);
      }
    });
  }, [auth]);
  
  useEffect(() => {
    if (currentUserEmail) {
      const fetchUserInfo = async () => {
        try {
          const info = await selectUserData(currentUserEmail);
          setUserInfo(info);
          setIsAdmin(info && info.isAdmin === 1);
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (posts) {
      setInquiry(posts.content || '');
      setIssueType(posts.typeQnA || '');
      setTitle(posts.title || '');
      setIsPrivate(posts.private || false);
      setReceiveNotification(posts.receiveNotification || false);
      setForm({ img: posts.img || '' });
      setIsPrivate(posts.secretMsg === 1 ? true : false)
    }
  }, [posts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      bid: posts.bid,
      type: 'QnA',
      typeQnA: issueType,
      title: title,
      iid: posts.iid,
      content: inquiry,
      img: form.img,
      email: userInfo.email,
      secretMsg: isPrivate ? 1 : 0,
    };

    updateBoard(formData)
      .then(response => {
        handleClose();
      })
      .catch(error => {
        console.log('Error submitting review:', error);
      });
  };

  const handleUpload = (name, file) => {
    if (file) {
      uploadImage(file).then(url => {
        setForm(prevForm => ({
          ...prevForm,
          [name]: url
        }));
      }).catch(error => {
        console.log('Error uploading image:', error);
      });
    }
  }

  const handleCancel = () => {
    handleClose();
    setIssueType('');
    setTitle('');
    setInquiry('');
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const formImgDelete = (fieldName) => {
    if (window.confirm("정말로 사진을 삭제하시겠습니까?")) {
      setForm(prevForm => ({
        ...prevForm,
        [fieldName]: '' 
      }));
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>문의 수정하기</h2>
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel>문의유형</InputLabel>
          <Select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <MenuItem value="결제">결제문의</MenuItem>
            <MenuItem value="상품">상품문의</MenuItem>
            <MenuItem value="배송">배송문의</MenuItem>
            <MenuItem value="교환">교환문의</MenuItem>
            <MenuItem value="환불">환불문의</MenuItem>
          </Select>
        </FormControl>
        <TextField label="제목" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: '20px' }} />
        <TextField label="문의 내용" fullWidth multiline rows={4} value={inquiry} onChange={(e) => setInquiry(e.target.value)} style={{ marginBottom: '20px' }} />
        <FormControlLabel
          control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
          label="비밀글 문의하기"
          style={{ marginBottom: '20px' }}
        />
        <div style={{ marginBottom: '20px' }}>
          {form.img ? (
            <img
              src={form.img}
              alt={form.img}
              className="form-image"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '5px'
              }}
            />
          ) : (
            <div style={{ width: '100px', height: '100px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}></div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={(e) => handleUpload('img', e.target.files[0])} style={{ marginRight: '10px' }} />
        <Button size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => formImgDelete('img')}>사진삭제</Button>
        <div style={{ textAlign: 'center' }}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} style={{ marginRight: 5, border: '1px solid #1976d2', backgroundColor: 'white', color: '#1976d2', fontWeight: 'bold', }}>등록</Button>
          <Button variant="contained" color="error" onClick={handleCancel} style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }}>취소</Button>
        </div>
      </div>
    </Modal>
  );
}
