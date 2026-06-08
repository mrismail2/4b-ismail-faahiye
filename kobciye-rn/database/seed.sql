-- =============================================================
-- Kobciye Phase 2 — Seed Data
-- Run after policies.sql
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- =============================================================

-- =============================================================
-- PLANS
-- =============================================================

insert into plans (tier, name, price_usd, max_students, description) values
  ('small',  'Small School',  10.00, 100,  'Perfect for small and community schools — every core tool included.')
on conflict (tier) do nothing;

insert into plans (tier, name, price_usd, max_students, description) values
  ('medium', 'Medium School', 20.00, 500,  'For growing schools that need more classes and deeper insight.')
on conflict (tier) do nothing;

insert into plans (tier, name, price_usd, max_students, description) values
  ('large',  'Large School',  50.00, null, 'Unlimited students and staff — priority support and every module.')
on conflict (tier) do nothing;

-- =============================================================
-- PERMISSIONS
-- =============================================================

insert into permissions (code, module, description) values
  ('students.view',           'students',      'View student list and profiles'),
  ('students.create',         'students',      'Enroll new students'),
  ('students.edit',           'students',      'Edit student records'),
  ('students.delete',         'students',      'Remove students'),
  ('attendance.view',         'attendance',    'View attendance records'),
  ('attendance.mark',         'attendance',    'Mark and edit attendance'),
  ('exams.view',              'exams',         'View exams and results'),
  ('exams.create',            'exams',         'Create and publish exams'),
  ('exams.grade',             'exams',         'Enter and edit exam results'),
  ('payments.view',           'payments',      'View payment records'),
  ('payments.create',         'payments',      'Record new payments'),
  ('payments.edit',           'payments',      'Edit payment entries'),
  ('lessons.view',            'lessons',       'View lesson preparations'),
  ('lessons.submit',          'lessons',       'Submit lesson preparations'),
  ('lessons.review',          'lessons',       'Review and approve lesson preps'),
  ('messages.send',           'messages',      'Send messages to parents and teachers'),
  ('reports.view',            'reports',       'View parent reports'),
  ('reports.generate',        'reports',       'Generate and send parent reports'),
  ('staff.view',              'staff',         'View staff list'),
  ('staff.manage',            'staff',         'Add, edit and deactivate staff'),
  ('permissions.manage',      'permissions',   'Manage role permissions'),
  ('subscription.view',       'subscription',  'View subscription details'),
  ('subscription.manage',     'subscription',  'Change subscription plan')
on conflict (code) do nothing;

-- =============================================================
-- DEMO SCHOOL (used only in development / staging)
-- Remove or replace before production.
-- =============================================================

insert into schools (id, name, slug, city, country) values
  ('00000000-0000-0000-0000-000000000001', 'Kobciye Demo School', 'kobciye-demo', 'Mogadishu', 'Somalia')
on conflict (slug) do nothing;
