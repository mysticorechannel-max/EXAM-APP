# Technical Design Document: Exam System Foundation

## 1. Project Overview

This design document describes the technical architecture for the Exam Management System foundation. The scope covers project scaffolding, configuration, shared modules, and architectural patterns — no business features are implemented.

The system will serve two user types via separate module groups:
- **Student Module**: Features for exam-taking students (auth, dashboard, exams, submissions, results, profile, diplomas)
- **Admin Module**: Features for administrators (admin, audit, questions, upload)

---

## 2. Technology Stack

| Category | Technology | Version/Notes |
|----------|-----------|---------------|
| Framework | React | 19.x |
| Language | TypeScript | 5.x, strict mode |
| Build Tool | Vite | 6.x |
| Routing | React Router DOM | 7.x |
| Styling | Tailwind CSS | 4.x |
| Component Primitives | shadcn/ui | Latest |
| Form Management | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| Form Resolver | @hookform/resolvers | Latest |
| Server State | TanStack Query | 5.x |
| HTTP Client | Axios | 1.x |
| Client State | Zustand | 5.x |
| Notifications | Sonner | Latest |
| Icons | Lucide React | Latest |
| Class Utils | clsx + tailwind-merge | Latest |
| Linting | ESLint | 9.x (flat config) |
| Formatting | Prettier | 3.x |
| Future Testing | Vitest + React Testing Library | Not configured yet |

---

## 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Application                        │
├─────────────────────────────────────────────────────┤
│  Provider Tree (Query, Router, Toast, ErrorBoundary) │
├─────────────────────────────────────────────────────┤
│  Layouts (MainLayout, AuthLayout, AdminLayout)       │
├──────────────────────┬──────────────────────────────┤
│   Student Routes     │      Admin Routes             │
├──────────────────────┴──────────────────────────────┤
│              Feature Modules (Lazy Loaded)            │
│  ┌─────┐ ┌─────────┐ ┌─────┐ ┌───────────┐        │
│  │auth │ │dashboard│ │exams│ │submissions│ ...      │
│  └─────┘ └─────────┘ └─────┘ └───────────┘        │
├─────────────────────────────────────────────────────┤
│              Shared Module                            │
│  components │ hooks │ lib │ api │ utils │ types      │
├─────────────────────────────────────────────────────┤
│  API Layer (Axios + Interceptors)                    │
├─────────────────────────────────────────────────────┤
│  External Services (Backend API)                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Folder Structure

