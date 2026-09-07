<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
# Agent.md

## Project
PEEP SHARE Merchant Registration Form

## Goal
Build a simple merchant registration form for stores that want to join PEEP SHARE.

The form must collect merchant information and submit the data to Google Sheets as soon as the user clicks Submit.

## Important Requirement
When the user submits the form, the system must send the form data to Google Sheets in near real-time using Google Apps Script Web App API.

This means:
- User fills in the form
- User clicks Submit
- Frontend sends POST request to Google Apps Script endpoint
- Google Apps Script appends the data into Google Sheets immediately
- Frontend shows success or error status

Do not store the data only locally.
Do not use mock submission only.
Prepare real integration structure for Google Sheets.

## Tech Stack
Use:
- React
- TypeScript
- Tailwind CSS

## UI Style
Design should be:
- Clean
- Simple
- Easy to use
- Mobile responsive
- Similar to Google Form but more polished
- Use PEEP SHARE orange as the main accent color
- White cards on soft light background

## Page Structure

### Header
Title:
แบบฟอร์มสมัครร้านค้ากับ PEEP SHARE

Subtitle:
ลงทะเบียนร้านค้าเพื่อเข้าร่วมโปรโมชันและแสดงร้านค้าบนแอป PEEP SHARE

### Info Card
Show this content:

ร้านค้าที่ลงทะเบียนกับ PEEP SHARE จะได้รับ:
- พื้นที่โปรโมชันในแอปโดยไม่มีค่าใช้จ่าย
- การสนับสนุนด้านคอนเทนต์ดีไซน์จากทีม JTS
- การโปรโมทภายในแอปเพื่อเข้าถึงผู้ใช้งาน
- ร้านค้าสามารถกำหนดเงื่อนไขโปรโมชันได้เอง

## Form Fields

Required:
1. Store name / ชื่อร้านค้า
2. Store logo upload
3. Google Maps location link
4. Opening hours
5. Contact person name
6. Contact phone number
7. Store category
8. Store contact channel
9. Coupon or promotion detail
10. Consent checkbox

Optional:
1. Store description
2. Store images upload
3. Additional note

## Store Category Options
- ร้านอาหาร
- คาเฟ่
- แฟชั่น
- สุขภาพ
- บริการ
- อื่นๆ

## Validation
Required fields must be validated before submit.

Rules:
- Submit button should be disabled until required fields are completed
- Consent checkbox must be checked before submit
- Show clear error message under invalid fields
- Phone number should support Thai phone format
- Google Maps link should look like a URL

## Submit Behavior

Create a constant:

```ts
const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";









