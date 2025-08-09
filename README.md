# React Weather & Settings App

Bu loyiha React va Redux asosida yozilgan ob-havo va sozlamalar sahifasini o‘z ichiga oladi. Foydalanuvchi o‘z joylashuviga qarab ob-havo ma'lumotlarini olishi, shuningdek, sahifa uchun Dark Mode rejimini yoqishi yoki o‘chirishi mumkin. Shuningdek, foydalanuvchi o‘zining asosiy shahrini qidirib tanlashi mumkin.

---

## Asosiy imkoniyatlar

- Foydalanuvchi geolokatsiyasidan foydalanib, joylashuvni aniqlash.
- Mamlakat va poytaxtlar ro‘yxatidan shahar qidirish va tanlash.
- Dark Mode rejimini yoqish/o‘chirish va sozlamalarni localStorage’da saqlash.
- Redux orqali holatlarni boshqarish.
- React Query orqali api bilan ishlash.
- Debounce qilingan qidiruv funksiyasi.
- Animatsiyalar va interaktiv UI uchun `motion` kutubxonasi.
- Responsive dizayn va tematik fon rasmlari.
- Ob-havo, tun, kun va 4 fasilga qarab almashib turuvchi fon rasimlari.

## Unit Test

- weatherSlice uchun test   // path src/entities/weather/model/weatherSlice.test.ts
- useGetWeather Hook uchun test // path src/features/weather/model/hooks/useGetWeather.test.tsx

---

## Ishga tushirish

### Talablar

- Node.js (v14 yoki undan yuqori)
- npm yoki yarn

### O‘rnatish

```bash
git clone <repository-url>
cd <project-folder>
npm install
npm run dev
