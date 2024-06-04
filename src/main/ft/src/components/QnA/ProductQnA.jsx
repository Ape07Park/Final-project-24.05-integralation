import React, { useState, useEffect } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, IconButton, Modal, useMediaQuery, Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImgModal from '../publics/ImgModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QnAEditModal from './QnAEditModal';
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { fetchReplies } from '../../api/replyApi';
import { deleteBoard } from '../../api/boardApi';
import LockIcon from '@mui/icons-material/Lock';
import { useAuthContext } from '../../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ProductQnA({ posts, reloadQnAData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [expandedPost, setExpandedPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const auth = getAuth();
  const [replyStatus, setReplyStatus] = useState({});
  const [replies, setReplies] = useState({});
  const { user, logout } = useAuthContext();
  const isAdmin = user && user.isAdmin == true;

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
        } catch (error) {
          console.log('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (posts && posts.length > 0) {
          const status = {};
          for (const post of posts) {
            if (post && post.bid) {
              const response = await fetchReplies(post.bid);
              status[post.bid] = response.length > 0;
            }
          }
          setReplyStatus(status);
        }
      } catch (error) {
        console.log('답변 목록을 불러오는 중 에러:', error);
      }
    };
  
    fetchData();
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

  const handlePostClick = async (post, index) => {
    setExpandedPost(expandedPost === index ? null : index);
    try {
      if (post && post.bid) { // 유효한 객체 및 bid인지 확인
        const response = await fetchReplies(post.bid);
        setReplies(response);
      } else {
        console.error('유효하지 않은 게시물입니다.');
      }
    } catch (error) {
      console.log('답변 목록을 불러오는 중 에러:', error);
    }
  };

  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPosts = selectedType === "전체" ? posts : posts.filter(post => post.typeQnA === selectedType);
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleEditClick = (event, post) => {
    event.stopPropagation();
    setSelectedPostIndex(post);
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (event, post) => {
    event.stopPropagation();
    const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await deleteBoard(post.bid);
        reloadQnAData();
      } catch (error) {
        console.log('포스트 삭제 중 오류가 발생했습니다.', error);
      }
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedPostIndex(null);
    reloadQnAData();
  };

  return (
    <>
      <TableContainer style={{ overflow: 'hidden' }}>
        <Table style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: isMobile ? '5%' : '8%' }}>
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
              {!isMobile && (
                <TableCell style={{ width: '8%', fontWeight: 'bold', fontSize: '80%' }}>답변</TableCell>
              )}
              <TableCell style={{ width: isMobile ? '40%' : '32%', fontWeight: 'bold', textAlign: 'center', fontSize: '80%' }} align="center">제목</TableCell>
              <TableCell style={{ width: isMobile ? '8%' : '8%', fontWeight: 'bold', fontSize: '80%' }}>작성자</TableCell>
              {!isMobile && (
                <TableCell style={{ width: '8%', fontWeight: 'bold', fontSize: '80%' }}>작성일</TableCell>
              )}
              <TableCell style={{ width: isMobile ? '8%' : '8%', fontWeight: 'bold', fontSize: '80%', textAlign: 'center', }}><SettingsIcon/></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPosts.map((post, index) => (
              <React.Fragment key={index}>
                <TableRow onClick={() => handlePostClick(post, index)} style={{ cursor: 'pointer' }}>
                  <TableCell style={{ fontSize: '80%' }}>{post.typeQnA}</TableCell>
                  {!isMobile && (
                    <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
                      <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                        {replyStatus[post.bid] ? '답변' : '미답변'}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell style={{ fontSize: '80%', verticalAlign: 'middle' }}>
                    {post.secretMsg === 1 && (
                      <LockIcon style={{ fontSize: '120%', marginRight: '4px', verticalAlign: 'middle', marginBottom: '5px' }} />
                    )}
                    {post.title}
                  </TableCell>
                  <TableCell style={{ fontSize: '80%' }}>{`${post.email.split('@')[0]}`}</TableCell>
                  {!isMobile && (
                    <TableCell style={{ fontSize: '80%' }}>{new Date(post.regDate).toLocaleDateString().slice(0, -1)}</TableCell>
                  )}
                  {currentUserEmail === post.email ? 
                  <TableCell style={{ width: isMobile ? '10%' : '10%', fontWeight: 'bold', fontSize: '80%', textAlign: 'center' }}>
                      <IconButton onClick={(event) => handleEditClick(event, post)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={(event) => handleDeleteClick(event, post)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  : ''}
                </TableRow>
                {expandedPost === index && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {(!post.secretMsg || currentUserEmail === post.email || isAdmin) && (
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
                                      <TableCell colSpan={3} style={{ padding: '10px' }}>
                                        {reply.content}
                                      </TableCell>
                                    </TableRow>
                                  </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Accordion>
                      )}
                      {(post.secretMsg && !(currentUserEmail === post.email || isAdmin)) ? (
                        <div>비밀 게시물입니다. 작성자 또는 관리자만 열람할 수 있습니다.</div>
                      ) : ''}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination" style={{ marginTop: '20px', justifyContent: 'center', display: 'flex'}}>
        <Pagination
          count={Math.ceil(filteredPosts.length / postsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined" 
          color="primary"
        />
      </div>

      <QnAEditModal isOpen={editModalOpen} handleClose={handleCloseEditModal} posts={selectedPostIndex} />
    </>
  );
}
