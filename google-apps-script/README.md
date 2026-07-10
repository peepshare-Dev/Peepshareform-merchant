# เชื่อมฟอร์มกับ Google Sheets และ Google Drive

ฟอร์มนี้บันทึกข้อมูลสมัครร้านค้าลง Google Sheets และเก็บโลโก้/รูปภาพลง Google Drive ผ่าน Google Apps Script

## ตั้งค่า Google

1. สร้าง Google Sheet สำหรับใบสมัคร และสร้างโฟลเดอร์ Google Drive สำหรับรูปภาพ
2. เปิด [Google Apps Script](https://script.google.com) แล้วสร้างโปรเจกต์ใหม่
3. วางเนื้อหาจาก `Code.gs` ลงในไฟล์ `Code.gs` ของโปรเจกต์
4. ไปที่ **Project Settings → Script properties** แล้วเพิ่ม `SPREADSHEET_ID` (รหัสใน URL ของ Sheet) และ `DRIVE_FOLDER_ID` (รหัสใน URL ของโฟลเดอร์)
5. กด **Deploy → New deployment → Web app** เลือก Execute as: **Me**, Who has access: **Anyone** แล้วอนุญาตสิทธิ์
6. คัดลอก Web app URL ที่ลงท้ายด้วย `/exec`

## ตั้งค่าโปรเจกต์นี้

1. คัดลอก `.env.example` เป็น `.env.local`
2. ใส่ URL ที่ได้ใน `VITE_GOOGLE_SCRIPT_URL`
3. รัน `npm run dev` แล้วทดลองส่งฟอร์มหนึ่งครั้ง

อย่า commit `.env.local` หรือใช้ URL ทดสอบที่ลงท้ายด้วย `/dev` กับผู้ใช้จริง

## ข้อควรระวัง

- Web app ต้องเรียกได้จากภายนอก เพราะผู้สมัครไม่ได้ล็อกอิน Google
- จำกัดสิทธิ์เข้าถึง Spreadsheet และ Drive folder ให้เฉพาะทีมที่เกี่ยวข้อง
- เมื่อแก้ `Code.gs` ให้ Deploy เวอร์ชันใหม่ โดยใช้ URL `/exec` เดิม
