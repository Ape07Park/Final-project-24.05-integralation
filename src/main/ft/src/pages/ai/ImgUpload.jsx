import React, { useEffect } from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { backgroundRemoval, grayscale } from "@cloudinary/url-gen/actions/effect";
import { fill } from '@cloudinary/url-gen/actions/resize';
import { max } from "@cloudinary/url-gen/actions/roundCorners";
import { scale } from "@cloudinary/url-gen/actions/resize";

const ImgUpload = () => {
  useEffect(() => {
    // Log to ensure environment variables are correctly loaded
    console.log('Cloudinary Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    if (!process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
      console.error('Cloudinary cloud name is not set');
    }
  }, []);

  // Create a Cloudinary instance and set your cloud name
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
    }
  });

  // Set the public ID of your image. Replace 'boy-snow-hoodie' with your actual image public ID
  const myImage = cld.image('z38ejeqahkdz4n9awng0');

  // Apply transformations
  // myImage.resize(
  //   fill()
  //     .width(500)
  //     .aspectRatio("1.0")
  //     .gravity(autoGravity())
  // )
  //   .roundCorners(max())

  // myImage.effect(backgroundRemoval());
  myImage.addTransformation('e_background_removal,e_grayscale');



  // Render the image in a React component
  return (
    <div className="App-body">
      <h1>React Quick Start</h1>
      <div>
        <AdvancedImage cldImg={myImage} />
      </div>
    </div>
  );
};

export default ImgUpload;
