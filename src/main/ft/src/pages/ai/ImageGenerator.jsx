import React, { useState } from 'react';
import axios from 'axios';

const ImageInpainting = () => {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [inpaintedImage, setInpaintedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleMaskChange = (event) => {
    const file = event.target.files[0];
    setMask(file);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const inpaintImage = async () => {
    setLoading(true);
    try {
      // 마스크 파일이 선택되었는지 확인
      if (!mask) {
        console.error('Please select a mask file.');
        setLoading(false);
        return;
      }
      
      // 이미지와 마스크 파일을 Base64로 변환
      const imageBase64 = await readFileAsync(image);
      const maskBase64 = await readFileAsync(mask);
      
      // 서버로 요청 보내고 응답 처리
      const response = await axios.post(
        'https://api.kakaobrain.com/v2/inference/karlo/inpainting',
        {
          image: imageBase64,
          mask: maskBase64,
          prompt: prompt // 사용자가 입력한 제시어 추가
        },
        {
          headers: {
            'Authorization': `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // 응답된 이미지를 디코딩하여 상태에 설정
      const encodedImage = response.data.images[0].image;
      const decodedImage = await stringToImage(encodedImage);
      setInpaintedImage(decodedImage);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const stringToImage = async (base64String) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = base64String; // base64String을 그대로 사용하지 않고, data URI 스키마 제외한 base64 부분만 할당
    });
  };

  return (
    <div>
      {/* 이미지 파일 업로드 입력란 */}
      <input type="file" onChange={handleImageChange} />
      
      {/* 마스크 파일 업로드 입력란 */}
      <input type="file" onChange={handleMaskChange} />
      
      {/* 제시어 입력란 */}
      <input 
        type="text" 
        placeholder="Enter prompt for image" 
        value={prompt} 
        onChange={handlePromptChange} 
      />
      
      {/* 이미지 생성 버튼 */}
      <button onClick={inpaintImage} disabled={!image || !mask || loading}>
        {loading ? 'Inpainting...' : 'Inpaint Image'}
      </button>
      
      {/* 생성된 이미지 표시 */}
      {inpaintedImage && (
        <div>
          <h2>Inpainted Image</h2>
          <img src={inpaintedImage.src} alt="Inpainted" />
        </div>
      )}
    </div>
  );
};

export default ImageInpainting;
