# Sim Phát Lộc - Nền tảng bán Sim Vinaphone Số Đẹp

Website thương mại điện tử chuyên cung cấp Sim Vinaphone số đẹp, tối ưu hóa mạnh mẽ cho SEO, tốc độ tải trang (PageSpeed) và mang lại trải nghiệm mua hàng không độ trễ. 

## Công Nghệ Sử Dụng
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Google Fonts (Be Vietnam Pro)
- **Database:** PostgreSQL (Khuyến nghị dùng Supabase)
- **ORM:** Prisma
- **Xác thực Admin:** Custom JWT với thư viện `jose`
- **Form & Validation:** `react-hook-form` + `zod`

## 🚀 Hướng Dẫn Deploy Lên Vercel

Dự án này được thiết kế để tương thích 100% với môi trường serverless của Vercel. Hãy làm theo các bước sau để deploy website lên internet.

### Bước 1: Khởi tạo Database (Supabase)
1. Đăng ký tài khoản tại [Supabase](https://supabase.com/).
2. Tạo một Project mới.
3. Vào phần **Project Settings > Database**, kéo xuống mục **Connection string** -> chọn **URI**.
4. Copy chuỗi kết nối. Nên dùng cổng Pooling (vd: cổng 6543) thay vì cổng gốc (5432) để tránh quá tải kết nối (Connection Pool) trong môi trường Serverless.
   *VD: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`*

### Bước 2: Push code lên Github
1. Mở Terminal tại thư mục code, chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "Init Sim Phat Loc source code"
   git branch -M main
   git remote add origin https://github.com/[username]/simphatlocvn.git
   git push -u origin main
   ```

### Bước 3: Deploy trên Vercel
1. Đăng nhập [Vercel](https://vercel.com/) và bấm **Add New Project**.
2. Chọn repo `simphatlocvn` bạn vừa push lên.
3. Trong phần **Environment Variables**, hãy thiết lập các biến sau:
   - `DATABASE_URL`: Dán chuỗi kết nối Supabase ở Bước 1 vào.
   - `NEXTAUTH_SECRET`: Một chuỗi ngẫu nhiên dài (Ví dụ: sinh ra bằng cách gõ bừa hoặc dùng công cụ sinh token).
   - `NEXT_PUBLIC_SITE_URL`: Domain thực tế của bạn (VD: `https://simphatlocvn.com`).
4. Bấm **Deploy**.
5. *Lưu ý: Quá trình build ban đầu sẽ thành công, nhưng web chưa có bảng database.*

### Bước 4: Khởi tạo bảng Database và Dữ liệu mẫu
Mở Terminal ở máy tính của bạn và chạy:
```bash
# Push cấu trúc bảng lên database production
npx prisma migrate deploy

# (Tuỳ chọn) Tạo tài khoản Admin và 60 sim mẫu
npx prisma db seed
```

### Bước 5: Đăng nhập Quản trị
- Sau khi seed xong, truy cập `https://[domain-cua-ban]/admin/login`.
- Mặc định Admin là: `admin@simphatlocvn.com` | `Admin@123`
- Hãy thay đổi thông tin cài đặt (Hotline, Zalo, Ngân hàng) trong trang quản trị.

---

## 🔒 Ghi chú về Database Enum Mismatch
Trong dự án này, schema của Prisma có sử dụng `Enum` (như `SimStatus` hay `SimType`), nhưng vì một số DB lưu dưới dạng TEXT thuần, Prisma có thể gặp lỗi khi so sánh.
*Giải pháp đã được áp dụng:* Toàn bộ code fetching đã được chuyển sang chế độ "Fetch All và Lọc bằng Javascript" ở những field nhạy cảm. Bạn **không cần phải can thiệp hay cấu hình gì thêm**, hệ thống đã an toàn 100%.

Chúc bạn kinh doanh hồng phát! 🚀
