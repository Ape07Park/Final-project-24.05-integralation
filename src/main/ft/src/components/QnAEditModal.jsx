import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Modal } from '@mui/material';
import { uploadImage } from "../api/cloudinary";
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { updateBoard } from '../api/boardApi';

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
          console.error('사용자 정보를 불러오는 중 에러:', error);
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
    };

    updateBoard(formData)
      .then(response => {
        console.log('Review submitted successfully:', response);
        handleClose();
      })
      .catch(error => {
        console.error('Error submitting review:', error);
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
        console.error('Error uploading image:', error);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <input type="file" accept="image/*" onChange={(e) => handleUpload('img', e.target.files[0])} style={{ marginRight: '10px' }} />
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
        <div style={{ textAlign: 'center' }}>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} style={{ marginRight: '5px', fontWeight: 'bold' }}>등록</Button>
          <Button variant="contained" color="error" onClick={handleCancel} style={{ fontWeight: 'bold' }}>취소</Button>
        </div>
      </div>
    </Modal>
  );
}