```
exam-system/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── router.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── routes/
│   │   │   ├── schemas/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── skeletons/
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   └── (same structure)
│   │   ├── diplomas/
│   │   │   └── (same structure)
│   │   ├── exams/
│   │   │   └── (same structure)
│   │   ├── questions/
│   │   │   └── (same structure)
│   │   ├── submissions/
│   │   │   └── (same structure)
│   │   ├── results/
│   │   │   └── (same structure)
│   │   ├── profile/
│   │   │   └── (same structure)
│   │   ├── upload/
│   │   │   └── (same structure)
│   │   ├── admin/
│   │   │   └── (same structure)
│   │   └── audit/
│   │       └── (same structure)
│   ├── shared/
│   │   ├── api/
│   │   │   ├── axios-instance.ts
│   │   │   ├── api-error.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── PasswordInput.tsx
│   │   │   │   ├── Textarea.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── RadioGroup.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── SearchInput.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   └── ConfirmDialog.tsx
│   │   │   ├── layout/
│   │   │   │   ├── PageContainer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   └── index.ts
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── query-client.ts
│   │   │   └── index.ts
│   │   ├── constants/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   └── index.ts
│   │   └── types/
│   │       ├── api.types.ts
│   │       └── index.ts
│   ├── assets/
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 5. Feature-Based Architecture

### 5.1 Feature Module Internal Structure

Each feature module follows this exact structure:

```
features/{feature-name}/
├── api/            # API call functions (Axios + TanStack Query hooks)
├── components/     # Feature-specific UI components
├── hooks/          # Feature-specific custom hooks
├── routes/         # Route components (lazy-loaded entry points)
├── schemas/        # Zod validation schemas
├── services/       # Business logic functions (pure, testable)
├── stores/         # Zustand stores for feature-local state
├── skeletons/      # Loading skeleton components
├── types/          # TypeScript interfaces and types
├── utils/          # Feature-specific utility functions
└── index.ts        # Barrel export (public API of the feature)
```

### 5.2 Feature Isolation Rules

- A Feature_Module SHALL NOT import from another Feature_Module directly
- Cross-feature communication happens via shared stores or URL params
- Each feature's `index.ts` exports only what other modules may need (route config)
- All internal imports within a feature use relative paths

### 5.3 Layer Separation Within a Feature

```
┌─────────────────────────────────────┐
│  Routes (Page Components)            │  ← Entry points, compose components
├─────────────────────────────────────┤
│  Components (UI Layer)               │  ← Presentation, receive props
├─────────────────────────────────────┤
│  Hooks (Integration Layer)           │  ← Connect API/stores to components
├─────────────────────────────────────┤
│  Services (Business Logic)           │  ← Pure functions, transformations
├─────────────────────────────────────┤
│  API (Data Access Layer)             │  ← HTTP calls, query definitions
├─────────────────────────────────────┤
│  Stores (State Layer)                │  ← Client-side state management
├─────────────────────────────────────┤
│  Schemas (Validation Layer)          │  ← Zod schemas for forms/data
├─────────────────────────────────────┤
│  Types (Type Definitions)            │  ← Interfaces, enums, type aliases
└─────────────────────────────────────┘
```

---

## 6. Shared Module Architecture

### 6.1 Principles

- Contains ONLY reusable, presentation-only code
- Zero business logic
- All components are generic and configurable via props
- Shared hooks are utility hooks (not feature-specific)

### 6.2 Shared Module Structure

| Directory | Purpose | Example |
|-----------|---------|---------|
| `api/` | Axios instance, interceptors, error types | `axios-instance.ts` |
| `components/ui/` | Reusable UI primitives | `Button.tsx`, `Input.tsx` |
| `components/layout/` | Layout building blocks | `Sidebar.tsx`, `Navbar.tsx` |
| `hooks/` | Shared utility hooks | `useDebounce`, `useMediaQuery` |
| `providers/` | Global context providers | `AppProviders.tsx` |
| `layouts/` | Page layout compositions | `MainLayout.tsx` |
| `lib/` | Library configurations | `query-client.ts` |
| `constants/` | Application-wide constants | Route paths, query keys |
| `utils/` | Pure utility functions | `cn.ts`, formatters |
| `types/` | Shared type definitions | `api.types.ts` |

---

## 7. State Management Strategy

### 7.1 State Categories

| State Type | Tool | Location |
|-----------|------|----------|
| Server State | TanStack Query | Feature `api/` directory |
| Client Global State | Zustand | Feature `stores/` or `shared/stores/` |
| Form State | React Hook Form | Component-local |
| UI Local State | useState/useReducer | Component-local |
| URL State | React Router | URL params/search params |

### 7.2 Zustand Store Pattern

```typescript
// src/shared/lib/create-store.ts — Store creation pattern
import { create } from 'zustand';

// Example: UI store for sidebar state
interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
```

### 7.3 Feature Store Pattern

```typescript
// src/features/exams/stores/exam-filters.store.ts
import { create } from 'zustand';
import type { ExamFilters } from '../types';

interface ExamFiltersStore {
  filters: ExamFilters;
  setFilters: (filters: Partial<ExamFilters>) => void;
  resetFilters: () => void;
}

const initialFilters: ExamFilters = {
  search: '',
  status: 'all',
  page: 1,
};

export const useExamFiltersStore = create<ExamFiltersStore>((set) => ({
  filters: initialFilters,
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: initialFilters }),
}));
```

---

## 8. API Layer Architecture

### 8.1 Axios Instance Configuration

```typescript
// src/shared/api/axios-instance.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/lib/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalizedError: ApiError = {
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      status: error.response?.status ?? 500,
      code: error.code ?? 'UNKNOWN_ERROR',
    };
    return Promise.reject(normalizedError);
  }
);
```

### 8.2 API Error Type

```typescript
// src/shared/api/api-error.ts
export interface ApiError {
  message: string;
  status: number;
  code: string;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    'code' in error
  );
}
```

### 8.3 Feature API Pattern (Axios + TanStack Query)

```typescript
// src/features/exams/api/exams.api.ts
import { apiClient } from '@/shared/api';
import type { Exam, ExamListParams, PaginatedResponse } from '../types';

export const examsApi = {
  getAll: (params: ExamListParams) =>
    apiClient.get<PaginatedResponse<Exam>>('/exams', { params }),
  
  getById: (id: string) =>
    apiClient.get<Exam>(`/exams/${id}`),
};

// src/features/exams/api/exams.queries.ts
import { queryOptions } from '@tanstack/react-query';
import { examsApi } from './exams.api';
import type { ExamListParams } from '../types';

