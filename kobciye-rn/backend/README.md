# Kobciye School Management SaaS — Django Backend

A multi-tenant REST API backend for the Kobciye school management platform, built with Django 4.2 and Django REST Framework.

---

## Prerequisites

- Python 3.11+
- PostgreSQL 14+
- pip

---

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 2. Create .env from .env.example

```bash
cp .env.example .env
```

Edit `.env` and set your own `SECRET_KEY`, database credentials, and allowed origins.

---

## 3. PostgreSQL setup

```sql
-- Run as the postgres superuser:
CREATE DATABASE kobciye_db;
CREATE USER kobciye_user WITH PASSWORD 'your-db-password';
ALTER ROLE kobciye_user SET client_encoding TO 'utf8';
ALTER ROLE kobciye_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE kobciye_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE kobciye_db TO kobciye_user;
```

Or using the shell:

```bash
psql -U postgres -c "CREATE DATABASE kobciye_db;"
psql -U postgres -c "CREATE USER kobciye_user WITH PASSWORD 'your-db-password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE kobciye_db TO kobciye_user;"
```

---

## 4. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 5. Create a superuser

```bash
python manage.py createsuperuser
```

---

## 6. Start the development server

```bash
python manage.py runserver
```

---

## 7. Django Admin

Access the admin panel at: http://127.0.0.1:8000/admin/

---

## Models / Tables (by app)

| App | Models |
|---|---|
| **accounts** | UserProfile |
| **schools** | School |
| **students** | Student |
| **parents** | Parent, ParentStudent |
| **teachers** | Teacher |
| **academics** | ClassRoom, Subject, TeacherAssignment |
| **attendance** | Attendance |
| **exams** | Exam, ExamResult |
| **payments** | Payment |
| **lessons** | LessonPreparation |
| **messaging** | Message, Notification |
| **reports** | ParentReport |
| **subscriptions** | Plan, Subscription |
| **audit** | AuditLog |

---

## API Endpoints

All endpoints are mounted under `/api/v1/<app>/`. Examples:

- `GET /api/v1/accounts/userprofiles/`
- `GET /api/v1/schools/`
- `GET /api/v1/students/`
- `GET /api/v1/parents/parents/`
- `GET /api/v1/parents/parent-students/`
- `GET /api/v1/teachers/`
- `GET /api/v1/academics/classrooms/`
- `GET /api/v1/academics/subjects/`
- `GET /api/v1/academics/teacher-assignments/`
- `GET /api/v1/attendance/`
- `GET /api/v1/exams/exams/`
- `GET /api/v1/exams/results/`
- `GET /api/v1/payments/`
- `GET /api/v1/lessons/`
- `GET /api/v1/messaging/messages/`
- `GET /api/v1/messaging/notifications/`
- `GET /api/v1/reports/`
- `GET /api/v1/subscriptions/plans/`
- `GET /api/v1/subscriptions/subscriptions/`
- `GET /api/v1/audit/`

---

## Custom Permission Classes (accounts/permissions.py)

| Class | Description |
|---|---|
| `IsActiveUser` | User's profile must be active (is_active=True, status='active') |
| `IsSuperAdmin` | role='super_admin' — platform-wide access |
| `IsSchoolAdmin` | role='school_admin' — manages one school |
| `IsTeacher` | role='teacher' — classroom-level access |
| `IsAccountant` | role='accountant' — financial records |
| `IsParent` | role='parent' — linked student data only |
| `IsStudent` | role='student' — own data only |
| `SameSchoolOnly` | Object-level: user's school must match object's school |
| `ParentOfStudentOnly` | Object-level: user must be a parent linked to the student |
| `TeacherAssignedClassOnly` | Object-level: teacher must be assigned to the object's classroom |

---

## Default user behaviour

New `UserProfile` records default to:
- `role = 'parent'`
- `status = 'inactive'`
- `is_active = False`
- `school = null`

Accounts must be activated manually (by a super_admin or school_admin) before the user can access protected endpoints.

---

## What remains for Phase 3

- JWT / token authentication (e.g. `djangorestframework-simplejwt`)
- School isolation enforced in every `get_queryset()` override
- `perform_create()` overrides to auto-assign `school` and `recorded_by`/`created_by`
- Fine-grained permission wiring per viewset action
- AuditLog signal handlers (auto-log creates/updates/deletes)
- Password reset / email verification flows
- File upload validation and size limits
- Rate limiting and throttling
- Comprehensive test suite (pytest-django)
- Docker / docker-compose setup
- Production settings (HTTPS, static file serving, etc.)
