import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropper({ src, onCropChange }) {
  const [crop, setCrop] = useState({ aspect: 16 / 9 });

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
    onCropChange(newCrop);
  };

  return (
    <ReactCrop
      src={src}
      crop={crop}
      onChange={handleCropChange}
      minWidth={100}
      minHeight={100}
    />
  );
}
