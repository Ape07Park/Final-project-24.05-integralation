import React, { useState, useEffect } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, useMediaQuery, CircularProgress, Container } from '@mui/material';
import { selectUserData } from '../../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { getItemDetail } from '../../components/Item/Items'; // 아이템 정보 가져오기
import AdminCategoryBar from '../../components/admin/AdminCategoryBar';
import SelectedItemInfo from '../../components/Item/SelectedItemInfo';
import EditModal from '../../components/QnA/EditModal';
import QnAPost from '../../components/QnA/QnAPost';
import { adminQnAList } from '../../api/boardApi';
import { fetchReplies, postReply, updateReply, deleteReply } from '../../api/replyApi';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function QnAList() {
  return (
    <QueryClientProvider client={queryClient}>
      <QnAListContent />
    </QueryClientProvider>
  );
}

function QnAListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState("unanswered");
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const auth = getAuth();
  const [replies, setReplies] = useState({});
  const [posts, setPosts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyContent, setReplyContent] = useState(''); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [editContent, setEditContent] = useState(''); 
  const [editReplyId, setEditReplyId] = useState(null); 
  const [editReply, setEditReply] = useState(null); 
  const [loading, setLoading] = useState(true); 

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
        const data = await adminQnAList(); // QnA 목록 가져오기
        setPosts(data); // 가져온 데이터를 posts 상태에 설정
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.log('데이터를 불러오는 중 에러:', error);
      }
    };
    fetchData();
  }, []);

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
    if(expandedPost !== index )
    try {
      await fetchRepliesAndItemInfo(post);
    } catch (error) {
      console.log('게시물 정보를 불러오는 중 에러:', error);
    }
  };

  const fetchRepliesAndItemInfo = async (post) => {
    try {
      if (post && post.bid) { // 유효한 객체 및 bid인지 확인
        const repliesData = await fetchReplies(post.bid); // 답변 목록 가져오기
        setReplies(repliesData);
    
        // 아이템 정보 가져오기
        if (post.iid) {
          const itemInfo = await getItemDetail(post.iid); // 아이템 정보 가져오기 함수 호출
          setSelectedItem(itemInfo); // 선택된 아이템 정보 설정
        } else {
          console.log('게시물에 아이템 ID가 없습니다.');
        }
      } else {
        console.log('유효하지 않은 게시물입니다.');
      }
    } catch (error) {
      console.log('답변 목록을 불러오는 중 에러:', error);
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
      const updateReplyData = {
        rid: editReplyId,
        content: editContent.replace(/\n/g, "<br/>") 
      };
      const response = await updateReply(updateReplyData);
      handleCloseEditModal();
      const responseReplies = await fetchReplies(editReply.bid);
      setReplies(responseReplies);

      const updatedData = await adminQnAList();
      setPosts(updatedData);
    } catch (error) {
      console.log('답변을 수정하는 중 에러:', error);
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
      const response = await postReply(replyData);
  
      // 답변 내용 초기화
      setReplyContent('');
      const updatedRepliesData = await fetchReplies(post.bid); // 수정된 답변이 속한 게시물의 답변 목록
      setReplies(updatedRepliesData);
      setExpandedPost(null);
      const updatedData = await adminQnAList();
      setPosts(updatedData);
    } catch (error) {
      console.log('답변을 작성하는 중 에러:', error);
    }
  };

  const sortedPosts = () => {
    let sorted = [...posts];
    let uniqueBids = {}; // 중복되지 않은 bid를 추적하기 위한 객체

    // 포스트를 필터링하여 중복되지 않은 bid를 가진 포스트만 유지
    sorted = sorted.filter(post => {
        if (!uniqueBids[post.bid]) {
            uniqueBids[post.bid] = true;
            return true;
        }
        return false;
    });

    if (selectedType !== "전체") {
        sorted = sorted.filter(post => post.typeQnA === selectedType);
    }

    if (sortBy === "unanswered") {
        sorted.sort((a, b) => {
            const aHasReply = a.replyStatus === "미답변";
            const bHasReply = b.replyStatus === "미답변";
            if (aHasReply && bHasReply) {
                return 0;
            } else if (aHasReply) {
                return -1;
            } else {
                return 1;
            }
        });
    } else if (sortBy === "answered") {
        sorted.sort((a, b) => {
            const aHasReply = a.replyStatus === "답변완료";
            const bHasReply = b.replyStatus === "답변완료";
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
      await deleteReply(reply.rid);
      
      setReplies(prevReplies => {
        const updatedReplies = { ...prevReplies };
        delete updatedReplies[reply.rid];
        return updatedReplies;
      });

      const responseReplies = await fetchReplies(reply.bid);
      setReplies(responseReplies);
      const updatedData = await adminQnAList();
      setPosts(updatedData);
    } catch (error) {
      console.log('답변 삭제 중 에러:', error);
    }
  };

  return (
    <Container>
      <AdminCategoryBar/>
      <SelectedItemInfo selectedItem={selectedItem} />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
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
                  <QnAPost
                    key={index}
                    post={post}
                    index={index}
                    expandedPost={expandedPost}
                    handlePostClick={handlePostClick}
                    replies={replies}
                    handleOpenEditModal={handleOpenEditModal}
                    handleDeleteReply={handleDeleteReply}
                    handleReplyChange={handleReplyChange}
                    handleReplySubmit={handleReplySubmit}
                    replyContent={replyContent}
                    currentUserEmail={currentUserEmail}
                  />
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
              variant="outlined"
              color="primary"
            />
          </div>
          <EditModal
            open={showEditModal}
            handleClose={handleCloseEditModal}
            editContent={editContent}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
          />
        </>
      )}
    </Container>
  );
}