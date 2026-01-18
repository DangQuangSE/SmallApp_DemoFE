import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import "./footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.BIKES}>Tìm xe</Link>
              </li>
              <li>
                <Link to={ROUTES.SELLER_CREATE}>Đăng tin bán xe</Link>
              </li>
              <li>
                <Link to="/about">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/how-it-works">Cách thức hoạt động</Link>
              </li>
              <li>
                <Link to="/pricing">Bảng giá</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-column">
            <h4 className="footer-title">Hỗ trợ</h4>
            <ul className="footer-links">
              <li>
                <Link to="/help">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link to="/safety">An toàn giao dịch</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
              <li>
                <Link to="/report">Báo cáo vi phạm</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-column">
            <h4 className="footer-title">Pháp lý</h4>
            <ul className="footer-links">
              <li>
                <Link to="/terms">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/cookie">Chính sách Cookie</Link>
              </li>
              <li>
                <Link to="/dispute">Giải quyết tranh chấp</Link>
              </li>
              <li>
                <Link to="/seller-policy">Chính sách người bán</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
