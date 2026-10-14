# Журнал тренировок

Один HTML-файл без сборки. Данные хранятся в Supabase, поэтому они одинаковые на любом устройстве. Без интернета трекер тоже работает: записи отправятся, когда появится связь.

Файлы:
- `index.html` — весь трекер
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — чтобы ставился на главный экран как приложение и работал офлайн

---

## 1. Supabase (≈5 минут)

1. Зайди на supabase.com → **New project**. Регион любой (ближе всего Frankfurt).
2. Открой **SQL Editor** → New query, вставь и нажми **Run**:

```sql
create table tracker (
  user_id uuid primary key references auth.users on delete cascade default auth.uid(),
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table tracker enable row level security;

create policy "только свои записи" on tracker
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

3. **Authentication → Emails → Magic Link** (шаблон письма). Замени текст письма на:

```html
<h2>Код для входа</h2>
<p>Твой код: <strong>{{ .Token }}</strong></p>
```

   Это нужно, чтобы в письме приходил **код**, а не ссылка. На айфоне приложение с главного экрана живёт отдельно от Safari, и ссылка залогинила бы не его.

4. **Project Settings → API** (или **API Keys**). Скопируй:
   - **Project URL**, например `https://abcdxyz.supabase.co`
   - ключ **anon public** (в новых проектах он называется **publishable**)

## 2. Вставь ключи

Открой `index.html`, найди вверху блок «НАСТРОЙКА» и вставь:

```js
const SUPABASE_URL = "https://abcdxyz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOi...";
```

Этот ключ публичный, светить его в коде нормально. Данные защищает политика из шага 1: каждый видит только свои записи.

## 3. GitHub Pages (≈3 минуты)

1. github.com → **New repository**, например `gym-tracker`, **Public**.
2. **Add file → Upload files**, перетащи все файлы из папки и нажми **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, папка `/ (root)` → **Save**.
4. Через минуту появится ссылка вида `https://meeeeeeerik.github.io/gym-tracker/`.

## 4. На телефоне

1. Открой ссылку в **Safari** → «Поделиться» → **«На экран «Домой»»**.
2. Открой трекер **с иконки**, введи почту, введи код из письма. Это нужно один раз на каждом устройстве.
3. Внизу должно появиться «☁︎ Синхронизировано».

## 5. Забрать первую тренировку из старого трекера

1. На **iPhone 12** открой старый трекер в Claude → «Ручной перенос данных» → **«Скопировать мои данные»**.
2. Отправь код себе (Заметки, Telegram «Избранное»).
3. В новом трекере → «Аккаунт и перенос данных» → вставь код → **«Загрузить данные»**.

---

### Полезное

- **Обновить трекер:** замени `index.html` в репозитории. Телефон подтянет новую версию при следующем открытии с интернетом.
- **Закрыть регистрацию для чужих** (необязательно): когда сам вошёл на всех устройствах, отключи **Authentication → Sign In / Providers → Allow new users to sign up**. Даже без этого чужие не увидят твои данные, у каждого только свои записи.
- **Бесплатный проект Supabase засыпает** после недели без запросов. Пока тренируешься 3 раза в неделю, этого не случится. Если всё же уснёт, в панели Supabase нажми **Restore**.
- **Бэкап:** «Скопировать мои данные» даёт весь журнал одним кодом. Можно иногда сохранять его в заметки.
