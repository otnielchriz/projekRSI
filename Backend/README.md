# KerjoLe Backend

FastAPI + PostgreSQL menggunakan Docker.

## Jalankan

```powershell
docker compose up --build
```

Swagger:

```text
http://localhost:8000/docs
```

Database PostgreSQL otomatis dibuat oleh Docker Compose:

```text
POSTGRES_DB=kerjole_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Di dalam container backend, koneksi database memakai host Docker service `db`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@db:5432/kerjole_db
```
