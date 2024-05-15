import React, { useState, useEffect } from 'react';
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, useMediaQuery, CircularProgress } from '@mui/material';
import { selectUserData } from '../api/firebase';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Items } from '../components/Item/Items'; // 아이템 정보 가져오기
import AdminCategoryBar from '../components/AdminCategoryBar';
import SelectedItemInfo from '../components/QnA/SelectedItemInfo';
import EditModal from '../components/QnA/EditModal';
import QnAPost from '../components/QnA/QnAPost';
import { fetchQnAList } from '../api/boardApi';
import { fetchReplies, postReply, updateReply, deleteReply } from '../api/replyApi';

export default function QnAList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("전체");
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState("unanswered");
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
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
  const [loading, setLoading] = useState(true); // Loading state

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
          console.error('사용자 정보를 불러오는 중 에러:', error);
        }
      };
      fetchUserInfo();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQnAList(); // QnA 목록 가져오기
        setPosts(data); // 가져온 데이터를 posts 상태에 설정
        setLoading(false); // Set loading to false when data is fetched
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
            const data = await fetchReplies(post.bid); // 답변 목록 가져오기
            status[post.bid] = data.length > 0;
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
      await fetchRepliesAndItemInfo(post);
    } catch (error) {
      console.error('게시물 정보를 불러오는 중 에러:', error);
    }
  };

  const fetchRepliesAndItemInfo = async (post) => {
    try {
      if (post && post.bid) { // 유효한 객체 및 bid인지 확인
        const repliesData = await fetchReplies(post.bid); // 답변 목록 가져오기
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
      const response = await updateReply(updateReplyData);
      console.log('답변을 성공적으로 수정했습니다:', response.data);
      handleCloseEditModal();
  
      fetchReplyStatus();
      // 수정된 답변의 bid를 이용하여 해당 게시물의 답변 목록을 다시 불러옴
      const responseReplies = await fetchReplies(editReply.bid);
      setReplies(responseReplies);
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
      const response = await postReply(replyData);
  
      // 응답 확인
      console.log('답변을 성공적으로 작성했습니다:', response.data);
      fetchReplyStatus();
      // 답변 내용 초기화
      setReplyContent('');
      const updatedRepliesData = await fetchReplies(post.bid); // 수정된 답변이 속한 게시물의 답변 목록
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
      await deleteReply(reply.rid);
      
      // 삭제된 답변을 화면에서 제거
      setReplies(prevReplies => {
        const updatedReplies = { ...prevReplies };
        delete updatedReplies[reply.rid];
        return updatedReplies;
      });
  
      // 데이터가 업데이트된 후에는 다시 답변 목록을 가져옴
      fetchReplyStatus();

      const responseReplies = await fetchReplies(reply.bid);
      setReplies(responseReplies);
    } catch (error) {
      console.error('답변 삭제 중 에러:', error);
    }
  };

  return (
    <>
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
                    replyStatus={replyStatus}
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
    </>
  );
}
