# KerjoLe Platform

Struktur project sudah dirapikan:

```text
kerjo_le-platform/
├── Frontend/
└── Backend/
```

## Jalankan Backend

```powershell
cd Backend
docker compose up --build
```

Swagger API: http://localhost:8000/docs

## Jalankan Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Akun Demo

Pelamar:
- email: user@kerjole.com
- password: user12345

Perusahaan:
- email: company@kerjole.com
- password: company12345

Admin:
- email: admin@kerjole.com
- password: admin12345

## Catatan

Frontend sudah fetch ke backend melalui `Frontend/src/app/services/api.ts`. Setelah login, dashboard membaca user aktif dari endpoint `/auth/me` dan data profil dari `/profile/overview`.
