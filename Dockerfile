# Chọn Node.js official image từ Docker Hub
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies (dựa vào package.json và package-lock.json)
RUN npm install

# Cài đặt nodemon nếu bạn cần cho môi trường development
RUN npm install -g nodemon

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Chạy ứng dụng trong môi trường development
CMD ["npm", "run", "dev"]
