import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import CarouselImage1 from './carousel1.png';
import CarouselImage2 from './carousel2.png';
import './maincarousel.css';

function MainCarousel() {
    const carouselRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    
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
            img.src = imageSrc;
        });

        return () => {
        };
    }, []);

    if (!imagesLoaded) {
        return null; 
    }

    return (
        <Carousel 
            autoPlay={true}
            interval={5000}
            indicatorContainerProps={{ style: { display: 'none' } }}
            ref={carouselRef}
        >
            {items.map((item, i) => <Item key={i} item={item} />)}
        </Carousel>
    );
}

function Item(props) {
    return (
        <Paper>
            <img src={props.item.imageUrl} alt="Carousel Image" className="carousel-image" />
        </Paper>
    );
}

export default MainCarousel;
