# Noter

This is a mobile note-taking app built with React Native and Expo, and a server written in Node.js and Express to manage users accounts.

# Chức năng
- Đăng nhập, đăng ký. đăng xuất, : 100%
- Lưu dữ liệu trên server (cụ thể là DB): 100%
- Thêm, sửa note: 100%
- Preview note đang sửa: 100%
- Xem danh sách note: 100%
- Tìm kiếm note: 100%
- Tich hợp LLM để tạo câu hỏi trắc nghiệm: 50% (có lẽ nên cải thiện prompt và cách parse kết quả)

# Cài đặt để test cho development
1. Cần có MongoDB
2. Tạo file `.env` ở thư mục `server`, dựa vào `.env_example` ở cùng chỗ

3. Terminal 1
```
cd server
npm run dev
```
4. Terminal 2
```
cd mobile
npm run web
```