import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import StarRatings from './StarRating';
import Rating from './Rating';
import ImgModal from '../publics/ImgModal';
import ReviewEditModal from './ReviewEditModal'; // 추가: 리뷰 수정 모달
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Button, MenuItem, Select } from '@mui/material';

// 리뷰 작성 폼 컴포넌트
const ReviewForm = () => {
  return (
    <div className="review-form" style={{ width: '100%' }}>
      {/* 리뷰 작성 폼 UI */}
    </div>
  );
};

// 별점 평가 옵션 컴포넌트
const RatingOption = ({ option, count, maxCount, increaseCommentCount }) => {
  const barWidth = (count / maxCount) * 100; // 막대 그래프의 너비 계산

  return (
    <div style={{ marginBottom: '1%', width: '100%', marginRight: '1%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ width: '10%', }}>{option}</div>
        <div style={{ width: '100%', position: 'relative', height: '30px', backgroundColor: 'lightgray', borderRadius: '20px' }}>
          <div style={{ position: 'absolute', width: `${barWidth}%`, height: '100%', backgroundColor: 'gray', borderRadius: '20px' }}></div>
        </div>
      </div>
    </div>
  );
};

const RatingOptions = ({ commentCounts, increaseCommentCount }) => {
  const maxCount = Math.max(...Object.values(commentCounts)); // 최대 댓글 수 계산

  return (
    <div className="bar-chart" style={{ width: '100%' }}>
      {[5, 4, 3, 2, 1].map((rating, index) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '150%' }} key={index}>
          <RatingOption
            option={`${rating}점`}
            count={commentCounts[rating]}
            maxCount={maxCount}
            increaseCommentCount={() => increaseCommentCount(rating)}
          />
          <span style={{ marginBottom: '2%', }}>
            ({commentCounts[rating] !== undefined ? commentCounts[rating] : 0})
          </span>
        </div>
      ))}
    </div>
  );
};


const ProductReviews = ({ reviews, item, reloadReviewData }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedRating] = useState(null);
  const [commentCounts, setCommentCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const reviewCardStyle = {
    marginBottom: '2%',
    paddingBottom: '1%',
    borderBottom: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: imageLoaded ? 'auto' : '270px', // 이미지 로드 상태에 따라 높이 조정
  };

  useEffect(() => {
    const newCommentCounts = {};
    reviews.forEach(review => {
      const rating = review.sta / 10;
      newCommentCounts[rating] = (newCommentCounts[rating] || 0) + 1;
    });
    setCommentCounts(newCommentCounts);
  }, [reviews]);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [sortBy, setSortBy] = useState('latest'); // 추가: 정렬 옵션 상태

  const sortedReviews = reviews.sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.regDate) - new Date(a.regDate);
    } else if (sortBy === 'highest') {
      return b.sta - a.sta;
    } else if (sortBy === 'lowest') {
      return a.sta - b.sta;
    } else if (sortBy === 'img') { // 추가: 사진이 있는 리뷰를 먼저 표시
      if (a.img && !b.img) return -1;
      if (!a.img && b.img) return 1;
      return 0;
    }
  });

  const filteredReviews = selectedRating
    ? sortedReviews.filter(review => review.sta === selectedRating)
    : sortedReviews;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (event, page) => setCurrentPage(page);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // 추가: 리뷰 수정 모달 열고 닫기를 위한 상태
  const [editModalOpen, setEditModalOpen] = useState(false);
  // 추가: 현재 수정 중인 리뷰 정보를 담을 상태
  const [editingReview, setEditingReview] = useState(null);

  // 추가: 리뷰 수정 모달 열기
  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditModalOpen(true);
  };

  // 추가: 리뷰 수정 모달 닫기
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    // 데이터 다시 불러오기
    reloadReviewData(); // 이렇게 호출하면 부모 컴포넌트로 신호를 보냄
  };

  return (
    <div className="product-reviews" style={{ width: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <div className="left-panel" style={{ width: '25%' }}>
          <h2>Review</h2>
          <Rating item={item} strSize={22} />
          <ReviewForm />
          <div className="write-review">
            {/* <button onClick={handleWriteReview} style={{marginTop: '5%'}}>상품 리뷰 작성하기</button> */}
          </div>
        </div>
        <Divider orientation="vertical" flexItem style={{ marginRight: '5%' }} />
        <div className="right-panel" style={{ width: '45%' }}>
          <h2>별점 평가</h2>
          <RatingOptions
            commentCounts={commentCounts}
          />
        </div>
      </Stack>
      <hr />
      <div className="bottom-panel" style={{ width: '100%' }}>
        <div className="sort-options" style={{ width: '100%' }}>
          {/* 정렬 옵션 선택 */}
          <Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: 100 }}
          >
            <MenuItem value="latest">최신순</MenuItem>
            <MenuItem value="highest">별점 높은 순</MenuItem>
            <MenuItem value="lowest">별점 낮은 순</MenuItem>
            <MenuItem value="img">사진</MenuItem>
          </Select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="reviews" style={{ width: '100%' }}>
        {currentReviews.map(review => (
          <div key={review.vid} style={reviewCardStyle}>
            {/* 리뷰 내용 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                <p style={{ marginRight: '1%' }}>{`${review.email.split('@')[0]}`}</p>
                <p style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '12px' }}>{new Date(review.regDate).toLocaleDateString().slice(0, -1)}</p>
                {/* 수정 버튼 */}
                {currentUserEmail === review.email ?
                  <Button onClick={() => handleEditReview(review, item)} style={{ marginLeft: 'auto', backgroundColor:'gray', color:'white', }}>수정</Button>
                  : ""}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                <StarRatings rating={review.sta} />
                <span style={{ marginLeft: '0.5%' }}>{review.sta / 10 + '점'}</span>
              </div>
              <p style={{ marginBottom: '1%' }}>{review.content}</p>
            </div>
            {/* 이미지 모달 */}
            {review.img && <ImgModal img={review.img} onLoad={handleImageLoad} />}
          </div>
        ))}
      </div>

      {/* 페이지네이션 UI */}
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={Math.ceil(filteredReviews.length / reviewsPerPage)} page={currentPage} variant="outlined" color="primary" onChange={handlePageChange} />
      </div>

      {/* 추가: 리뷰 수정 모달 */}
      {editModalOpen && (
        <ReviewEditModal
          open={editModalOpen}
          handleClose={handleCloseEditModal}
          review={editingReview}
          item={item}
        />
      )}
    </div>
  );
};

export default ProductReviews;
