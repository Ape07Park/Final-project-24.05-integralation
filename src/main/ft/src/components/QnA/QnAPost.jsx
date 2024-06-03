import React from 'react';
import { TableCell, TableRow, Typography, Accordion, AccordionSummary, TableContainer, Table, TableBody, Button, Stack, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImgModal from '../publics/ImgModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QnAPost({
  post,
  index,
  expandedPost,
  handlePostClick,
  replyStatus,
  replies,
  handleOpenEditModal,
  handleDeleteReply,
  handleReplyChange,
  handleReplySubmit,
  replyContent,
  currentUserEmail,
  isMobile,
}) {
  return (
    <React.Fragment key={index}>
      <TableRow onClick={() => handlePostClick(post, index)} style={{ cursor: 'pointer' }}>
        <TableCell style={{ fontSize: '80%' }}>{post.typeQnA}</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '80%' }}>
          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
            {post.replyStatus}
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
  );
}