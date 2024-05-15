import React from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'
import CarouselImage1 from './carousel1.png';
import CarouselImage2 from './carousel2.png';
import './maincarousel.css'; // 스타일 시트를 가져옵니다.

function MainCarousel(props) {
    var items = [
        {
            imageUrl: CarouselImage1 // 첫 번째 이미지 경로
        },
        {
            imageUrl: CarouselImage2 // 두 번째 이미지 경로
        }
    ]

    return (
        <Carousel indicatorContainerProps={{ style: { display: 'none' } }}>
            {
                items.map((item, i) => <Item key={i} item={item} />)
            }
        </Carousel>
    )
}

function Item(props) {
    return (
        <Paper>
            <img src={props.item.imageUrl} alt="Carousel Image" className="carousel-image" /> {/* 이미지에 클래스 추가 */}
        </Paper>
    )
}
export default MainCarousel;