export const examsQueries = {
  all: () => queryOptions({ queryKey: ['exams'] }),
  
  list: (params: ExamListParams) =>
    queryOptions({
      queryKey: ['exams', 'list', params],
      queryFn: () => examsApi.getAll(params).then((res) => res.data),
    }),
  
  detail: (id: string) =>
    queryOptions({
      queryKey: ['exams', 'detail', id],
      queryFn: () => examsApi.getById(id).then((res) => res.data),
      enabled: !!id,
    }),
};
```

---

## 9. Routing Architecture

### 9.1 Route Configuration

```typescript
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/shared/layouts';
import { AdminLayout } from '@/shared/layouts';
import { AuthLayout } from '@/shared/layouts';
import { Spinner } from '@/shared/components';
import { NotFoundPage } from '@/app/NotFoundPage';

// Lazy-loaded feature routes
const AuthRoutes = lazy(() => import('@/features/auth/routes'));
const DashboardRoutes = lazy(() => import('@/features/dashboard/routes'));
const ExamsRoutes = lazy(() => import('@/features/exams/routes'));
const QuestionsRoutes = lazy(() => import('@/features/questions/routes'));
const SubmissionsRoutes = lazy(() => import('@/features/submissions/routes'));
const ResultsRoutes = lazy(() => import('@/features/results/routes'));
const DiplomasRoutes = lazy(() => import('@/features/diplomas/routes'));
const ProfileRoutes = lazy(() => import('@/features/profile/routes'));
const UploadRoutes = lazy(() => import('@/features/upload/routes'));
const AdminRoutes = lazy(() => import('@/features/admin/routes'));
const AuditRoutes = lazy(() => import('@/features/audit/routes'));

