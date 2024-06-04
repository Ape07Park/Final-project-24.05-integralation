import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Karlo from './Karlo';

const azureApiKey = process.env.REACT_APP_AZURE_API_KEY;
const azureEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;

export default function BackgroundRemoval({ imageFile }) {
  const [imgFile, setImgFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [maskImage, setMaskImage] = useState('');

  useEffect(() => {
    setImgFile(imageFile)
  }, [imageFile]);

  useEffect(() => {
    removeBackground();
  }, [imgFile]);

  const removeBackground = async () => {
    if (!imgFile) {
      return;
    }

    try {
      // 이미지를 Blob으로 변환
      const fileReader = new FileReader();
      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result;
        const response = await axios.post(
          `${azureEndpoint}/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval`,
          arrayBuffer,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Ocp-Apim-Subscription-Key': azureApiKey,
            },
            responseType: 'blob',
          }
        );

        const url = URL.createObjectURL(response.data);

        // 이미지 데이터로 변환
        const image = new Image();
        image.onload = () => {
          const img = addImage(image)
          setImageFile(img)
          const resultDataURL = addBlackBackground(image);
          setMaskImageFile(resultDataURL);
        };
        image.src = url;
      };

      fileReader.readAsArrayBuffer(imgFile);
    } catch (error) {
      console.log('Error removing background:', error);
      if (error.response) {
        console.log('Status:', error.response.status);

        // Blob 데이터를 텍스트로 변환하여 출력
        const reader = new FileReader();
        reader.onload = () => {
          console.log('Data:', reader.result);
        };
        reader.readAsText(error.response.data);
      }
    }
  };

  const addImage = (imageData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 캔버스의 크기를 이미지에 2배
    canvas.width = 1000;   
    canvas.height = 1000; 
    ctx.fillStyle = 'black';          
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // 위에서의 내용을 적용 x 0, y 0에서부터 그린다
    ctx.drawImage(imageData, (1000 - imageData.width) / 2, (1000 - imageData.height) / 2);  // 적용할 그림을 x 0, y 0에서부터 그린다
    
    return canvas.toDataURL();
  };

  // 마스크 백그라운드 검정색으로 채우기
  const addBlackBackground = (imageData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 캔버스의 크기를 이미지와 같게 설정
    canvas.width = 1000;  
    canvas.height = 1000; 
    ctx.fillStyle = 'black';         
    ctx.fillRect(0, 0, canvas.width, canvas.height);  // 위에서의 내용을 적용 x 0, y 0에서부터 그린다
    ctx.drawImage(imageData, (1000 - imageData.width) / 2, (1000 - imageData.height) / 2); // 적용할 그림을 x 0, y 0에서부터 그린다

    return canvas.toDataURL();
  };

  // 마스크 base64 > 파일 형식 변환
  const setMaskImageFile = (base64Data) => {
    const byteString = atob(base64Data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'mask_image.png', { type: 'image/png' });
    setMaskImage(file);
  };

  // 원본 base64 > 파일 형식 변환
  const setImageFile = (base64Data) => {
    const byteString = atob(base64Data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], 'mask_image.png', { type: 'image/png' });
    setSelectedImage(file);
  };

  return (
    <>
      <Karlo image={selectedImage} maskImage={maskImage} />
    </>
  );
}
