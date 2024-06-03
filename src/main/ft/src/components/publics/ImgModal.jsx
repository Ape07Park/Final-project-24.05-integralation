import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', md: '80%', lg: '80%' },
  maxWidth: 600,
  maxHeight: '80%', 
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center', 
};

const imgStyle = {
  height: '100%',
  width: '100%'
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
            <Grid style={{height: {xs: 500, md: 700, lg: 700},}}>
              <img src={img.img} alt="Gallery" style={imgStyle} />
            </Grid>
          </Box>
        </Modal>
      </div>
      <div>
        <img src={img.img} alt="Gallery" onClick={handleImageClick} style={{ height: 100, cursor: 'pointer', }} />
      </div>
    </>
  );
}
