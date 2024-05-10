import React, { useState, useEffect, useRef  } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { CardContent, CardMedia, Snackbar, Typography } from '@mui/material';
import CountDown from "../components/CountDown";
import Rating from "../components/Rating";
import ReviewForm from "../components/ReviewForm";
import InquiryContent from "../components/InquiryContent";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProductReviews from "../components/ProductReviews";
import ProductQnA from "../components/ProductQnA";
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Card } from "react-bootstrap";


export default function ItemDetail() {
  const { iid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState({});
  const [options, setOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewCount] = useState(0);
  const [qnAs, setQnAs] = useState([]);
  const [qnAsCount, setQnAsCount] = useState(0);
  const [iswish, setIsWish] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const shareLinkRef = useRef(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [itemWishCount, setItemWishCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 로드될 때마다 맨 위로 스크롤
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const userEmail = currentUserEmail || 'em'; // 로그인한 사용자의 이메일이 없으면 'em'을 사용
        const response = await axios.get(`/ft/item/detail/${iid}/${userEmail}`);
        const { item, options, tags, value } = response.data;
        const formattedItem = {
          iid: item.iid,
          name: item.name,
          category: item.category,
          img1: item.img1,
          img2: item.img2,
          img3: item.img3,
          price: item.price,
          saleDate: item.saleDate,
          salePrice: item.salePrice,
          totalSta: item.totalSta,
        };
        setItem(formattedItem);

        const formattedTags = tags ? tags.map(tag => ({
          itid: tag.itid,
          tag: tag.tag,
        })) : [];
        setTags(formattedTags);

        const formattedOptions = options ? options.map(option => ({
          ioid: option.ioid,
          option: option.option,
          stock: option.count, 
          count: 0, 
          price: option.price, 
        })) : [];
        setOptions(formattedOptions);

        setIsWish(value === 1);
        setIsLoading(false);
      } catch (error) {
        console.error('상품 정보를 불러오는 중 에러:', error);
        setIsLoading(false);
      }
    };
  
    fetchItemData();
  }, [iid, currentUserEmail]);

  const increaseQuantity = (index, stock) => {
    const updatedSelectedOptions = [...selectedOptions];
    const currentQuantity = updatedSelectedOptions[index].count;
    if (currentQuantity < stock) { // 최대값 설정
      updatedSelectedOptions[index].count += 1;
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const decreaseQuantity = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    if (updatedSelectedOptions[index].count > 1) {
      updatedSelectedOptions[index].count -= 1;
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const handleOptionChange = (e) => {
    const selectedOption = e.target.value;
    const optionIndex = options.findIndex(option => option.option === selectedOption);
    if (optionIndex !== -1) {
      const updatedOptions = [...options];
      updatedOptions[optionIndex].count = 1;
      if (isOptionAlreadySelected(selectedOption)) {
        alert('이미 옵션이 선택되어 있습니다.');
        return;
      }
      setSelectedOptions([...selectedOptions, updatedOptions[optionIndex]]);
    }
  };

  const isOptionAlreadySelected = (selectedOption) => {
    return selectedOptions.some(option => option.option === selectedOption);
  };

  const removeOption = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
  };

  useEffect(() => {
    let totalPrice = 0;
    selectedOptions.forEach(option => {
      totalPrice += option.count * Number(document.getElementById('currentPrice').innerText.replace(/,/g, ''));
    });
    setTotalPrice(totalPrice);
  }, [selectedOptions]);

  const handleAddToCart = () => {
    const cartItem = {
      iid: item.iid,
      email: currentUserEmail,
      optionList: selectedOptions,
    };
  
    axios.post('/ft/api/v2/carts', cartItem)
      .then(response => {
        console.log(response);
        if(response.data) {
          const addToCartConfirmation = window.confirm('장바구니에 상품이 추가되었습니다.\n장바구니로 이동하시겠습니까?');
          if (addToCartConfirmation) {
            navigate('/cart');
          }
        } else if(selectedOptions.length === 0) {
          alert('옵션을 선택해주세요.')   
        } else{
          console.log(options);
          alert('이미 장바구니에 있습니다.')    
        }
      })
      .catch(error => {
        console.error('장바구니 추가 실패:', error);
      });
  };

  // 섹션으로 스크롤 이동 함수
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      const navOffsetTop = nav.offsetTop -250;  // 상단 고정되는 시간

      if (window.scrollY >= navOffsetTop) {
        setIsNavFixed(true);
      } else {
        setIsNavFixed(false);
      }

      const sections = document.querySelectorAll('section');
      let currentSectionId = null;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - nav.clientHeight; 
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          currentSectionId = section.id;
        }
      });

      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSectionClick = (id) => {
    const section = document.getElementById(id);
    const sectionTop = section.offsetTop - document.querySelector('nav').clientHeight; // Adjusted for nav height
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  };

  // 리뷰모달
  const openModal = () => {
    if (!userInfo || !userInfo.email) {
      // 사용자가 로그인되어 있지 않은 경우, 로그인 페이지로 리다이렉트
      window.location.href = '/signIn'; // 로그인 페이지 URL을 실제로 사용하는 주소로 변경해주세요
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reloadReviewData();
  };
  // 리뷰 데이터 get
  useEffect(() => {
    axios.get(`/ft/board/list/review/${iid}`)
      .then(jArr => {
        const reviews = jArr.data;
        if (reviews) {
          const formattedReviews = reviews.map(review => ({
            bid: review.bid,
            iid: review.iid,
            email: review.email,
            type: review.type,
            typeQnA: review.typeQnA,
            title: review.title,
            regDate: review.regDate,
            content: review.content,
            img: review.img,
            sta: review.sta,
            vid: review.vid,
          }));
          setReviews(formattedReviews);
          setReviewCount(formattedReviews.length);
        } else {
          // 데이터가 없을 때의 처리
          setReviews([]);
        }
        setIsLoading(false);
      })
      .catch(err => console.log(err))
  }, []); 

  // 문의 모달
  const openInquiryModal = () => {
    if (!userInfo || !userInfo.email) {
      // 사용자가 로그인되어 있지 않은 경우, 로그인 페이지로 리다이렉트
      window.location.href = '/signIn'; // 로그인 페이지 URL을 실제로 사용하는 주소로 변경해주세요
      return;
    }
    setIsInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false);
    reloadQnAData()
  };

  // 문의 데이터 get
  useEffect(() => {
    axios.get(`/ft/board/list/QnA/${iid}`)
      .then(jArr => {
        const qnas = jArr.data;
        if (qnas) {
          const formattedQnA = qnas.map(qna => ({
            bid: qna.bid,
            iid: qna.iid,
            email: qna.email,
            type: qna.type,
            typeQnA: qna.typeQnA,
            title: qna.title,
            regDate: qna.regDate,
            content: qna.content,
            img: qna.img,
          }));
          setQnAs(formattedQnA);
          setQnAsCount(formattedQnA.length);
        } else {
          // 데이터가 없을 때의 처리
          setQnAs([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching QnA:', err);
        setIsLoading(false);
        // 사용자에게 메시지 표시
        // 예를 들어, 에러 상태를 관리하는 state를 추가하여 에러 메시지를 화면에 렌더링할 수 있습니다.
      });
    }, []);
  // 찜기능
  const handleLikeClick = () => {
    if (!userInfo || !userInfo.email) {
      // 사용자가 로그인되어 있지 않은 경우, 로그인 페이지로 리다이렉트
      window.location.href = '/signIn'; // 로그인 페이지 URL을 실제로 사용하는 주소로 변경해주세요
      return;
    }
  
    axios.post(`/ft/wish/click`, {
      iid: iid,
      email: userInfo.email
    })
    .then(response => {
      // 서버로부터 응답 받은 데이터를 처리
      const value = response.data;
      // 서버에서 반환된 value 값이 1인 경우 좋아요 표시, 0인 경우 좋아요 해제
      if (value === 1) {
        setIsWish(true); // 좋아요 표시
      } else if (value === 0) {
        setIsWish(false); // 좋아요 해제
      }
  
      // 아이템 찜 수를 가져오는 요청
      const fetchItemWishCount = async () => {
        try {
          const response = await axios.get(`/ft/wish/count/${iid}`);
          const itemWishCount = response.data;
          setItemWishCount(itemWishCount);
        } catch (error) {
          console.error('아이템 찜 수를 불러오는 중 에러:', error);
        }
      };
    
      fetchItemWishCount();
  
    })
    .catch(error => {
      console.error('Error while updating like count:', error);
    });
  };

  const reloadReviewData = () => {
    axios.get(`/ft/board/list/review/${iid}`)
      .then(jArr => {
        const reviews = jArr.data;
        if (reviews) {
          const formattedReviews = reviews.map(review => ({
            bid: review.bid,
            iid: review.iid,
            email: review.email,
            type: review.type,
            typeQnA: review.typeQnA,
            title: review.title,
            regDate: review.regDate,
            content: review.content,
            img: review.img,
            sta: review.sta,
            vid: review.vid,
          }));
          setReviews(formattedReviews);
          setReviewCount(formattedReviews.length);
        } else {
          // 데이터가 없을 때의 처리
          setReviews([]);
        }
        setIsLoading(false);
      })
      .catch(err => console.log(err))

      // 아이템 디테일 데이터 가져오기
    axios.get(`/ft/item/detail/${iid}/${userInfo.email}`)
    .then(response => {
      const { item, options, tags, value } = response.data;
      const formattedItem = {
        iid: item.iid,
        name: item.name,
        category: item.category,
        img1: item.img1,
        img2: item.img2,
        img3: item.img3,
        price: item.price,
        saleDate: item.saleDate,
        salePrice: item.salePrice,
        totalSta: item.totalSta,
      };
      setItem(formattedItem);

      const formattedOptions = options ? options.map(option => ({
        ioid: option.ioid,
        option: option.option,
        stock: option.count, 
        count: 0, 
        price: option.price, 
      })) : [];
      setOptions(formattedOptions);

      const formattedTags = tags ? tags.map(tag => ({
        itid: tag.itid,
        tag: tag.tag,
      })) : [];
      setTags(formattedTags);
      
      console.log(value);
      if (value === 1){
        setIsWish(true)
      } else{
        setIsWish(false)
      }

      setIsLoading(false);
    })
    .catch(err => console.log(err));
  };

  const reloadQnAData = () => {
    axios.get(`/ft/board/list/QnA/${iid}`)
    .then(jArr => {
      const qnas = jArr.data;
      if (qnas) {
        const formattedQnA = qnas.map(qnas => ({
          bid: qnas.bid,
          iid: qnas.iid,
          email: qnas.email,
          type: qnas.type,
          typeQnA: qnas.typeQnA,
          title: qnas.title,
          regDate: qnas.regDate,
          content: qnas.content,
          img: qnas.img,
          sta: qnas.sta,
        }));
        setQnAs(formattedQnA);
        setQnAsCount(formattedQnA.length);
      } else {
        // 데이터가 없을 때의 처리
        setQnAs([]);
      }
      setIsLoading(false);
    })
    .catch(err => console.log(err))
  }

  // 유저정보
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
  // 공유하기 노멀링크
  const handleCopyLink = () => {
    const shareLink = window.location.href;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        console.log('링크가 클립보드에 복사되었습니다.');
        setIsSnackbarOpen(true); // 알람 표시
      })
      .catch((error) => {
        console.error('링크 복사 실패:', error);
      });
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false); // 알람 닫기
  };

  useEffect(() => {
    const fetchItemWishCount = async () => {
      try {
        const response = await axios.get(`/ft/wish/count/${iid}`);

        const itemWishCount = response.data;
        setItemWishCount(itemWishCount);
      } catch (error) {
        console.error('아이템 찜 수를 불러오는 중 에러:', error);
      }
    };
  
    fetchItemWishCount();
  }, [iid]);

  // =================== order item 관련 ======================

  const handleOrder = () => {
    if (!userInfo || !userInfo.email) {
      // 사용자가 로그인되어 있지 않은 경우, 로그인 페이지로 리다이렉트
      window.location.href = '/signIn'; 
      return;
    }
  
    // Ensure that selectedOptions has at least one option selected
    if (selectedOptions.length === 0) {
      alert("옵션을 선택해주세요");
      return;
    }
  
    const orderItems = selectedOptions.map(option => ({
      iid: item.iid, // db
      ioid: option.ioid, // db
      option: option.option, // db
      name:item.name, // db
      img:item.img1, // db
      count: option.count, // db
      price: item.salePrice && new Date(item.saleDate) > new Date() ? item.salePrice : item.price
    }));
  
    // orderItems를 로컬 스토리지에 저장
    localStorage.setItem('orderItems', JSON.stringify(orderItems)); //  객체나 배열을 JSON 문자열로 변환
    console.log(orderItems);
    // Order 페이지로 이동할 때 orderItems 상태를 함께 전달
    navigate("/order", { state: { orderItems } });
  };    
  
    // =================== order item 관련 끝======================

  return (
    <Grid container spacing={2} className="itemDetail">
      {/* 왼쪽 여백 */}
      <Grid item xs={1} md={1} sx={{ placeItems: 'center', display: { xs: 'none',  lg: 'flex' }, }}>
      </Grid>

      {/* 상품 이미지 카드 */}
      <Grid item xs={12} md={5} style={{ padding: 50, textAlign: 'center' }}>
        <Card>
          {/* 상품 이미지 */}
          <CardMedia
            component="img"
            image={item.img1}
            alt={item.img1}
            style={{ height: 380 }}
          />
          <CardContent>
            {/* 상품 평점 및 태그 */}
            <Rating item={item} strSize={22}/>
            {tags.map((tag, index) => (
              <span 
                key={index}
                style={{ 
                  cursor: 'pointer',
                  display: "inline-block", 
                  borderRadius: "999px",
                  padding: "2px 8px", 
                  marginRight: "5px",
                  fontSize: "0.7rem", 
                  fontWeight: "bold", 
                  color: "black", 
                  backgroundColor: "lightgrey", 
                  border: "1px solid grey", 
                }}
                onClick={() => navigate(`/itemlist/${tag.tag}`)}
              >
                #{tag.tag}
              </span>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* 오른쪽 여백 */}
      <Grid item md={1} sx={{ placeItems: 'center', display: { xs: 'none', lg: 'flex' }, }}>
      </Grid>

      {/* 상품 정보 카드 */}
      <Grid item xs={12} md={5} style={{ padding: 50 }}>
        <Card>
          <CardContent>
            {/* 상품 이름 및 가격 */}
            <Typography variant="h5" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <CountDown saleDate={item.saleDate} />
            </Typography>
            {/* 가격 정보 */}
            <div style={{ marginBottom: '10px' }} >
              {/* 세일 가격 표시 */}
              <span id="nowPrice" style={item.salePrice && new Date(item.saleDate) > new Date() ? { textDecoration: 'line-through', lineHeight: '1.5', fontSize: 'small' } : {}}>
                {item.saleDate && new Date(item.saleDate) > new Date() && item.price ? `${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원` : ''}
              </span><br/>
              {/* 현재 가격 표시 */}
              <span id="currentPrice">{item.saleDate && new Date(item.saleDate) > new Date() ? (item.salePrice ? item.salePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '') : (item.price ? item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}</span><span>원</span>
            </div>
            {/* 옵션 선택 */}
            <div style={{ marginBottom: '10px' }}>
              {/* 옵션 선택 메뉴 */}
              <Select
                value=''
                onChange={handleOptionChange}
                displayEmpty
                title="옵션 선택"
                fullWidth
                style={{ width: '80%' }}
                MenuProps={{ PaperProps: { style: { width: 'max-content' } } }}
              >
                <MenuItem value='' disabled>옵션 선택</MenuItem>
                {options.map(option => (
                  <MenuItem 
                    key={option.option} 
                    value={option.option} 
                    style={{ justifyContent: 'space-between' }}
                    disabled={option.stock === 0}
                  >
                    <span>{option.option}</span>
                    <span>{option.stock}개</span>
                  </MenuItem>
                ))}
              </Select>
              {/* 선택된 옵션 표시 */}
              {selectedOptions.map((option, index) => (
                <Box 
                  key={index} 
                  display="flex" 
                  alignItems="center" 
                  marginBottom={1} 
                  p={1}
                  borderRadius={1}
                  boxShadow={2}
                  bgcolor="#f5f5f5"
                  border="1px solid #ccc"
                  style={{ width: '75%', marginTop: 5, minHeight: 50 }} 
                >
                  <Typography variant="body1" style={{ flexGrow: 1 }}>
                    {option.option}
                  </Typography>
                  <Button onClick={() => decreaseQuantity(index)}>-</Button>
                  <Input
                    value={option.count}
                    readOnly
                    style={{ width: `${(option.count.toString().length + 1) * 10}px`, margin: '0 5px' }} 
                    disableUnderline 
                    inputProps={{ min: 0, max: 5 }}
                  />
                  <Button onClick={() => increaseQuantity(index, option.stock)}>+</Button>
                  <Button onClick={() => removeOption(index)}>X</Button>
                </Box>
              ))}
            </div>
            {/* 총 가격 표시 */}
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              총 가격: {totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
            </Typography>
            {/* 주문 및 장바구니 버튼 */}
            <Button variant="contained" color="primary" style={{ marginBottom: '10px' }} 
            onClick={handleOrder}>주문하기</Button> 
            <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5 }} onClick={handleAddToCart}>장바구니</Button>
            <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5, backgroundColor: '#808080' }}>비회원 주문하기</Button>
            <br/>
            {/* 공유 및 찜하기 버튼 */}
            <Button variant="contained" color="primary" style={{ marginBottom: '10px' }} onClick={handleCopyLink}>공유하기</Button>
            <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5, backgroundColor: 'transparent', color: 'black', }} onClick={handleLikeClick}>
              {iswish ? <FavoriteIcon style={{ color: 'red', width: 18 }} /> : <FavoriteBorderIcon style={{width:18}}/>} {itemWishCount}
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <nav style={{ backgroundColor: '#f8f9fa', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px 0', textAlign: 'center', width: '100%', position: isNavFixed ? 'sticky' : 'relative', top: isNavFixed ? 120 : 'auto', left: 0, zIndex: 1000 }}>
        <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0 }}>
          {['detail', 'review', 'qna'].map((id) => (
            <li key={id} style={{ margin: '0 20px' }}>
              <button onClick={() => handleSectionClick(id)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '12px 16px', borderRadius: '8px', fontSize: 'calc(14px + 0.5vw)', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease', position: 'relative', margin: '0 10px' }}>
                <span style={{ position: 'absolute', left: 0, bottom: '-4px', width: '100%', height: '2px', backgroundColor: id === activeSection ? '#000' : 'transparent' }}></span>
                <span style={{ position: 'relative', zIndex: 1 }}>{id === 'detail' ? <span>상세정보</span> : id === 'review' ? <span >리뷰&후기({reviewsCount})</span> : id === 'qna' ? <span >문의({qnAsCount})</span> : id}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="detail">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} style={{ padding: 50, textAlign: 'center' }}>
              <img src={item.img2} alt={item.img2} style={{ width: '90%' }} />
              <img src={item.img3} alt={item.img3} style={{ width: '90%' }} />
            </Grid>
          </Grid>
        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
        <section id="review">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} style={{ paddingLeft: 100 , paddingRight: 100 }}>
              <Button variant="contained" color="primary" size="small" style={{ marginRight: 10 }} onClick={() => openModal(iid)}>리뷰작성</Button>
              <ReviewForm isOpen={isModalOpen} handleClose={closeModal} iid={iid} /> 
              <ProductReviews reloadReviewData={reloadReviewData} reviews={reviews} item={item} />
            </Grid>
          </Grid>
        </section>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <section id="qna">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} style={{ paddingLeft: 100 , paddingRight: 100  }}>
              <ProductQnA posts={qnAs} reloadQnAData={reloadQnAData}/>
              <Button variant="contained" style={{ marginBottom: '20px', backgroundColor: '#808080' }} onClick={() => openInquiryModal(iid)}>문의하기</Button>
              <InquiryContent isOpen={isInquiryModalOpen} handleClose={closeInquiryModal} iid={iid}/>
            </Grid>
          </Grid>
        </section>
      </Grid>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000} // 3초 후에 알람이 사라집니다.
        onClose={handleCloseSnackbar}
        message="링크가 클립보드에 복사되었습니다."
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
    </Grid>
  )
}
