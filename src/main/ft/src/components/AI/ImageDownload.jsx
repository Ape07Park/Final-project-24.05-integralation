import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackgroundRemoval from './BackgroundRemoval';

export default function ImageDownload({ img }) {
  const [downloadedImage, setDownloadedImage] = useState(null);

  useEffect(() => {
    if (img) {
      downloadImage();
    }
  }, [img]);

  const downloadImage = async () => {
    try {
      const response = await axios.get(img, {
        responseType: 'blob'
      });

      // 이미지 파일의 MIME 형식 확인
      const mimeType = response.data.type;

      if (mimeType === 'image/avif') {
        // AVIF 이미지를 JPEG로 변환
        const jpegImage = await convertAVIFtoJPEG(response.data);
        // 변환된 JPEG 이미지를 파일 객체로 만듦
        const file = new File([jpegImage], 'image.jpg', { type: 'image/jpeg' });
        setDownloadedImage(file);
      } else {
        // AVIF 형식이 아닌 경우, 원래 방법대로 처리
        setDownloadedImage(response.data);
      }
    } catch (error) {
      console.log("이미지를 다운로드하는 중 오류가 발생했습니다:", error);
    }
  }

  // AVIF 이미지를 JPEG로 변환하는 함수
  const convertAVIFtoJPEG = async (avifBlob) => {
    return new Promise((resolve, reject) => {
      const avifURL = URL.createObjectURL(avifBlob);
      const avifImage = new Image();

      avifImage.onload = async () => {
        // HTML canvas 요소 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // canvas 크기 설정
        canvas.width = avifImage.width;
        canvas.height = avifImage.height;

        // AVIF 이미지를 canvas에 그리기
        ctx.drawImage(avifImage, 0, 0);

        // canvas에서 JPEG 이미지로 변환
        canvas.toBlob(async (jpegBlob) => {
          resolve(jpegBlob);
        }, 'image/jpeg', 1); // JPEG 품질을 조정할 수 있음 (0.1 ~ 1)
      };

      avifImage.onerror = (error) => {
        reject(error);
      };

      // AVIF 이미지 로드
      avifImage.src = avifURL;
    });
  }

  return (
    <>
      <BackgroundRemoval imageFile={downloadedImage} />
    </>
  );
}
