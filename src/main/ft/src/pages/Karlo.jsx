import React, { useState } from 'react';
import axios from 'axios';
import { base64Encode } from 'base64-arraybuffer'; // base64 인코딩을 위한 라이브러리 (설치 필요)

const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;

const Karlo = () => {
  const [imageURL, setImageURL] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);

  const inpainting = async (image, mask) => {
    try {
      const response = await axios.post(
        'https://api.kakaobrain.com/v2/inference/karlo/inpainting',
        {
          image: image,
          mask: mask
        },
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !selectedMask) {
      console.error('Both image and mask must be selected.');
      return;
    }

    const readerImage = new FileReader();
    readerImage.onloadend = async () => {
      const base64StringImage = readerImage.result.split(',')[1]; // base64 데이터만 추출

      const readerMask = new FileReader();
      readerMask.onloadend = async () => {
        const base64StringMask = readerMask.result.split(',')[1]; // base64 데이터만 추출
        const response = await inpainting(base64StringImage, base64StringMask);
        if (response && response.images && response.images[0] && response.images[0].image) {
          setImageURL(response.images[0].image);
        }
      };
      readerMask.readAsDataURL(selectedMask);
    };
    readerImage.readAsDataURL(selectedImage);
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };
  
  const handleMaskChange = (event) => {
    setSelectedMask(event.target.files[0]);
  };

  return (
    <div>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <input type="file" accept="image/*" onChange={handleMaskChange} />
      <button onClick={handleImageUpload}>이미지 변환</button>
      {imageURL && <img src={imageURL} alt="Generated Image" />}
    </div>
  );
};

export default Karlo;
