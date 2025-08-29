# 📘 SmartDesk Project – API Documentation

## 🌐 Base URL
http://localhost:4000/api/v1


## 1. Device APIs

### 🔹 Đăng ký thiết bị
**POST** `/devices/register`

- Request body (JSON):
```json
{
  "device_uid": "DESK-001",
  "name": "My ESP32"
}
Response:
{
  "device_uid": "DESK-001",
  "token": "706b9e7403f5dd1b29bcc615f037056d"
}
🔹 Lấy danh sách thiết bị
GET /devices

Response (JSON array):

[
  {
    "id": 1,
    "device_uid": "DESK-001",
    "name": "My ESP32",
    "token": "706b9e7403f5dd1b29bcc615f037056d",
    "last_seen": "2025-08-28T09:50:00.000Z"
  }
]
🔹 Sửa tên thiết bị
POST /devices/edit/:id

Request body:

{
  "name": "ESP32 phòng khách"
}
Response: redirect /devices (nếu gọi từ web)

API JSON có thể trả về { "ok": true } (tùy chỉnh thêm).

🔹 Xóa thiết bị
GET /devices/delete/:id

Xóa thiết bị khỏi DB.

Response: redirect /devices.

2. Telemetry APIs
🔹 Gửi dữ liệu cảm biến
POST /telemetry

Headers:

Authorization: Bearer <device_token>

Request body (JSON):

{
  "temperature": 28.5,
  "humidity": 65,
  "light": 300,
  "noise": 20
}
Response:
{ "ok": true }
3. Readings APIs
🔹 Lấy readings (mới nhất 50 bản ghi)
GET /readings/:device_id

Ví dụ:
/readings/1

Response:
[
  {
    "id": 10,
    "device_id": 1,
    "ts": "2025-08-28T10:29:42.000Z",
    "temperature": 28.7,
    "humidity": 61.5,
    "light": 450,
    "noise": 30
  }
]

🔹 Lấy reading mới nhất
GET /readings/:device_id/latest

Ví dụ:
/readings/1/latest

Response:
{
  "id": 11,
  "device_id": 1,
  "ts": "2025-08-28T10:35:00.000Z",
  "temperature": 29,
  "humidity": 60,
  "light": 470,
  "noise": 35
}

🔹 Lọc readings theo thời gian
GET /readings/:device_id/range?start=YYYY-MM-DD&end=YYYY-MM-DD
Ví dụ:
/readings/1/range?start=2025-08-28&end=2025-08-29

Response:
[
  {
    "id": 12,
    "device_id": 1,
    "ts": "2025-08-28T12:00:00.000Z",
    "temperature": 28.5,
    "humidity": 62,
    "light": 480,
    "noise": 25
  }
]

4. Web Views (EJS)
/dashboard → giao diện chính, liệt kê devices.

/readings/:device_id → giao diện chi tiết, hiển thị bảng & biểu đồ realtime.

/devices → quản lý thiết bị (thêm/sửa/xóa).

5. Database Schema
🔹 Table devices
Field	Type	Note
id	INT PK AI	Khóa chính, tự tăng
device_uid	VARCHAR	UID phần cứng (ví dụ DESK-001)
name	VARCHAR	Tên thiết bị
token	VARCHAR	Token dùng để gửi telemetry
last_seen	DATETIME	Lần cuối gửi dữ liệu

🔹 Table readings
Field	Type	Note
id	INT PK AI	Khóa chính, tự tăng
device_id	INT	FK tới devices(id)
ts	DATETIME	Thời gian đọc dữ liệu
temperature	FLOAT	°C
humidity	FLOAT	%
light	INT	Lux (giá trị ánh sáng)
noise	INT	dB (giá trị tiếng ồn)

📌 Ghi chú
device_id: khóa chính trong DB, dùng để join readings với devices.

device_uid: UID định danh do bạn gán khi đăng ký ESP32.

ESP32: khi gửi telemetry phải kèm header Authorization: Bearer <token>.

Token: cấp khi đăng ký thiết bị (/devices/register), để xác thực mỗi lần gửi dữ liệu.