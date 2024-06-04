import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { base64Encode } from 'base64-arraybuffer';
import LoadingIndicator from '../publics/LoadingIndicator';

const REST_API_KEY = process.env.REACT_APP_KAKAO_API_KEY;

export default function Karlo({ image, maskImage }) {
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);

  useEffect(() => {
    setSelectedImage(image);
    setSelectedMask(maskImage);
  }, [maskImage]);

  useEffect(() => {
    if (selectedImage) {
      handleImageUpload();
    }
  }, [selectedImage]); 

  const inpainting = async (image, mask) => {
    try {
      setLoading(true); 
      const response = await axios.post(
        'https://api.kakaobrain.com/v2/inference/karlo/inpainting',
        {
          image: image,
          mask: mask,
          prompt: 'room, living room, realistic, modern, Maintain original, original, picture',
          negative_prompt: 'person',
          image_quality: 100,
          prior_num_inference_steps: 100,
        },
        {
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setImageURL(response.data.images[0].image);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage || !selectedMask) {
      console.log('Both image and mask must be selected.');
      return;
    }

    const readerImage = new FileReader();
    readerImage.onloadend = async () => {
      const base64StringImage = readerImage.result.split(',')[1]; // base64 데이터만 추출

      const readerMask = new FileReader();
      readerMask.onloadend = async () => {
        const base64StringMask = readerMask.result.split(',')[1]; // base64 데이터만 추출
        await inpainting(base64StringImage, base64StringMask);
      };
      readerMask.readAsDataURL(selectedMask);
    };
    readerImage.readAsDataURL(selectedImage);
  };

  return (
    <>
      {loading ? ( 
        <LoadingIndicator sx={{ width:'100%' }}/> 
      ) : (
        <>
          <img src={imageURL} style={{width:'100%'}} />
        </>
      )}
    </>
  );
}
