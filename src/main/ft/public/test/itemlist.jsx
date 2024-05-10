import React, { useEffect, useState, useRef, useCallback } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button, CardMedia, CardContent, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CountDown from "../components/CountDown";
import { Items, getItemDetail } from "../components/Items";
import Rating from "../components/Rating";
import '../css/itemList.css'; // 분리된 CSS 파일 import

export default function ItemList() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 많은 아이템이 있는지 여부
  const navigate = useNavigate();
  const { searchQuery } = useParams();
  const observer = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const productList = await Items(page); // 페이지 번호를 인수로 전달
        setList((prevList) => [...prevList, ...productList]); // 이전 리스트와 새로운 데이터를 합침
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product list:', error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [page]); // 페이지 번호가 변경될 때마다 실행

  useEffect(() => {
    const lowercaseSearchQuery = searchQuery ? searchQuery.toLowerCase() : ''; 
    const filtered = list.filter(item => {
      const itemNameIncludes = item.name && item.name.toLowerCase().includes(lowercaseSearchQuery);
      const tagsIncludes = item.tags && item.tags.some(tag => tag.tag.toLowerCase().includes(lowercaseSearchQuery));
      const optionsIncludes = item.options && item.options.some(option => option.option.toLowerCase().includes(lowercaseSearchQuery));
      return itemNameIncludes || tagsIncludes || optionsIncludes;
    });
  
    setFilteredItems(filtered);
  }, [searchQuery, list]);

  // 무한 스크롤 이벤트 리스너
  const lastItemRef = useCallback(node => {
    if (isLoading) return; // 로딩 중이면 실행하지 않음
    if (observer.current) observer.current.disconnect(); // 이전 인터섹션 옵저버를 해제
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // 페이지 번호 증가
      }
    });
    if (node) observer.current.observe(node); // 마지막 아이템을 감시
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      // 마지막 아이템보다 조금 일찍 생성
      const lastItemIndex = filteredItems.length - 4;
      const lastItem = filteredItems[lastItemIndex];
      if (lastItem) {
        loadMoreItems();
      }
    }
  }, [filteredItems]);

  const loadMoreItems = async () => {
    // 새 페이지 로드
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Grid container spacing={2} className="itemList" style={{marginTop:10}}>
        {filteredItems.map((item, index) => {
          if (filteredItems.length === index + 1) {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index} marginBottom={5} ref={lastItemRef}>
                <Paper className="paper-item" onClick={() => { navigate(`/item/detail/${item.iid}`) }} sx={{ maxWidth: 300, paddingBottom: 0 }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.img1}
                    alt={item.name}
                    sx={{ mb: 1 }} // 이미지 아래 여백 추가
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" className="item-name" noWrap style={{ height: '2em' }}>
                      {item.name}
                    </Typography>
                    <Rating key={item.iid} item={item} strSize={16} className="item-rating" />
                    {new Date(item.saleDate) > new Date() && (
                      <CountDown saleDate={item.saleDate} />
                    )}
                    <Stack direction={'row'} justifyContent="space-between">
                      {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() ? (
                        <>
                          <Typography variant="body2">{((item.price - item.salePrice) / item.price * 100).toFixed(0)}%</Typography>
                          <Typography variant="body2" className="strike-through">{item.price.toLocaleString()}원</Typography>
                          <Typography variant="body2" className="price">{item.salePrice.toLocaleString()}원</Typography>
                        </>
                      ) : (
                        <Typography variant="body2" className="price">{item.price.toLocaleString()}원</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Paper>
              </Grid>
            );
          } else {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index} marginBottom={5}>
                <Paper className="paper-item" onClick={() => { navigate(`/item/detail/${item.iid}`) }} sx={{ maxWidth: 300, paddingBottom: 0 }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.img1}
                    alt={item.name}
                    sx={{ mb: 1 }} // 이미지 아래 여백 추가
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" className="item-name" noWrap style={{ height: '2em' }}>
                      {item.name}
                    </Typography>
                    <Rating key={item.iid} item={item} strSize={16} className="item-rating" />
                    {new Date(item.saleDate) > new Date() && (
                      <CountDown saleDate={item.saleDate} />
                    )}
                    <Stack direction={'row'} justifyContent="space-between">
                      {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() ? (
                        <>
                          <Typography variant="body2">{((item.price - item.salePrice) / item.price * 100).toFixed(0)}%</Typography>
                          <Typography variant="body2" className="strike-through">{item.price.toLocaleString()}원</Typography>
                          <Typography variant="body2" className="price">{item.salePrice.toLocaleString()}원</Typography>
                        </>
                      ) : (
                        <Typography variant="body2" className="price">{item.price.toLocaleString()}원</Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Paper>
              </Grid>
            );
          }
        })}
      </Grid>
    </>
  )
}
