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

   1. Thêm vào file .env:
      #VNPay
      VNP_TMNCODE="MKTI9S3O"
      VNP_HASHSECRET="VENAPRN78P753T5K9NGHPZUGXXGJH078"
      VNP_URL="http://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
      VNP_RETURN_URL="http://localhost:3000/payment/vnpay_return"
      VNP_IPN_URL="https://12f7-2405-4802-80fe-e210-6da1-f293-1a91-bc8b.ngrok-free.app/api/payment/vnpay_ipn"
      #Ngrok
      NGROK_AUTHTOKEN = "2qD9VxB7yDSOXk6xZ2rSqIYDhY1_4AAE8FzgJo1wt9m14H2rh"

   2. Số thẻ: 9704198526191432198
      . Checkout --> Tiến hành thanh toán --> Thẻ nội địa và TKNH --> Chọn NCB
   3. Số thẻ: 9704198526191432198
      Tên chủ thẻ: NGUYEN VAN A
      Ngày phát hành: 07/15
      Mật khẩu OTP: 123456

   4. Sau khi nhập mã OTP, lúc này sẽ trả về đến màn hình VNPay_ReturnUrl, thế nhưng trên database các thông tin về trạng thái của đơn hàng sẽ chưa được cập nhật vì môi trường test của VNPay không cho gọi IPN, ta cần phải chạy IPN thủ công

   - Hướng dẫn chạy IPN thủ công

   1. Sau khi hoàn tất các bước thanh toán trên, vào Postman
   2. Chọn phương thức GET, nhập link của IPN như sau
      - Copy phần IPN URL (trong .env.dev hay trên màn hình console) (link ngrok này động nên nó tự thay đổi mỗi khi chạy server nên nhớ copy lại).
        VD: https://12f7-2405-4802-80fe-e210-6da1-f293-1a91-bc8b.ngrok-free.app/api/payment
      - Copy phần đuôi query của Payment URL (trên màn hình console)
        VD: ?vnp_Amount=20077400&vnp_Command=pay&vnp_CreateDate=20241215202310&vnp_CurrCode=VND&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3A675ed8385d3ff424afa89140&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fpayment%2Fvnpay_return&vnp_TmnCode=MKTI9S3O&vnp_TxnRef=675ed8385d3ff424afa89140&vnp_Version=2.1.0&vnp_SecureHash=bc8ed42b5e63523b477b5a63dd8226933957372b9dafc6dc4d44d8d203a310c8abdbe6f78ed72233ef1a9485718ca898d5c8c78be82cb1c046bb417e80a59711
      - Merge cả hai lại copy paste vào Postman, data trên database sẽ được update trạng thái
        VD: https://12f7-2405-4802-80fe-e210-6da1-f293-1a91-bc8b.ngrok-free.app/api/payment?vnp_Amount=20077400&vnp_Command=pay&vnp_CreateDate=20241215202310&vnp_CurrCode=VND&vnp_IpAddr=%3A%3A1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3A675ed8385d3ff424afa89140&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fpayment%2Fvnpay_return&vnp_TmnCode=MKTI9S3O&vnp_TxnRef=675ed8385d3ff424afa89140&vnp_Version=2.1.0&vnp_SecureHash=bc8ed42b5e63523b477b5a63dd8226933957372b9dafc6dc4d44d8d203a310c8abdbe6f78ed72233ef1a9485718ca898d5c8c78be82cb1c046bb417e80a59711
