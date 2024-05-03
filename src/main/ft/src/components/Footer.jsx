import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../css/footer.css';
import { Grid } from '@mui/material';

const footerStyle = {
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
};


function Footer() {
    return (
        <div className='footer-container'>
            <div class='footer-links'>
                <div className='footer-link-wrapper'>
                    <div class='footer-link-items'>
                        <h2>About Us</h2>
                        <Link to='/sign-up'>회사 소개</Link>
                        <Link to='/'>연혁</Link>
                    </div>
                    <div class='footer-link-items'>
                        <h2>Members</h2>
                        <Link to='/'>로그인</Link>
                        <Link to='/'>회원가입</Link>
                    </div>
                    <div class='footer-link-items'>
                        <h2>CS Cenmter</h2>
                        <Link to='/'>1577-1577</Link>
                    </div>
                    <div class='footer-link-items'>
                        <h2>My Page</h2>
                        <Link to='/'>주문 조회</Link>
                        <Link to='/'>찜목록</Link>
                    </div>
                    <div class='footer-link-items'>
                        <h2>Help</h2>
                        <Link to='/'>공지사항</Link>
                        <Link to='/'>문의</Link>
                    </div>
                </div>
            </div>
            <section className="social-media">
                <div className="social-media-wrap">
                    {/* <div className="footer-logo">
                        <Link to='/' className="social-logo">
                            FUNniture <i className="fab fa-typo3"></i>
                        </Link>
                    </div> */}
                    <small className="website-rights">FUNniture © 2024 | 대표 정아름 | 경기도 수원시 팔달구 매산로 30 | daniel07@gmail.com | 사업자번호 : 105-55-55555</small>
                    {/* <div className="social-icons">
                        <Link className="social-icon-link facebook" to="/"
                            target="_blank"
                            aria-label="Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </Link>
                        <Link className="social-icon-link instagram" to="/"
                            target="_blank"
                            aria-label="Instagram"
                        >
                            <i className="fab fa-instagram"></i>
                        </Link>
                        <Link class='social-icon-link youtube'
                            to='/'
                            target='_blank'
                            aria-label='Youtube'
                        >
                            <i class='fab fa-youtube' />
                        </Link>
                        <Link
                            class='social-icon-link twitter'
                            to='/'
                            target='_blank'
                            aria-label='Twitter'
                        >
                            <i class='fab fa-twitter' />
                        </Link>
                        <Link
                            class='social-icon-link twitter'
                            to='/'
                            target='_blank'
                            aria-label='LinkedIn'
                        >
                            <i class='fab fa-linkedin' />
                        </Link>
                    </div> */}
                </div>
            </section>
        </div>
    );
}

export default Footer;