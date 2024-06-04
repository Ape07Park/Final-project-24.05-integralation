import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button, Container, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CountDown from "../../components/Item/CountDown";
import SaleModal from "../../components/Item/SaleModal";
import AdminCategoryBar from "../../components/admin/AdminCategoryBar";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { deletedItem, fetchItemListAPI, getItemDetail } from "../../api/itemApi";
import LoadingIndicator from "../../components/publics/LoadingIndicator";

export default function AdminItemList() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [stock, setStock] = useState([]); 
  const [modalOpen, setModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null); 
  const [selectedPrice, setSelectedPrice] = useState(null); 
  const [selectedCost, setSelectedCost] = useState(null); 
  const [selectedSalePrice, setSelectedSalePrice] = useState(null); 
  const [selectedSaleDate, setSelectedSaleDate] = useState(null); 

  useEffect(() => {
    fetchItemListAPI()
      .then(res => {
        setList(res);
        setIsLoading(false);
      })
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    // 각 항목에 대한 iid 가져오기
    const itemIds = list.map(item => item.iid);
    // iid 배열을 사용하여 재고
    itemIds.forEach((iid, idx) => {
      getItemDetail(iid)
        .then(response => {
          const { options, tags } = response;
          const formattedOptions = options ? options.map(option => ({
            iid: option.iid,
            ioid: option.ioid,
            option: option.option,
            stock: option.count, // 재고갯수
            count: 0, // 수량
            price: option.price, // 가격
          })) : [];
          // 인덱스 값 사용하여 올바른 위치에 재고 정보 설정
          setStock(prevStock => {
            const newStock = [...prevStock];
            newStock[idx] = formattedOptions;
            return newStock;
          });
          // 태그 설정
          const formattedTags = tags ? tags.map(tag => ({
            itid: tag.itid,
            tag: tag.tag,
          })) : [];
          // 각 항목에 대한 태그를 설정
          setTags(prevTags => {
            const newTags = [...prevTags];
            newTags[idx] = formattedTags;
            return newTags;
          });
        })
        .catch(err => console.log(err))
    });
  }, [list]);

  // 모달 열기 함수
  const openModal = (iid, price, cost, salePrice, saleDate) => {
    setModalOpen(true);
    setSelectedItemId(iid); // 선택된 항목의 iid 설정
    setSelectedPrice(price)
    setSelectedCost(cost)
    setSelectedSalePrice(salePrice)
    setSelectedSaleDate(saleDate)
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItemId(null); // 모달이 닫힐 때 선택된 항목의 iid 초기화
    setSelectedPrice(null)
    setSelectedCost(null)
    // 모달이 닫힐 때마다 새로운 데이터 가져오기
    fetchItemListAPI()
      .then(res => {
        setList(res);
      })
      .catch(err => console.log(err));
  };

  // 아이템 삭제 함수
  const deleteItem = (iid) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');
    if (isConfirmed) {
      deletedItem(iid)
        .then(res => {
          // 삭제된 아이템을 UI에서도 동적으로 제거
          setList(prevList => prevList.filter(item => item.iid !== iid));
        })
        .catch(err => {
          console.log('Error deleting item:', err);
        });
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색 기능을 적용한 목록 필터링
  const filteredList = list.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.iid.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      {isLoading ? <LoadingIndicator /> :
        <>
          <AdminCategoryBar/>
          <Button
            onClick={() => navigate(`/admin/item/insert`)}
            variant="contained"
            color="primary"
            style={{marginLeft:10}}
            startIcon={<AddCircleIcon />}
          >
            상품 추가
          </Button>
          <TextField
            label="검색"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginBottom: 5, marginLeft: 5, }}
          />
          <Grid container spacing={2} style={{marginBottom:10}}>
            {filteredList.map((item, index) => (
              <Grid item xs={12} sm={12} md={12} lg={6} key={index}>
                <Paper style={{ padding: 20, height:250 }}>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '30%', paddingRight: 20 }} rowSpan="2">
                          <img src={item.img1} alt={'img'} style={{ width: '100%', height: 160, cursor: 'pointer' }} onClick={() => { navigate(`/item/detail/${item.iid}`) }}/>
                        </td>
                        <td style={{ verticalAlign: 'top',  width: '40%' }}>
                          <Typography variant="h6" style={{ display: 'inline-block', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name || '\u00A0'}
                          </Typography>
                          <Typography variant="body2">종류: {item.category || '\u00A0'}</Typography>
                          <Typography variant="body2">제조사: {item.company || '\u00A0'}</Typography>
                          <Typography variant="body2">원가: {item.cost ? item.cost.toLocaleString() + '원' : '\u00A0'}</Typography>
                          <Typography variant="body2">정가: {item.price ? item.price.toLocaleString() + '원' : '\u00A0'}</Typography>
                          <Typography variant="body2">할인금액:
                            {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() && (
                              <>{item.salePrice.toLocaleString()}원</>
                            )}
                          </Typography>
                          <Typography variant="body2">할인율:
                            {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() && (
                              <>{((item.price - item.salePrice) / item.price * 100).toFixed()}%</>
                            )}
                          </Typography>
                          <Typography variant="body2">할인기간: {new Date(item.saleDate) > new Date() ? <CountDown saleDate={item.saleDate} /> : ''}</Typography>
                          <Typography variant="body2">평점: {item.totalSta / 10 + '점' || '\u00A0'}</Typography>
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                          <Typography variant="h6">재고</Typography>
                          {stock[index]?.map((opt, idx) => (
                            <Typography key={idx} variant="body2" style={{ color: (opt.stock === 0) ? 'red' : 'inherit' }}>{opt.option}: {(opt.stock === 0) ? '품절' : opt.stock+'개'}</Typography>
                          ))}
                        {tags[index]?.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
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
                            onClick={() => {}}
                          >
                            #{tag.tag}
                          </span>
                        ))}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <Button variant="contained" color="primary" size="small" style={{ marginRight: 10, border: '1px solid #1976d2', backgroundColor: 'white', color: '#1976d2', fontWeight: 'bold', }} onClick={() => { navigate(`/admin/item/update/${item.iid}`) }}>수정</Button>
                          <Button variant="contained" color="primary" size="small" style={{ marginRight: 10, border: '1px solid #1976d2', backgroundColor: 'white', color: '#1976d2', fontWeight: 'bold', }} onClick={() => openModal(item.iid, item.price, item.cost, item.salePrice, item.saleDate)}>  세일</Button>
                          <Button variant="contained" color="error" size="small" style={{ border: '1px solid #f44336', backgroundColor: 'white', color: '#f44336', fontWeight: 'bold', }} onClick={() => deleteItem(item.iid)}>삭제</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
        }
      {/* 모달 */}
      <SaleModal open={modalOpen} onClose={closeModal} iid={selectedItemId} price={selectedPrice} cost={selectedCost} ordSaleDate={selectedSaleDate} ordSalePrice={selectedSalePrice} /> 
    </Container>
  )
}
