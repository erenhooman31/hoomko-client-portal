# پرتال مشتریان و مدیریت پروژه

نمونه کار فارسی و RTL برای مدیریت پروژه، تیکت، تایید تحویل مرحله ای، صورت حساب و فایل های Handoff.

## لینک ها

- نسخه آنلاین: https://hoomko-client-portal.vercel.app
- مخزن GitHub: https://github.com/erenhooman31/hoomko-client-portal

## مطالعه موردی

### مسئله

کارفرماها معمولا وضعیت پروژه، تیکت ها، فایل ها، صورت حساب و مراحل تحویل را در پیام رسان ها و فایل های پراکنده دنبال می کنند. این پراکندگی اعتماد را کم و تحویل را مبهم می کند.

### راهکار

این پرتال یک تجربه فارسی برای شفاف سازی کل چرخه همکاری می سازد: دریافت نیازمندی، وضعیت پروژه، تایید مرحله ها، پاسخ به تیکت، بستن درخواست، پیگیری صورت حساب و خروجی تحویل.

### قابلیت های کلیدی

- فرم Intake برای ثبت نیازمندی و اولویت پروژه
- داشبورد پروژه ها با بودجه، فناوری، وضعیت و پیشرفت
- تایید مرحله های تحویل و پذیرش نهایی پروژه
- فیلتر تیکت، ثبت پاسخ، بستن تیکت و ذخیره تاریخچه در `localStorage`
- تایم لاین صورت حساب و وضعیت پرداخت
- بخش فایل های تحویل و خروجی JSON برای Handoff پروژه
- Vercel Function برای health check و handoff summary
- بخش معماری قابل توسعه، پکیج فروش و لینک به محصولات دیگر مجموعه Hoomko
- پشتیبانی از SEO، RTL، skip link و فوکوس قابل مشاهده برای کیبورد

### فناوری ها

React، Vite، CSS، `@fontsource/vazirmatn`، Vercel Functions و داده های نمونه امن بدون احراز هویت یا اطلاعات مشتری واقعی.

### API دمو

- `GET /api/health`
- `GET /api/handoff-summary`
- `GET /api/session`
- `GET|POST /api/tickets`
- `POST /api/contact`

## راه اندازی Supabase رایگان

1. در Supabase یک پروژه رایگان بسازید.
2. فایل `supabase/schema.sql` را در SQL Editor اجرا کنید.
3. برای نسخه واقعی، Supabase Auth را فعال کنید و کاربران را به `portal_profiles` وصل کنید.
4. مقادیر `.env.example` را در Vercel Environment Variables قرار دهید.
5. بعد از Deploy، API از حالت `demo` به `supabase` تغییر می کند.

## n8n

Workflow قابل import در `n8n-workflows/ticket-created-to-client-update.json` قرار دارد.

## اجرای محلی

```bash
npm install
npm run dev
```
