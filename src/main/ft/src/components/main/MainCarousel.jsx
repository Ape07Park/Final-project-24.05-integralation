import React, { forwardRef, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import CarouselImage1 from './carousel1.png';
import CarouselImage2 from './carousel2.png';
import './maincarousel.css';

const MainCarousel = forwardRef(() => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [error, setError] = useState(false); // 에러 상태 추가
    
    const items = [
        {
            imageUrl: CarouselImage1 
        },
        {
            imageUrl: CarouselImage2 
        }
    ];

    useEffect(() => {
        const images = [CarouselImage1, CarouselImage2];
        let loadedCount = 0;

        const checkAllImagesLoaded = () => {
            if (loadedCount === images.length) {
                setImagesLoaded(true);
            }
        };

        images.forEach(imageSrc => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                checkAllImagesLoaded();
            };
            img.onerror = () => { // 이미지 로드 에러 처리
                setError(true);
            };
            img.src = imageSrc;
        });

        return () => {
        };
    }, []);

    if (error || !imagesLoaded) { // 에러 발생하거나 이미지가 로드되지 않은 경우
        return null; // null 반환하여 컴포넌트를 렌더링하지 않음
    }

    return (
        <Carousel 
            autoPlay={true}
            interval={5000}
            indicatorContainerProps={{ style: { display: 'none' } }}
            
        >
            {items.map((item, i) => <Item key={i} item={item} />)}
        </Carousel>
    );
});

function Item(props) {
    return (
        <Paper>
            <img src={props.item.imageUrl} alt="Carousel Image" className="carousel-image" />
        </Paper>
    );
}

export default MainCarousel;
