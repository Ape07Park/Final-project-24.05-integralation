import React, { useState, useEffect } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, IconButton, useMediaQuery, Accordion, AccordionSummary, Typography, CardContent, Grid, Paper, CardMedia, TextField, Stack, Modal, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImgModal from '../components/ImgModal';
import axios from 'axios';
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Items } from '../components/Items'; // 아이템 정보 가져오기
import CountDown from '../components/CountDown';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminCategoryBar from '../components/AdminCategoryBar';

export default function QnAList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState("unanswered");
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const [replyStatus, setReplyStatus] = useState({});
  const [replies, setReplies] = useState({});
  const [posts, setPosts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 아이템 정보
  const [replyContent, setReplyContent] = useState(''); // 답변 내용 상태 추가
  const [showEditModal, setShowEditModal] = useState(false); // 수정 모달 표시 상태 추가
  const [editContent, setEditContent] = useState(''); // 수정 내용 상태 추가
  const [editReplyId, setEditReplyId] = useState(null); // 수정할 답변 ID 상태 추가
  const [editReply, setEditReply] = useState(null); // 수정할 답변 ID 상태 추가
  const navigate = useNavigate();

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
    const fetchData = async () => {
      try {
        const response = await axios.get('/ft/board/QnAList'); // 데이터 가져오기
        setPosts(response.data); // 가져온 데이터를 posts 상태에 설정
      } catch (error) {
        console.error('데이터를 불러오는 중 에러:', error);
      }
    };
    fetchData();
  }, []);
  
  const fetchReplyStatus = async () => {
    try {
      if (posts && posts.length > 0) {
        const status = {};
        for (const post of posts) {
          if (post && post.bid) {
            const response = await axios.get(`/ft/reply/list/${post.bid}`);
            const repliesData = response.data;
            status[post.bid] = repliesData.length > 0;
          }
        }
        setReplyStatus(status);
      }
    } catch (error) {
      console.error('답변 목록을 불러오는 중 에러:', error);
    }
  };
  
  useEffect(() => {
    fetchReplyStatus();
  }, [posts]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    setExpandedPost(null);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setCurrentPage(1);
    setExpandedPost(null);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePostClick = async (post, index) => {
    setExpandedPost(expandedPost === index ? null : index);
    try {
      fetchRepliesAndItemInfo(post);
    } catch (error) {
      console.error('게시물 정보를 불러오는 중 에러:', error);
    }
  };

  const fetchRepliesAndItemInfo = async (post) => {
    try {
      if (post && post.bid) { // 유효한 객체 및 bid인지 확인
        const response = await axios.get(`/ft/reply/list/${post.bid}`);
        const repliesData = response.data; // 가져온 답변 목록
        setReplies(repliesData);
        
        // 아이템 정보 가져오기
        if (post.iid) {
          const itemInfo = await Items(); // 아이템 정보 가져오기 함수 호출
          const selectedItemInfo = itemInfo.find(item => item.iid === post.iid); // 선택된 게시물의 아이템 정보 찾기
          setSelectedItem(selectedItemInfo); // 선택된 아이템 정보 설정
        } else {
          console.error('게시물에 아이템 ID가 없습니다.');
        }
      } else {
        console.error('유효하지 않은 게시물입니다.');
      }
    } catch (error) {
      console.error('답변 목록을 불러오는 중 에러:', error);
    }
  };

  const handleReplyChange = (event) => {
    setReplyContent(event.target.value); // 답변 내용 변경 핸들러
  };

  // 수정 내용 변경 핸들러
  const handleEditChange = (event) => {
    setEditContent(event.target.value);
  };

  // 수정 모달 열기 핸들러
  const handleOpenEditModal = (reply) => {
    setEditReplyId(reply.rid); // 수정할 답변 ID 설정
    setEditContent(reply.content.replace(/<br\/>/g, '\n'));
    setEditReply(reply);
    setShowEditModal(true); // 수정 모달 표시
  };

  // 수정 모달 닫기 핸들러
  const handleCloseEditModal = () => {
    setShowEditModal(false); // 수정 모달 닫기
    setEditReplyId(null); // 수정할 답변 ID 초기화
    setEditContent(''); // 수정 내용 초기화
  };

  // 답변 수정 제출 핸들러
  const handleEditSubmit = async () => {
    try {
      // 수정할 답변 데이터 생성
      const updateReplyData = {
        rid: editReplyId,
        content: editContent.replace(/\n/g, "<br/>") // 엔터를 <br> 태그로 변환하여 저장
      };
      const response = await axios.post(`/ft/reply/update`, updateReplyData);
      console.log('답변을 성공적으로 수정했습니다:', response.data);
      handleCloseEditModal();
  
      fetchReplyStatus();
      // 수정된 답변의 bid를 이용하여 해당 게시물의 답변 목록을 다시 불러옴
      const responseReplies = await axios.get(`/ft/reply/list/${editReply.bid}`);
      const updatedRepliesData = responseReplies.data; // 수정된 답변이 속한 게시물의 답변 목록
      setReplies(updatedRepliesData);
    } catch (error) {
      console.error('답변을 수정하는 중 에러:', error);
    }
  };

  const postsPerPage = 5;
  const indexOfFirstPost = (currentPage - 1) * postsPerPage;
  const indexOfLastPost = currentPage * postsPerPage;

   // 답변 내용을 <br> 태그로 변환하여 저장
   const handleReplySubmit = async (post) => {
    try {
      // 답변 데이터 생성
      const replyData = {
        email: currentUserEmail,
        bid: post.bid,
        // 엔터를 <br> 태그로 변환하여 저장
        content: replyContent.replace(/\n/g, "<br/>")
      };

      // 답변을 서버로 전송
      const response = await axios.post('/ft/reply/insert', replyData);

      // 응답 확인
      console.log('답변을 성공적으로 작성했습니다:', response.data);
      fetchReplyStatus();
      // 답변 내용 초기화
      setReplyContent('');
      const responseReplies = await axios.get(`/ft/reply/list/${post.bid}`);
      const updatedRepliesData = responseReplies.data; // 수정된 답변이 속한 게시물의 답변 목록
      setReplies(updatedRepliesData);
      setExpandedPost(null);
    } catch (error) {
      console.error('답변을 작성하는 중 에러:', error);
    }
  };

  const sortedPosts = () => {
    let sorted = [...posts];

    if (selectedType !== "전체") {
      sorted = sorted.filter(post => post.typeQnA === selectedType);
    }

    if (sortBy === "unanswered") {
      sorted.sort((a, b) => {
        const aHasReply = replyStatus[a.bid] || false;
        const bHasReply = replyStatus[b.bid] || false;
        // 답변이 없는 게시물들이 먼저 표시되도록 정렬
        if (!aHasReply && !bHasReply) {
          return 0;
        } else if (!aHasReply) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sortBy === "answered") {
      sorted.sort((a, b) => {
        const aHasReply = replyStatus[a.bid] || false;
        const bHasReply = replyStatus[b.bid] || false;
        // 답변이 있는 게시물들이 먼저 표시되도록 정렬
        if (aHasReply && bHasReply) {
          return 0;
        } else if (aHasReply) {
          return -1;
        } else {
          return 1;
        }
      });
    }

    return sorted;
  };

  const currentPosts = sortedPosts().slice(indexOfFirstPost, indexOfLastPost);

  const handleDeleteReply = async (reply) => {
    try {
      // 삭제 요청을 보냄
      await axios.post(`/ft/reply/delete/${reply.rid}`);
      
      // 삭제된 답변을 화면에서 제거
      setReplies(prevReplies => {
        const updatedReplies = { ...prevReplies };
        delete updatedReplies[reply.rid];
        return updatedReplies;
      });
  
      // 데이터가 업데이트된 후에는 다시 답변 목록을 가져옴
      fetchReplyStatus();

      const responseReplies = await axios.get(`/ft/reply/list/${reply.bid}`);
      const updatedRepliesData = responseReplies.data; // 수정된 답변이 속한 게시물의 답변 목록
      setReplies(updatedRepliesData);
    } catch (error) {
      console.error('답변 삭제 중 에러:', error);
    }
  };

  return (
    <>
      <AdminCategoryBar/>
      {selectedItem && ( // 선택된 아이템 정보가 있을 때만 표시
        <Grid container spacing={2} style={{ padding: 10 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper style={{ padding: 0 }}> {/* 여기서 패딩을 0으로 변경 */}
              <table style={{ width: '95%' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '30%', paddingRight: 20 }} rowSpan="2">
                      <CardMedia
                        component="img"
                        image={selectedItem.img1}
                        alt="상품 이미지"
                        style={{ height: 200, cursor: 'pointer' }}
                        onClick={() => { navigate(`/item/detail/${selectedItem.iid}`) }}
                      />
                      <CardContent>
                        {/* 나머지 카드 내용 */}
                      </CardContent>
                    </td>
                    <td style={{ verticalAlign: 'top', width: '40%' }}>
                      <Typography variant="h6" style={{ display: 'inline-block', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {selectedItem.name || '\u00A0'}
                      </Typography>
                      <Typography variant="body2">제조사: {selectedItem.company || '\u00A0'}</Typography>
                      <Typography variant="body2">원가: {selectedItem.cost ? selectedItem.cost.toLocaleString() + '원' : '\u00A0'}</Typography>
                      <Typography variant="body2">정가: {selectedItem.price ? selectedItem.price.toLocaleString() + '원' : '\u00A0'}</Typography>
                      <Typography variant="body2">할인금액:
                        {selectedItem.salePrice !== 0 && selectedItem.salePrice && new Date(selectedItem.saleDate) > new Date() && (
                          <>{selectedItem.salePrice.toLocaleString()}원</>
                        )}
                      </Typography>
                      <Typography variant="body2">할인율:
                        {selectedItem.salePrice !== 0 && selectedItem.salePrice && new Date(selectedItem.saleDate) > new Date() && (
                          <>{((selectedItem.price - selectedItem.salePrice) / selectedItem.price * 100).toFixed()}%</>
                        )}
                      </Typography>
                      <Typography variant="body2">할인기간: {new Date(selectedItem.saleDate) > new Date() ? <CountDown saleDate={selectedItem.saleDate} /> : ''}</Typography>
                      <Typography variant="body2">평점: {selectedItem.totalSta / 10 + '점' || '\u00A0'}</Typography>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <Typography variant="h6">재고</Typography>
                      {selectedItem.options.map((opt, idx) => (
                        <Typography key={idx} variant="body2">{opt.option}: {(opt.stock === 0) ? '품절' : opt.stock + '개'}</Typography>
                      ))}
                      {selectedItem.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          style={{
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
                          onClick={() => { }}
                        >
                          #{tag.tag}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </Grid>
        </Grid>
      )}
      <TableContainer style={{ overflow: 'hidden', paddingLeft: 10, paddingRight: 10 }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: isMobile ? '10%' : '10%' }}>
                <Select
                  value={selectedType}
                  onChange={handleTypeChange}
                  style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold', width: '100%', fontSize: '100%' }}
                >
                  <MenuItem value="전체">전체</MenuItem>
                  <MenuItem value="결제">결제</MenuItem>
                  <MenuItem value="상품">상품</MenuItem>
                  <MenuItem value="배송">배송</MenuItem>
                  <MenuItem value="환불">환불</MenuItem>
                  <MenuItem value="교환">교환</MenuItem>
                </Select>
              </TableCell>
              <TableCell style={{ width: isMobile ? '15%' : '15%', fontWeight: 'bold', fontSize: '80%' }}>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold', width: '70%', fontSize: '100%' }}
                >
                  <MenuItem value="answered">답변순</MenuItem>
                  <MenuItem value="unanswered">미답변순</MenuItem>
                </Select>
              </TableCell>
              <TableCell style={{ width: isMobile ? '60%' : '40%', fontWeight: 'bold', textAlign: 'center', fontSize: '80%' }} align="center">제목</TableCell>
              <TableCell style={{ width: isMobile ? '20%' : '17%', fontWeight: 'bold', fontSize: '80%' }}>작성자</TableCell>
              <TableCell style={{ width: isMobile ? '10%' : '10%', fontWeight: 'bold', fontSize: '80%' }}>작성일</TableCell>
              <TableCell style={{ width: isMobile ? '10%' : '13%', fontWeight: 'bold', fontSize: '80%', textAlign: 'center', }}>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPosts.map((post, index) => (
              <React.Fragment key={index}>
                <TableRow onClick={() => handlePostClick(post, index)} style={{ cursor: 'pointer' }}>
                  <TableCell style={{ fontSize: '80%' }}>{post.typeQnA}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                      {replyStatus[post.bid] ? '답변완료' : '미답변'}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ fontSize: '80%' }}>{post.title}</TableCell>
                  <TableCell style={{ fontSize: '80%' }}>{`${post.email.split('@')[0]}`}</TableCell>
                  <TableCell style={{ fontSize: '80%' }}>{new Date(post.regDate).toLocaleDateString().slice(0, -1)}</TableCell>
                  {currentUserEmail === post.email ? 
                    <TableCell style={{ width: isMobile ? '10%' : '10%', fontWeight: 'bold', fontSize: '80%', textAlign: 'center' }}>
                    </TableCell>
                  : ''}
                </TableRow>
                {expandedPost === index && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Accordion expanded={expandedPost === index}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography style={{ minHeight: '50px', marginRight: '10px', fontSize: '100%' }}>
                              {post.content}
                            </Typography>
                            {post.img && <ImgModal style={{ width: 100 }} img={post.img} />}
                          </div>
                        </AccordionSummary>
                        <TableContainer>
                          <Table>
                            <TableBody>
                              {Object.values(replies).map((reply, index) => (
                                <React.Fragment key={index}>
                                  <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
                                      답변
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
                                      {reply.email.split('@')[0]}
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
                                      {new Date(reply.regDate).toLocaleString().replace('T', ' ').slice(0, -3)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell colSpan={3} style={{ padding: '10px' }} dangerouslySetInnerHTML={{ __html: reply.content }} />
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          minWidth: 40,
                                          height: 40,
                                        }}
                                        onClick={() => handleOpenEditModal(reply)}
                                      >
                                        <EditIcon />
                                      </Button>
                                      <Button
                                        variant="contained"
                                        color="error"
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          minWidth: 40,
                                          height: 40,
                                          marginLeft: 10,
                                        }}
                                        onClick={() => handleDeleteReply(reply)}
                                      >
                                        <DeleteIcon/>
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              ))}
                              {/* 답변 입력 폼 */}
                              {currentUserEmail && (
                                <TableRow>
                                  <TableCell colSpan={3}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <TextField
                                        id="reply-content"
                                        label="답변 작성"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={6} 
                                        value={replyContent}
                                        onChange={handleReplyChange}
                                        InputLabelProps={{ style: { fontSize: 16, fontWeight: 'bold' } }} // 라벨 스타일 조정
                                      />
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 'bold',
                                          minWidth: 80, 
                                          height: 60, 
                                        }}
                                        onClick={() => handleReplySubmit(post)}
                                      >
                                        답변
                                      </Button>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination" style={{ marginTop: '10px', justifyContent: 'center', display: 'flex', paddingBottom: 10}}>
        <Pagination
          count={Math.ceil(posts.length / postsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          disabled={posts.length === 0} // 포스트가 없을 때 페이지네이션 비활성화
        />
      </div>
      <Modal open={showEditModal} onClose={handleCloseEditModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: 25, boxShadow: 24, borderRadius: 10, minWidth: '30vw', maxWidth: '30vw' }}>
          <TextField
            id="edit-content"
            label="답변 수정"
            variant="outlined"
            fullWidth
            multiline
            rows={10} 
            value={editContent}
            onChange={handleEditChange}
            InputLabelProps={{ style: { fontSize: 20, fontWeight: 'bold' } }} // 라벨 스타일 조정
            InputProps={{ style: { fontSize: 15, minHeight: '100px' } }} // 입력 필드 스타일 조정
            style={{ marginBottom: 10 }}
          />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: 20, fontSize: 18 }}
              onClick={handleEditSubmit}
            >
              <EditIcon />
            </Button>
            <Button variant="contained" color='error' style={{ fontSize: 18 }} onClick={handleCloseEditModal}>취소</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
