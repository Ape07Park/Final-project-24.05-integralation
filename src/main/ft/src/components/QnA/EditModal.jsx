import React from 'react';
import { Modal, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditModal = ({ open, handleClose, editContent, handleEditChange, handleEditSubmit }) => {
  return (
    <Modal open={open} onClose={handleClose}>
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
          <Button variant="contained" color='error' style={{ fontSize: 18 }} onClick={handleClose}>취소</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
