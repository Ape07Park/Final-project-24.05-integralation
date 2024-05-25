import React from 'react';
import { Image, Transformation } from 'cloudinary-react';

class ImageComponent extends React.Component {
  render() {
    return (
      <div>
        {/* CloudinaryImage를 사용하여 이미지를 표시합니다. */}
        <Image
          cloudName="your_cloud_name" // Cloudinary 클라우드 이름
          publicId="https://res.cloudinary.com/dm53zqqwf/image/upload/v1714099034/l4wwk10rkkltyxjhkmzz.jpg" // 이미지의 정확한 경로 지정
          effect="backgroundRemoval"
          width="2000"
          aspectRatio="1.5"
          quality="auto"
          format="auto"
          // 필요에 따라 다른 속성 추가
        >
          {/* 백그라운드 이미지 추가 */}
          <Transformation
            publicId="background01"
            width="2000"
            aspectRatio="1.5"
          />
          {/* 텍스트 오버레이 추가 */}
          <Transformation
            overlay={{ text: "$29.99", font_family: "Roboto", font_size: 120, font_color: "#48c4d8" }}
            gravity="north_west"
            x="75"
            y="50"
          />
        </Image>
      </div>
    );
  }
}

export default ImageComponent;
