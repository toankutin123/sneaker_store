import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-col">
          <h2 className="logo">NXT<span className="accent">STEP</span></h2>
          <p style={{ marginTop: '16px', color: '#aaa', fontSize: '0.95rem' }}>
            Nâng tầm phong cách của bạn với bộ sưu tập giày sneaker chính hãng cao cấp.
          </p>
        </div>
        <div className="footer-col">
          <h3>Cửa hàng</h3>
          <ul>
            <li><a href="/shop?category=Sneakers">Sneakers</a></li>
            <li><a href="/shop?category=Running">Chạy bộ</a></li>
            <li><a href="/shop?category=Casual">Thường ngày</a></li>
            <li><a href="/shop?category=Sale" className="sale-text">Khuyến mãi</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Công ty</h3>
          <ul>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Bản tin</h3>
          <p style={{ marginBottom: '16px', color: '#aaa', fontSize: '0.95rem' }}>Đăng ký để nhận tin tức và ưu đãi độc quyền.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Địa chỉ email của bạn" className="input-field" />
            <button type="submit" className="btn-primary">Đăng ký</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NXTSTEP. Tất cả các quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
