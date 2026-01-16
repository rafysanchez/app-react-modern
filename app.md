# Prompt: Aplicativo de Gerenciamento de Produtos em React 18

## Objetivo

Criar um aplicativo web de gerenciamento de produtos em React 18 com TypeScript, autenticação JWT, CRUD completo, validação de formulários e layout responsivo, seguindo padrões profissionais.

## Stack Tecnológico

```json
{
  "frontend": "React 18 + TypeScript",
  "build": "Vite",
  "routing": "React Router v6",
  "http": "Axios",
  "state": "Hooks (useState, useEffect, useContext) + Context API",
  "forms": "React Hook Form + Zod",
  "styling": "CSS Modules ou Tailwind CSS",
  "backend": "JSON Server (mock)"
}
```

## Estrutura de Pastas

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── LoginForm.tsx
│   ├── shared/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ProductModal.tsx
│   ├── products/
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── ProductTable.tsx
│   └── layout/
│       └── AppLayout.tsx
├── services/
│   ├── api/
│   │   └── apiClient.ts
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── notification.service.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useNotification.ts
│   └── useForm.ts
├── context/
│   ├── AuthContext.tsx
│   ├── NotificationContext.tsx
│   └── AppContext.tsx
├── types/
│   ├── auth.types.ts
│   ├── product.types.ts
│   └── api.types.ts
├── utils/
│   ├── jwt.utils.ts
│   └── validation.ts
├── interceptors/
│   ├── jwtInterceptor.ts
│   └── errorInterceptor.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

## Autenticação

### AuthService

- Integrar com endpoint `/api/auth/login` (POST)
- Aceitar email e senha
- Retornar `{ accessToken, refreshToken, expiresIn }`
- Armazenar tokens em localStorage
- Decodificar JWT para extrair dados do usuário (id, email, username, role)
- Suportar refresh token automático em 401
- Auto-logout após 15 minutos de inatividade

### JWT Interceptor

- Adicionar header `Authorization: Bearer {token}` em todas as requisições
- Interceptar resposta 401
- Executar refresh token automaticamente
- Fazer logout se refresh falhar

### Credentials de Teste

```
Email: user@example.com
Password: password123
```

### Role-Based Access

- Suportar roles: 'admin' e 'user'
- Guard de rotas por role

## Tipos (TypeScript)

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  inventory: number;
  status: "active" | "draft" | "archived";
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

## Componentes Principais

### LoginPage

- Card centralizado com gradient background
- Campos: Email e Senha
- Validação em tempo real
- Feedback de loading no botão
- Mensagens de erro inline
- Autocomplete para email/senha
- Redirecionar para /products após login

### AppLayout

```
Header: Logo + Título + User Email + Logout Button
├── Sidebar: Menu navegação (250px, colapsível)
│   ├─ Dashboard (📊)
│   ├─ Products (📦)
│   ├─ Customers (👥)
│   ├─ Orders (📋)
│   ├─ Reports (📈)
│   └─ Users (👤 - admin only)
├── Main: router-outlet para conteúdo
└── Footer: Copyright
```

### ProductsPage

- Header com título, busca (debounced 300ms) e botão "+ Add Product"
- Tabela com colunas: Name | SKU | Category | Status | Price | Stock | Actions
- Status com badges (active=verde, draft=amarelo, archived=cinza)
- Ações: Editar (✎) e Deletar (🗑)
- Paginação
- Loading state: "Loading products..."
- Empty state: "No products found" com botão de criar

### ProductModal (Create/Edit)

Campos:

- Product Name\* (texto, obrigatório)
- SKU\* (texto, obrigatório)
- Category\* (select, obrigatório)
- Status\* (select: active/draft/archived)
- Price\* (número > 0, obrigatório)
- Stock\* (número >= 0, obrigatório)
- Description (textarea, opcional, max 500 chars)

Validações com Zod:

```typescript
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "draft", "archived"]),
  price: z.number().positive("Price must be greater than 0"),
  inventory: z.number().nonnegative("Stock cannot be negative"),
  description: z.string().max(500).optional(),
});
```

### ConfirmDialog

- Backdrop semi-transparente
- Mensagem de confirmação
- Botões: Cancelar | Confirmar
- Loading state no botão confirmar
- Para confirmação de deleção

### Toast Notifications

- Tipo: 'success' | 'error' | 'warning' | 'info'
- Auto-dismiss (4-5 segundos)
- Múltiplas notificações na fila
- Animação suave
- Ícones visuais por tipo

## Services

### AuthService

```typescript
async login(email: string, password: string): Promise<void>
async logout(): Promise<void>
async refreshAccessToken(): Promise<void>
getAccessToken(): string | null
isAuthenticated(): boolean
getCurrentUser(): User | null
```

### ProductService

```typescript
async getAll(page: number = 1, limit: number = 10): Promise<void>
async getById(id: number): Promise<Product | null>
async create(product: Omit<Product, 'id'>): Promise<Product | null>
async update(id: number, product: Partial<Product>): Promise<Product | null>
async delete(id: number): Promise<boolean>
async search(query: string): Promise<Product[]>
```

## Custom Hooks

### useAuth

