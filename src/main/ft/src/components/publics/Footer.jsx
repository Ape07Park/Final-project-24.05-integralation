import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../../css/footer.css';
import { Grid } from '@mui/material';

function Footer() {
    return (
        <div className='footer-container'>
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={6} sm={4} md={2}>
                    <div className='footer-link-items'>
                        <h2>About Us</h2>
                        <Link to='/developerPage'>회사 소개</Link>
                        <Link to='/developerPage'>연혁</Link>
                    </div>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <div className='footer-link-items'>
                        <h2>Members</h2>
                        <Link to='/signIn'>로그인</Link>
                        <Link to='/signUp'>회원가입</Link>
                    </div>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <div className='footer-link-items'>
                        <h2>CS Center</h2>
                        <Link to='/'>1577-1577</Link>
                    </div>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <div className='footer-link-items'>
                        <h2>My Page</h2>
                        <Link to='/OrderHistoryList'>주문 조회</Link>
                        <Link to='/wish/list'>찜목록</Link>
                    </div>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <div className='footer-link-items'>
                        <h2>Help</h2>
                        <Link to='/'>공지사항</Link>
                        <Link to='/'>문의</Link>
                    </div>
                </Grid>
            </Grid>
            <section className="social-media">
                <div className="social-media-wrap">
                    <small className="website-rights">FURNniture © 2024 | 대표 정아름 | 경기도 수원시 팔달구 매산로 30 | daniel07@gmail.com | 사업자번호 : 105-55-55555</small>
                </div>
            </section>

        </div>
    );
}

export default Footer;