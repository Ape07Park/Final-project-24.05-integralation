import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Karlo from './Karlo';

const azureApiKey = process.env.REACT_APP_AZURE_API_KEY;
const azureEndpoint = process.env.REACT_APP_AZURE_ENDPOINT;

export default function BackgroundRemoval({ imageFile }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [maskImage, setMaskImage] = useState('');

  useEffect(() => {
    setSelectedImage(imageFile);
  }, [imageFile]);

  useEffect(() => {
    removeBackground();
  }, [selectedImage]);

  const removeBackground = async () => {
    if (!selectedImage) {
      console.error('No image selected.');
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
          const resultDataURL = addBlackBackground(image);
          setMaskImageFile(resultDataURL);
        };
        image.src = url;
      };

      fileReader.readAsArrayBuffer(selectedImage);
    } catch (error) {
      console.error('Error removing background:', error);
      if (error.response) {
        console.error('Status:', error.response.status);

        // Blob 데이터를 텍스트로 변환하여 출력
        const reader = new FileReader();
        reader.onload = () => {
          console.error('Data:', reader.result);
        };
        reader.readAsText(error.response.data);
      }
    }
  };

  const addBlackBackground = (imageData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 캔버스의 크기를 이미지와 같게 설정
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 백그라운드가 제거된 이미지를 그리기
    ctx.drawImage(imageData, 0, 0);

    return canvas.toDataURL();
  };

  const setMaskImageFile = (base64Data) => {
    // Base64 데이터를 Blob으로 변환
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

  return (
    <>
      <Karlo image={selectedImage} maskImage={maskImage} />
    </>
  );
}
