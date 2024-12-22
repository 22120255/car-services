1. Run project

- Install dependencies
  - npm i
- Run:
  - npm start
- Run to compile css:
  - npm run watch
- Seed roles
  - npm run seed:roles
- Seed users
  - npm run seed:users

2. Các permission
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
