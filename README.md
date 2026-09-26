# Sneaker Store

Sneaker Store là một ứng dụng thương mại điện tử bán giày sneaker, được xây dựng bằng React cho frontend và Node.js/Express cho backend. Dự án hỗ trợ người dùng xem sản phẩm, thêm vào giỏ hàng, thanh toán, quản lý tài khoản, tích hợp ưu đãi, loyalty, chatbot và quản trị hệ thống admin.

## Công nghệ sử dụng

- Frontend: React 19, Vite, React Router
- Styling: CSS modules/custom CSS
- Backend: Node.js, Express
- Database: PostgreSQL + Sequelize ORM
- Authentication: JWT + bcryptjs
- File upload: multer
- Dev tools: ESLint, Docker Compose

## Tính năng chính

- Trang chủ và danh sách sản phẩm
- Chi tiết sản phẩm, size guide
- Giỏ hàng và thanh toán
- Đăng ký / đăng nhập / hồ sơ người dùng
- Wishlist, đánh giá sản phẩm
- Hệ thống loyalty và coupon
- Quản trị admin: người dùng, sản phẩm, đơn hàng, sự kiện, mã giảm giá
- Chatbot hỗ trợ khách hàng

## Cấu trúc thư mục

- src/: source code frontend
- public/: tài nguyên static
- server/: backend API, model, route, config
- docker-compose.yml: khởi động PostgreSQL và pgAdmin

## Yêu cầu môi trường

- Node.js 18+
- npm
- Docker Desktop hoặc Docker Engine

## Thiết lập nhanh

1. Cài đặt dependencies:

```bash
npm install
```

2. Khởi động database PostgreSQL bằng Docker:

```bash
docker compose up -d
```

3. Khởi động frontend:

```bash
npm run dev
```

4. Khởi động backend:

```bash
npm run start
```

5. Truy cập ứng dụng:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- pgAdmin: http://localhost:5050

## Biến môi trường

File `server/.env` chứa các biến môi trường như:

- PORT
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- JWT_SECRET

> Lưu ý: không commit file `.env` lên repository công khai. Nếu cần chia sẻ, hãy dùng template hoặc biến môi trường từ hosting.

## Scripts có sẵn

```bash
npm run dev
npm run build
npm run preview
npm run start
npm run seed
```

## Ghi chú

Dự án hiện đang mặc định kết nối tới PostgreSQL ở địa chỉ `localhost:5433` với thông tin đăng nhập đã được định nghĩa trong file cấu hình database và `.env` của server. Đảm bảo container PostgreSQL đã được khởi động trước khi chạy backend.
