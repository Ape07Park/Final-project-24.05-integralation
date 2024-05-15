import React, { useState, useEffect } from 'react';
import { Modal, Typography, Grid, TextField } from "@mui/material";
import { Button } from 'react-bootstrap';
import '../css/reviewForm.css';
import { uploadImage } from "../api/cloudinary";
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import CloseIcon from '@mui/icons-material/Close';
import { submitBoard } from '../api/boardApi';

const ReviewFormModal = ({ isOpen, handleClose, iid }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [form, setForm] = useState({ img: ''});
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

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (selectedRating) => {
    setHoveredRating(selectedRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      type: 'review',
      title: 'review',
      iid: iid,
      content: review,
      sta: (rating == 0) ? 1 * 10 : rating * 10,
      img: form.img,
      email: userInfo.email,
    };

    submitBoard(formData)
      .then(response => {
        console.log('Review submitted successfully:', response.data);
        handleClose();
        setRating(null)
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

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: 20 }}>
        <Typography variant="h5" style={{marginBottom: 10}}>리뷰 작성</Typography>
        <CloseIcon onClick={handleClose} style={{ position: 'absolute', top: 5, right: 5, cursor: 'pointer', fontSize: 20, color: 'black' }} />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label='리뷰' value={review} onChange={handleReviewChange} fullWidth multiline rows={6}/>
            </Grid>
            <Grid item xs={12}>
              <div className="rating">
                <label style={{ marginTop: 8 }}>평점:</label>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={`icon ${index + 1 <= (hoveredRating || rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(index + 1)}
                    onMouseEnter={() => handleRatingHover(index + 1)}
                    onMouseLeave={() => handleRatingHover(0)}
                    style={{ color: (index + 1 <= (hoveredRating || rating)) ? 'gold' : 'gray', cursor: 'pointer', fontSize: '1.5rem', margin: '0', padding: '0', outline: 'none', display: 'inline-block' }}
                  >
                    {index < (hoveredRating || rating) ? '★' : '☆'}
                  </div>
                ))}
              </div>
            </Grid>
            <Grid item xs={12}>
              <img src={form.img} alt={form.img} className='form-image' style={{width: '20%'}}/>
              <br/>
              <input type="file" accept="image/*" onChange={(e) => handleUpload('img', e.target.files[0])} />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button type='submit' variant='contained'>확인</Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewFormModal;
