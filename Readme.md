1. Chạy dự án

- Cài đặt thư viện:
  - npm i
- Chạy dự án với môi trường production: 
  - npm start
- Chạy dự án với môi trường development: 
  - npm run dev
- Run to compile css: (chỉ dành cho môi trường development)
  - npm run watch
- Run seeds -> để tạo mock data 
  - npm run seed:users
  - npm run seed:analytics
  - npm run seed:products
  - npm run seed:accessories
  - npm run seed:order
2. Cấu trúc dự án
- Dự án được tổ chức theo mô hình MVC và có các file như sau: 

  - **.dockerignore**: Tệp cấu hình để xác định các tệp không được đưa vào Docker image.
  - **.env**: Tệp chứa các biến môi trường cho ứng dụng.
  - **.env.dev**: Tệp chứa các biến môi trường cho môi trường phát triển.
  - **.env.dev.example**: Ví dụ về tệp biến môi trường cho môi trường phát triển.
  - **.git**: Thư mục chứa thông tin về hệ thống quản lý phiên bản Git.
  - **.gitignore**: Tệp xác định các tệp và thư mục mà Git sẽ bỏ qua.
  - **.prettierrc**: Tệp cấu hình cho Prettier, công cụ định dạng mã.
  - **.vscode**: Thư mục chứa cấu hình cho Visual Studio Code.
  - **Dockerfile**: Tệp cấu hình để xây dựng Docker image cho ứng dụng.
  - **docker-compose.yml**: Tệp cấu hình cho Docker Compose.
  - **credentials.json**: Tệp chứa thông tin xác thực (cần bảo mật).
  - **eslint.config.mjs**: Tệp cấu hình cho ESLint, công cụ kiểm tra mã.
  - **node_modules**: Thư mục chứa các phụ thuộc của dự án.
  - **nodemon.json**: Tệp cấu hình cho Nodemon, công cụ tự động khởi động lại ứng dụng khi có thay đổi.
  - **package-lock.json**: Tệp khóa phiên bản cho các phụ thuộc của dự án.
  - **package.json**: Tệp chứa thông tin về dự án và các phụ thuộc.
  - **vercel.json**: Tệp cấu hình cho Vercel, dịch vụ triển khai ứng dụng.
  - **src**: Thư mục chứa mã nguồn chính của ứng dụng.
  - Trong thư mục src, có các tệp như sau: 
    - **app.js**: File khởi động cho ứng dụng
    - **config**: Thư mục chúa cấu hình cho ứng dụng.
    - **controllers**: Thư mục chứa các controller cho ứng dụng.
    - **data**: Thư mục chứa các mockdata cho ứng dụng 
    - **logs**: Thư mục chứa file logs cho ứng dụng.
    - **middleware**: Thư mục chứa các middleware của ứng dụng 
    - **models**: Thư mục chúa các model cho ứng dụng.
    - **public**: Thư mục chứa các file css, image, js (dành cho client), .... của ứng dụng
    - **routes**: Thư mục chứa các route cho ứng dụng.
    - **services**: Thư mục chứa các service cho ứng dụng.
    - **styles**: Thư mục chứa các file scss của ứng dụng
    - **utils**: Thư mục chứa các hàm tiện tích hỗ trợ 
    - **views**: Thư mục chứa cách file handlebars, bao gồm layout, component và UI cho các trang của ứng dụng 

2. Các permission tong ứng dụng
   - manage_users: quản lí, thực hiện các thao tác đối với tài khoản của user
   - manage_admins: quản lí, thực hiện các thao tác đối với tài khoản của admin
   - manage_system: quản lí, xem các số liệu của hệ thống
3. Các role
   - sadmin: super admin có quyền manage_user, manage_admin, manage_system và có thể thực hiện tất cả thao tác khác
   - admin: có quyền manage_user, manage_system và có thể thực hiện tất cả thao tác khác
   - user: có thể thực hiện các thao tác khác

4. Thanh toán (chạy npm run dev)
   - Hướng dẫn test thanh toán:

   1. Các bước tiến hành:
      Checkout --> Nhập thông tin giao hàng --> Tiến hành thanh toán --> Thẻ nội địa và TKNH --> Chọn NCB
   2. Số thẻ: 9704198526191432198
      Tên chủ thẻ: NGUYEN VAN A
      Ngày phát hành: 07/15
      Mật khẩu OTP: 123456

- Sau khi mua hàng, vào profile kéo xuống dưới để check hàng đã mua