function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Auth routes (no main layout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'auth/*',
        element: <LazyRoute><AuthRoutes /></LazyRoute>,
      },
    ],
  },
  // Student routes
  {
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard/*',
        element: <LazyRoute><DashboardRoutes /></LazyRoute>,
      },
      {
        path: 'exams/*',
        element: <LazyRoute><ExamsRoutes /></LazyRoute>,
      },
      {
        path: 'submissions/*',
        element: <LazyRoute><SubmissionsRoutes /></LazyRoute>,
      },
      {
        path: 'results/*',
        element: <LazyRoute><ResultsRoutes /></LazyRoute>,
      },
      {
        path: 'diplomas/*',
        element: <LazyRoute><DiplomasRoutes /></LazyRoute>,
      },
      {
        path: 'profile/*',
        element: <LazyRoute><ProfileRoutes /></LazyRoute>,
      },
    ],
  },
  // Admin routes
  {
    element: <AdminLayout />,
    children: [
      {
        path: 'admin/*',
        element: <LazyRoute><AdminRoutes /></LazyRoute>,
      },
      {
        path: 'admin/questions/*',
        element: <LazyRoute><QuestionsRoutes /></LazyRoute>,
      },
      {
        path: 'admin/upload/*',
        element: <LazyRoute><UploadRoutes /></LazyRoute>,
      },
      {
        path: 'admin/audit/*',
        element: <LazyRoute><AuditRoutes /></LazyRoute>,
      },
    ],
  },
  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

### 9.2 Feature Route Entry Point Pattern

```typescript
// src/features/exams/routes/index.tsx
import { Routes, Route } from 'react-router-dom';

export default function ExamsRoutes() {
  return (
    <Routes>
      <Route index element={<div>Exams List Placeholder</div>} />
      <Route path=":id" element={<div>Exam Detail Placeholder</div>} />
    </Routes>
  );
}
```

---

## 10. Error Handling Strategy

### 10.1 Error Boundary Component

```typescript
// src/shared/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div role="alert" className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{this.state.error?.message}</p>
          <button onClick={this.handleReset} className="px-4 py-2 bg-primary text-white rounded">
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 10.2 API Error Handling Pattern

```typescript
// In TanStack Query — global error handler via QueryClient
import { toast } from 'sonner';
import { isApiError } from '@/shared/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (isApiError(error)) {
          toast.error(error.message);
        } else {
          toast.error('An unexpected error occurred');
        }
      },
    },
  },
});
```

---

## 11. Form Validation Strategy

### 11.1 Schema Definition Pattern

```typescript
// src/features/auth/schemas/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 11.2 Form Hook Integration Pattern

```typescript
// src/features/auth/hooks/useLoginForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/login.schema';

export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
}
```

### 11.3 Reusable Form Field Component

```typescript
// src/shared/components/ui/FormField.tsx
import type { FieldError } from 'react-hook-form';
import { cn } from '@/shared/utils';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}
```

---

## 12. Code Style Guidelines

### 12.1 ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2024: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.app.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
    'max-params': ['warn', 3],
  },
};
```

### 12.2 Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 13. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component files | PascalCase | `Button.tsx`, `SearchInput.tsx` |
| Component names | PascalCase | `export function Button()` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useExamList.ts` |
| Utility files | camelCase | `cn.ts`, `formatDate.ts` |
| Store files | kebab-case with `.store` suffix | `exam-filters.store.ts` |
| Schema files | kebab-case with `.schema` suffix | `login.schema.ts` |
| Type files | kebab-case with `.types` suffix | `exam.types.ts` |
| API files | kebab-case with `.api` suffix | `exams.api.ts` |
| Query files | kebab-case with `.queries` suffix | `exams.queries.ts` |
| Directories | kebab-case | `shared/`, `react-hook-form/` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_TIMEOUT` |
| Interfaces | PascalCase with descriptive name | `ExamListParams`, `ApiError` |
| Type aliases | PascalCase | `ExamStatus`, `FormFieldProps` |
| Enums | PascalCase (name), PascalCase (members) | `ExamStatus.Active` |

---

## 14. File Naming Conventions

```
Components:     PascalCase.tsx       → Button.tsx, ExamCard.tsx
Hooks:          camelCase.ts         → useAuth.ts, useExamList.ts
Utils:          camelCase.ts         → cn.ts, formatDate.ts
Types:          kebab-case.types.ts  → exam.types.ts, api.types.ts
Schemas:        kebab-case.schema.ts → login.schema.ts
Stores:         kebab-case.store.ts  → sidebar.store.ts
API:            kebab-case.api.ts    → exams.api.ts
Queries:        kebab-case.queries.ts → exams.queries.ts
Constants:      kebab-case.ts        → route-paths.ts
Barrel exports: index.ts
```

---

## 15. Import Conventions

### 15.1 Import Order

```typescript
// 1. External libraries
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// 2. Path alias imports (cross-module)
import { Button, Input } from '@/shared/components';
import { apiClient } from '@/shared/api';
import { cn } from '@/shared/utils';

// 3. Relative imports (within same feature)
import { useExamList } from '../hooks/useExamList';
import type { Exam } from '../types';
```

### 15.2 Path Alias Configuration

```json
// tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/shared/*": ["src/shared/*"],
      "@/features/*": ["src/features/*"],
      "@/app/*": ["src/app/*"],
      "@/assets/*": ["src/assets/*"]
    }
  }
}
```

```typescript
// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['clsx', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
  },
});
```

---

## 16. Environment Variables

### 16.1 Environment File

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Exam Management System
VITE_APP_VERSION=1.0.0
```

### 16.2 Typed Environment Module

```typescript
// src/shared/lib/env.ts
const requiredVars = ['VITE_API_BASE_URL'] as const;

function getEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  VITE_API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Exam System',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
```

---

## 17. Reusable Component Strategy

### 17.1 Component Design Principles

- Presentation-only: no side effects, no API calls, no business logic
- Fully typed props with TypeScript interfaces
- Composable via children, render props, or slots
- Accessible by default (ARIA attributes, keyboard handling)
- Styled with Tailwind CSS, support `className` prop override
- Small and focused (single responsibility)

### 17.2 Component API Pattern

```typescript
// src/shared/components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};
```

### 17.3 Shared Component List

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| Button | Action trigger | variant, size, isLoading |
| Input | Text input field | label, error, placeholder |
| PasswordInput | Password with toggle visibility | label, error |
| Textarea | Multi-line text | label, error, rows |
| Select | Dropdown selection | options, value, onChange |
| Checkbox | Boolean toggle | label, checked, onChange |
| RadioGroup | Single selection from group | options, value, onChange |
| Dialog | Overlay dialog (shadcn) | open, onOpenChange, children |
| Modal | Full modal with backdrop | isOpen, onClose, title |
| Loader | Full-page loading state | message |
| Spinner | Inline spinner animation | size, className |
| Pagination | Page navigation controls | currentPage, totalPages, onPageChange |
| SearchInput | Input with search icon + debounce | value, onChange, placeholder |
| EmptyState | Empty data placeholder | title, description, action |
| ErrorState | Error display with retry | message, onRetry |
| ConfirmDialog | Confirmation modal | title, message, onConfirm, onCancel |
| PageContainer | Page wrapper with padding/max-width | title, children |
| Sidebar | Navigation sidebar | items, activeItem |
| Navbar | Top navigation bar | user, onLogout |

---

## 18. Performance Considerations

### 18.1 Bundle Optimization

- **Route-level code splitting**: Every feature route is lazy-loaded
- **Vendor chunking**: React, React Router, TanStack Query, UI libraries in separate chunks
- **Tree shaking**: Ensured via ES module imports
- **No barrel export bloat**: Barrel exports used selectively; deep imports preferred for large modules

### 18.2 Runtime Performance

- **React.memo**: Applied to expensive list items and stable components
- **useMemo/useCallback**: Used for expensive computations and stable callback references passed to memoized children
- **State colocation**: State kept as close to consumer as possible to minimize re-render scope
- **Selective Zustand subscriptions**: Use selectors to prevent unnecessary re-renders

```typescript
// Good — selective subscription
const isOpen = useSidebarStore((state) => state.isOpen);

// Bad — subscribes to entire store
const store = useSidebarStore();
```

### 18.3 Vite Build Configuration

```typescript
// Chunk splitting strategy in vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        query: ['@tanstack/react-query'],
        forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
        ui: ['clsx', 'tailwind-merge', 'lucide-react', 'sonner'],
        state: ['zustand'],
      },
    },
  },
}
```

---

## 19. Development Rules

### 19.1 Component Rules

- Max 150 lines per component file
- One component per file (except small, tightly-coupled sub-components)
- Props interface defined above component
- No inline styles — use Tailwind utility classes
- Destructure props in function signature

### 19.2 Hook Rules

- Custom hooks start with `use` prefix
- One concern per hook
- Return typed objects (not arrays) for >2 values
- Hooks that call APIs should be in `api/` or `hooks/` directory

### 19.3 General Rules

- No `any` type — use `unknown` and narrow with type guards
- No `// @ts-ignore` or `// @ts-expect-error` without documented reason
- Prefer `const` over `let`; never use `var`
- Prefer named exports over default exports (except route entry points)
- Keep side effects in hooks, not in render
- No direct DOM manipulation — use refs when necessary

### 19.4 Feature Development Workflow

1. Define types in `types/`
2. Create Zod schemas in `schemas/`
3. Implement API functions in `api/`
4. Create TanStack Query hooks in `api/` (co-located with API calls)
5. Build components in `components/`
6. Create page-level routes in `routes/`
7. Wire everything together via custom hooks in `hooks/`

---

## 20. Project Setup Checklist

| Step | Action | Output |
|------|--------|--------|
| 1 | Initialize Vite + React 19 + TypeScript | `package.json`, base config |
| 2 | Install all dependencies | Updated `package.json` |
| 3 | Configure TypeScript (strict mode, paths) | `tsconfig.json`, `tsconfig.app.json` |
| 4 | Configure Vite (aliases, chunking) | `vite.config.ts` |
| 5 | Configure Tailwind CSS | `tailwind.config.ts`, `postcss.config.js` |
| 6 | Configure ESLint + Prettier | `.eslintrc.cjs`, `.prettierrc` |
| 7 | Create folder structure | `src/features/`, `src/shared/`, `src/app/` |
| 8 | Create all feature module directories | 11 feature directories with subdirectories |
| 9 | Set up shared API layer | `src/shared/api/` |
| 10 | Set up QueryClient | `src/shared/lib/query-client.ts` |
| 11 | Set up Zustand pattern | `src/shared/lib/` |
| 12 | Create Provider Tree | `src/shared/providers/AppProviders.tsx` |
| 13 | Create layouts | `src/shared/layouts/` |
| 14 | Create shared components | `src/shared/components/` |
| 15 | Set up routing | `src/app/router.tsx` |
| 16 | Create Error Boundary | `src/shared/components/ErrorBoundary.tsx` |
| 17 | Create environment module | `src/shared/lib/env.ts`, `.env.example` |
| 18 | Create utility functions | `src/shared/utils/cn.ts` |
| 19 | Set up npm scripts | `package.json` scripts |
| 20 | Add barrel exports | `index.ts` files |

---

## 21. Provider Tree Composition

```typescript
// src/shared/providers/AppProviders.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/shared/lib/query-client';
import { ErrorBoundary } from '@/shared/components';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/shared/providers';
import { router } from '@/app/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
```

---

## 22. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/shared/*": ["src/shared/*"],
      "@/features/*": ["src/features/*"],
      "@/app/*": ["src/app/*"],
      "@/assets/*": ["src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 23. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\"",
    "type-check": "tsc --noEmit"
  }
}
```