```typescript
{
  isAuthenticated: boolean;
  currentUser: User | null;
  username: string | null;
  userEmail: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}
```

### useProducts

```typescript
{
  products: Product[]
  loading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  total: number
  hasNextPage: boolean
  getAll: (page, limit) => Promise<void>
  getById: (id) => Promise<Product | null>
  create: (product) => Promise<Product | null>
  update: (id, product) => Promise<Product | null>
  deleteProduct: (id) => Promise<boolean>
  search: (query) => Promise<Product[]>
}
```

### useNotification

```typescript
{
  notifications: Toast[]
  success: (message) => void
  error: (message) => void
  warning: (message) => void
  info: (message) => void
  remove: (id) => void
}
```

## Rotas (React Router v6)

```typescript
/ → /login (redirect)
/login → LoginPage (public route)
/products → AppLayout
  ├─ /products → ProductsPage
  └─ /products/:id → ProductDetailPage
```

## API Endpoints (JSON Server)

```
GET    /api/products              → Listar todos
GET    /api/products?q=search     → Buscar
GET    /api/products/{id}         → Detalhes
POST   /api/products              → Criar
PUT    /api/products/{id}         → Atualizar
DELETE /api/products/{id}         → Deletar
POST   /api/auth/login            → Login
POST   /api/auth/refresh          → Refresh token
```

## Database Mock (db.json)

```json
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "sku": "PROD-001",
      "category": "Electronics",
      "price": 999.99,
      "inventory": 10,
      "status": "active",
      "description": "High-performance laptop",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Mouse",
      "sku": "PROD-002",
      "category": "Electronics",
      "price": 29.99,
      "inventory": 50,
      "status": "active",
      "description": "Wireless mouse"
    },
    {
      "id": 3,
      "name": "Keyboard",
      "sku": "PROD-003",
      "category": "Electronics",
      "price": 79.99,
      "inventory": 30,
      "status": "draft",
      "description": "Mechanical keyboard"
    }
  ]
}
```

## Features Obrigatórias

✅ Login com Email/Senha + JWT  
✅ Auto-logout após 15 minutos de inatividade  
✅ Refresh token automático  
✅ CRUD de produtos (Create, Read, Update, Delete)  
✅ Busca de produtos (debounced)  
✅ Paginação  
✅ Validação de formulários com mensagens de erro  
✅ Modal para criar/editar produtos  
✅ Confirmação antes de deletar  
✅ Toast notifications (success, error, warning, info)  
✅ Sidebar colapsível  
✅ Responsivo (desktop, tablet, mobile)  
✅ Route guards (autenticação)  
✅ TypeScript em todo código  
✅ Tratamento de erros HTTP  
✅ Loading states  
✅ Empty states

## Responsividade

- Desktop (≥1024px): Layout completo
- Tablet (640px-1023px): Sidebar drawer, tabela com scroll
- Mobile (<640px): Full-width, menu hambúrguer, cards empilhados

## Estilos

Usar CSS Modules ou Tailwind. Design system:

- Cores: Primary #3b82f6, Success #10b981, Error #ef4444, Warning #f59e0b
- Tipografia: Sistema sans-serif, responsive
- Espaçamento: Grid 4px
- Border-radius: 6px
- Sombras suaves

## Dependências Recomendadas

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.2",
    "@hookform/resolvers": "^3.1.1"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^4.4.0"
  }
}
```

## Setup

```bash
npm create vite@latest modern-products-app -- --template react-ts
cd modern-products-app
npm install
npm install react-router-dom axios react-hook-form zod @hookform/resolvers
npm install --save-dev json-server concurrently

# package.json scripts
{
  "start": "concurrently \"vite\" \"json-server --watch db.json --port 3000\"",
  "dev": "vite",
  "server": "json-server --watch db.json --port 3000",
  "build": "tsc && vite build"
}

npm run start
```

## Padrões Importantes

1. **Componentes**: Todos funcionais com hooks
2. **State**: useState para state local, Context para global
3. **Async**: async/await, não promises chaining
4. **Tipos**: Tudo tipado com TypeScript (sem any)
5. **Validação**: Zod para schemas
6. **Erros**: Try/catch com feedback ao usuário
7. **Loading**: Sempre mostrar estado de carregamento
8. **URLs**: Usar variáveis de ambiente para API_URL
9. **Segurança**: JWT em localStorage, não em cookies
10. **Performance**: Debounce em busca, lazy loading de rotas

## Checklist de Implementação

- [ ] Projeto Vite criado
- [ ] Dependências instaladas
- [ ] TypeScript configurado
- [ ] AuthContext e useAuth implementados
- [ ] Login page funcional
- [ ] JWT interceptor funcionando
- [ ] Route guards implementados
- [ ] AppLayout com header/sidebar/footer
- [ ] ProductsPage com tabela
- [ ] ProductService e useProducts
- [ ] ProductModal com validação
- [ ] ConfirmDialog para delete
- [ ] Toast notifications
- [ ] Todos os CRUD operations
- [ ] Responsividade testada
- [ ] Tratamento de erros completo
- [ ] Teste manual no navegador

---

**Este prompt contém todas as especificações necessárias para gerar o aplicativo React em sua totalidade.**
