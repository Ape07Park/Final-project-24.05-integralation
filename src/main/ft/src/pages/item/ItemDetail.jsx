import React, { useState, useEffect  } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Container, Snackbar } from '@mui/material';
import InquiryContent from "../../components/QnA/InquiryContent";
import ProductReviews from "../../components/review/ProductReviews";
import ProductQnA from "../../components/QnA/ProductQnA";
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import ItemDetailInfo from "../../components/Item/ItemDetailInfo";
import ItemInfo from "../../components/Item/ItemInfo";
import { fetchItemWishCounts, handleLikeClickAPI } from "../../api/wishApi ";
import { fetchQnAData, fetchReviewsData } from "../../api/boardApi";
import { fetchItemData } from "../../api/itemApi";
import { addToCart } from "../../api/cartApi";
import LoadingIndicator from "../../components/publics/LoadingIndicator";

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
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewCount] = useState(0);
  const [qnAs, setQnAs] = useState([]);
  const [qnAsCount, setQnAsCount] = useState(0);
  const [iswish, setIsWish] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [itemWishCount, setItemWishCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []); 

  useEffect(() => {
    const fetchItemDatas = async () => {
      try {
        const response = await fetchItemData(iid, currentUserEmail);
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
        console.log('상품 정보를 불러오는 중 에러:', error);
        setIsLoading(false);
      }
    };
  
    fetchItemDatas();
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
    if (!userInfo || !userInfo.email) {
      window.location.href = '/signIn';
      return;
    }
    const cartItem = {
      iid: item.iid,
      email: currentUserEmail,
      optionList: selectedOptions,
    };
  
    addToCart(cartItem)
      .then(response => {
        if (response) {
          const addToCartConfirmation = window.confirm('장바구니에 상품이 추가되었습니다.\n장바구니로 이동하시겠습니까?');
          if (addToCartConfirmation) {
            navigate('/cart');
          }
        } else if (selectedOptions.length === 0) {
          alert('옵션을 선택해주세요.');
        } else {
          alert('이미 장바구니에 있습니다.');
        }
      })
      .catch(error => {
        console.log('장바구니 추가 실패:', error);
      });
  };

  // 섹션으로 스크롤 이동 함수
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');

      if (!nav) return;

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

  useEffect(() => {
    fetchReviewsData(iid)
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
      window.location.href = '/signIn';
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
    fetchQnAData(iid)
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
            secretMsg: qna.secretMsg,
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
        console.log('Error fetching QnA:', err);
        setIsLoading(false);
        // 사용자에게 메시지 표시
        // 예를 들어, 에러 상태를 관리하는 state를 추가하여 에러 메시지를 화면에 렌더링할 수 있습니다.
      });
    }, []);

  // 찜기능
  const handleLikeClick = () => {
    if (!userInfo || !userInfo.email) {
      window.location.href = '/signIn';
      return;
    }
  
    handleLikeClickAPI(iid, userInfo.email)
    .then(response => {
      const value = response.data;
      if (value === 1) {
        setIsWish(true); 
      } else if (value === 0) {
        setIsWish(false); 
      }
  
      const fetchItemWishCount = async () => {
        try {
          const response = await fetchItemWishCounts(iid);
          const itemWishCount = response.data;
          setItemWishCount(itemWishCount);
        } catch (error) {
          console.log('아이템 찜 수를 불러오는 중 에러:', error);
        }
      };
    
      fetchItemWishCount();
  
    })
    .catch(error => {
      console.log('Error while updating like count:', error);
    });
  };

  const reloadReviewData = () => {
    fetchReviewsData(iid)
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
          setReviews([]);
        }
        setIsLoading(false);
      })
      .catch(err => console.log(err))

      // 아이템 디테일 데이터 가져오기
      fetchItemData(iid, userInfo.email)
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
    fetchQnAData(iid)
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
          secretMsg: qnas.secretMsg,
        }));
        setQnAs(formattedQnA);
        setQnAsCount(formattedQnA.length);
      } else {
        setQnAs([]);
      }
      setIsLoading(false);
    })
    .catch(err => console.log(err))
  }

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
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);
  
  const handleCopyLink = () => {
      const shareLink = window.location.href;
      const textField = document.createElement('textarea');
      textField.innerText = shareLink;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand('copy');
      textField.remove();
      setIsSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchItemWishCount = async () => {
      try {
        const response = await fetchItemWishCounts(iid);

        const itemWishCount = response.data;
        setItemWishCount(itemWishCount);
      } catch (error) {
        console.log('아이템 찜 수를 불러오는 중 에러:', error);
      }
    };
  
    fetchItemWishCount();
  }, [iid]);

  // =================== order item 관련 ======================
  const handleOrder = () => {
    if (!userInfo || !userInfo.email) {
      window.location.href = '/signIn'; 
      return;
    }
    if (selectedOptions.length === 0) {
      alert("옵션을 선택해주세요");
      return;
    }
    const orderItems = selectedOptions.map(option => ({
      iid: item.iid, 
      ioid: option.ioid, 
      option: option.option, 
      name:item.name, 
      img:item.img1, 
      count: option.count,
      price: item.salePrice && new Date(item.saleDate) > new Date() ? item.salePrice : item.price
    }));
    localStorage.setItem('orderItems', JSON.stringify(orderItems)); 
    navigate("/order", { state: { orderItems } });
  };    

  const nonMembersHandleOrder = () => {
    if (selectedOptions.length === 0) {
      alert("옵션을 선택해주세요");
      return;
    }
  
    const orderItems = selectedOptions.map(option => ({
      iid: item.iid, 
      ioid: option.ioid,
      option: option.option, 
      name:item.name, 
      img:item.img1, 
      count: option.count, 
      price: item.salePrice && new Date(item.saleDate) > new Date() ? item.salePrice : item.price
    }));
    localStorage.setItem('orderItems', JSON.stringify(orderItems)); 
    navigate("/order", { state: { orderItems } });
  };    

  return (
    <>
    {isLoading ? <LoadingIndicator /> : 
      <Grid container spacing={2} className="itemDetail">
        <Grid container spacing={2} className="itemDetail" sx={{ paddingLeft: { xs: 0, md: 10 } }}>
          {/* 상품 이미지 카드 */}
          <Grid item xs={12} md={6} style={{ padding: 50, textAlign: 'center' }}>
            <ItemDetailInfo item={item} tags={tags} navigate={navigate}/>
          </Grid>
          {/* 상품 정보 카드 */}
          <Grid item xs={12} md={5} style={{ padding: 50 }} > 
            <ItemInfo item={item} options={options} handleOptionChange={handleOptionChange}
              decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity} removeOption={removeOption} 
              totalPrice={totalPrice} handleOrder={handleOrder} handleAddToCart={handleAddToCart} 
              handleCopyLink={handleCopyLink} iswish={iswish} itemWishCount={itemWishCount} 
              handleLikeClick={handleLikeClick} selectedOptions={selectedOptions} nonMembersHandleOrder={nonMembersHandleOrder}
            />
          </Grid>
        </Grid>
        <nav style={{ backgroundColor: '#f8f9fa', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px 0', textAlign: 'center', width: '100%', position: isNavFixed ? 'sticky' : 'relative', top: isNavFixed ? 120 : 'auto', left: 0, zIndex: 1000 }}>
          <ul style={{ display: 'flex', justifyContent: 'center', listStyleType: 'none', padding: 0 }}>
            {['detail', 'review', 'qna'].map((id) => (
              <li key={id} style={{ margin: '0 3.5%' }}>
                <button onClick={() => handleSectionClick(id)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: '12px 16px', borderRadius: '8px', fontSize: 'calc(14px + 0.5vw)', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease', position: 'relative', margin: '0 10px' }}>
                  <span style={{ position: 'absolute', left: 0, bottom: '-4px', width: '100%', height: '2px', backgroundColor: id === activeSection ? '#000' : 'transparent' }}></span>
                  <span style={{ position: 'relative', zIndex: 1 }}>{id === 'detail' ? <span>상세정보</span> : id === 'review' ? <span >리뷰&후기({reviewsCount})</span> : id === 'qna' ? <span >문의({qnAsCount})</span> : id}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <Grid item xs={12} md={12}>
          <section id="detail">
            <Container>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sx={{ padding: { xs: 0, md: 5 }, textAlign: 'center' }}>
                  <img src={item.img2} alt={item.img2} style={{ width: '90%' }} />
                  <img src={item.img3} alt={item.img3} style={{ width: '90%' }} />
                </Grid>
              </Grid>
            </Container>
          </section>
        </Grid>
        <Grid item xs={12} md={12} >
          <section id="review">
            <Grid container spacing={2} justifyContent="center" sx={{ paddingLeft: { xs: 2, md: 10 }, paddingRight: { xs: 2, md: 10 } }}>
              <Grid item xs={12}>
                <ProductReviews reloadReviewData={reloadReviewData} reviews={reviews} item={item} />
              </Grid>
            </Grid>
          </section>
        </Grid>
        <Grid item xs={12} md={12}>
          <section id="qna" style={{marginTop: 100, marginBottom: 100}}>
            <Grid container spacing={2} justifyContent="center" sx={{ paddingLeft: { xs: 2, md: 10 }, paddingRight: { xs: 2, md: 10 } }}>
              <Grid item xs={12} >
                <ProductQnA posts={qnAs} reloadQnAData={reloadQnAData}/>
                <Button variant="contained" style={{ marginBottom: '20px', position:'relative', top:'-50px', border: '1px solid #1976d2', backgroundColor: 'white', color: '#1976d2', fontWeight: 'bold',}} onClick={() => openInquiryModal(iid)}>문의하기</Button>
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
      }
    </>
  )
}