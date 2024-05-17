import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '50%', md: '60%', lg: '80%' }, // 모달 창의 너비를 80%로 설정
  maxWidth: 600, // 모달 창의 최대 너비를 600px로 제한
  maxHeight: '80%', // 모달 창의 최대 높이를 80%로 설정
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center', // 텍스트 가운데 정렬
};

const imgStyle = {
  height: '100%'
};

export default function ImgModal(img) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div>
        <Modal
          open={modalOpen}
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <span style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer'}} onClick={closeModal}>&times;</span>
            <div style={{height: 700}}>
              <img src={img.img} alt="Gallery" style={imgStyle} />
            </div>
          </Box>
        </Modal>
      </div>
      <div>
        <img src={img.img} alt="Gallery" onClick={handleImageClick} style={{ height: 100, cursor: 'pointer', }} />
      </div>
    </>
  );
}
