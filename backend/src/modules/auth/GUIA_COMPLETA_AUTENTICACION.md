# 🔐 Guía Completa: Guards, Estrategias y Decoradores

## 📚 Conceptos Fundamentales

### 1. **ESTRATEGIAS (Strategies)** 🎯
Las estrategias son las **reglas de autenticación** que definen **CÓMO** validar las credenciales.

#### `LocalStrategy` (Email + Password)
- **Cuándo se usa**: Al hacer **LOGIN** (primera vez que el usuario se autentica)
- **Qué hace**: Valida email y password contra la base de datos
- **Dónde se ejecuta**: En el endpoint `/auth/login`

```typescript
// LocalStrategy valida:
1. Busca usuario por email
2. Compara password con bcrypt
3. Verifica que esté activo
4. Retorna datos del usuario si es válido
```

#### `JwtStrategy` (Token JWT)
- **Cuándo se usa**: En **TODAS las peticiones protegidas** después del login
- **Qué hace**: Valida el token JWT que viene en el header `Authorization: Bearer <token>`
- **Dónde se ejecuta**: En todas las rutas protegidas (excepto las marcadas con `@Public()`)

```typescript
// JwtStrategy valida:
1. Extrae el token del header Authorization
2. Verifica que el token sea válido y no haya expirado
3. Busca el usuario en la BD usando el ID del token
4. Verifica que el usuario esté activo
5. Retorna datos del usuario si es válido
```

---

### 2. **GUARDS** 🛡️
Los guards son los **"porteros"** que deciden si una petición puede pasar o no.

#### `LocalAuthGuard`
- **Extiende**: `AuthGuard('local')`
- **Usa**: `LocalStrategy`
- **Cuándo usar**: **SOLO en el endpoint de login** (`POST /auth/login`)
- **Qué hace**: Activa la `LocalStrategy` para validar email/password

```typescript
@UseGuards(LocalAuthGuard)  // ← Activa LocalStrategy
@Post('login')
async login(@Body() loginData: LoginDto) {
  // LocalStrategy ya validó las credenciales
  // request.user ya tiene los datos del usuario
  return this.loginUseCase.execute(loginData);
}
```

#### `JwtAuthGuard`
- **Extiende**: `AuthGuard('jwt')`
- **Usa**: `JwtStrategy`
- **Cuándo usar**: En **TODAS las rutas protegidas** (excepto login)
- **Qué hace**: 
  1. Verifica si la ruta es pública (`@Public()`)
  2. Si no es pública, activa `JwtStrategy` para validar el token
  3. Si el token es válido, permite el acceso

```typescript
@UseGuards(JwtAuthGuard)  // ← Activa JwtStrategy
@Get('profile')
getProfile(@CurrentUser() user: any) {
  // JwtStrategy ya validó el token
  // request.user ya tiene los datos del usuario
  return user;
}
```

---

### 3. **DECORADORES** 🎨
Los decoradores son **"etiquetas"** que modifican el comportamiento de las rutas.

#### `@Public()`
- **Qué hace**: Marca una ruta como **pública** (no requiere autenticación)
- **Cuándo usar**: En rutas que cualquiera puede acceder (login, registro, productos públicos, etc.)

```typescript
@Public()  // ← Esta ruta NO requiere token
@Get('products')
async findAll() {
  return this.listProductsUseCase.execute();
}
```

#### `@CurrentUser()`
- **Qué hace**: Extrae el usuario autenticado del `request.user`
- **Cuándo usar**: Cuando necesitas los datos del usuario en el controlador

```typescript
@Get('my-orders')
async getMyOrders(@CurrentUser() user: any) {
  // user = { userId: 1, email: 'usuario@example.com' }
  return this.getOrdersByUserUseCase.execute(user.userId);
}
```

---

## 🔄 Flujo Completo de Autenticación

### **PASO 1: Usuario hace LOGIN** 🔑

```
Cliente → POST /auth/login
         Body: { email: "user@example.com", password: "123456" }
```

**Flujo interno:**

```
1. Cliente envía petición POST /auth/login
   ↓
2. NestJS intercepta la petición
   ↓
3. @UseGuards(LocalAuthGuard) se activa
   ↓
4. LocalAuthGuard activa LocalStrategy
   ↓
5. LocalStrategy.validate(email, password):
   - Busca usuario por email en BD
   - Compara password con bcrypt
   - Verifica que esté activo
   - Si es válido → retorna { userId, email }
   - Si no es válido → lanza UnauthorizedException
   ↓
6. LocalStrategy guarda el resultado en request.user
   ↓
7. El controlador ejecuta loginUseCase.execute()
   ↓
8. LoginUseCase genera el JWT token
   ↓
9. Retorna al cliente:
   {
     access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     user: { id: 1, email: "user@example.com" }
   }
```

---

### **PASO 2: Usuario hace petición protegida** 🔒

```
Cliente → GET /auth/profile
         Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Flujo interno:**

```
1. Cliente envía petición GET /auth/profile con token
   ↓
2. NestJS intercepta la petición
   ↓
3. JwtAuthGuard (GLOBAL) se activa automáticamente
   ↓
4. JwtAuthGuard verifica si la ruta tiene @Public()
   - Si tiene @Public() → permite el acceso sin validar token
   - Si NO tiene @Public() → continúa con la validación
   ↓
5. JwtAuthGuard activa JwtStrategy
   ↓
6. JwtStrategy.validate(payload):
   - Extrae el token del header Authorization
   - Verifica la firma del token con JWT_SECRET
   - Verifica que no haya expirado
   - Extrae el payload: { sub: 1, email: "user@example.com" }
   - Busca el usuario en BD usando payload.sub (user ID)
   - Verifica que el usuario esté activo
   - Si es válido → retorna { userId, email }
   - Si no es válido → lanza UnauthorizedException
   ↓
7. JwtStrategy guarda el resultado en request.user
   ↓
8. El controlador ejecuta y puede usar @CurrentUser()
   ↓
9. Retorna los datos al cliente
```

---

## 🎯 Cuándo Usar Cada Guard

### **LocalAuthGuard** 📝
**ÚSALO SOLO EN:**
- `POST /auth/login` (endpoint de login)

**NO LO USES EN:**
- ❌ Rutas protegidas
- ❌ Rutas que requieren token
- ❌ Cualquier otra ruta

**Ejemplo:**
```typescript
@Controller('auth')
export class AuthController {
  @Public()
  @UseGuards(LocalAuthGuard)  // ← SOLO aquí
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.loginUseCase.execute(loginData);
  }
}
```

### **JwtAuthGuard** 🔐
**ÚSALO EN:**
- ✅ Todas las rutas protegidas (ya está como guard global)
- ✅ Rutas que requieren autenticación
- ✅ Rutas donde necesitas saber quién es el usuario

**NO LO USES EN:**
- ❌ Rutas públicas (usa `@Public()` en su lugar)
- ❌ El endpoint de login (usa `LocalAuthGuard`)

**Ejemplo:**
```typescript
@Controller('orders')
export class OrdersController {
  @Public()  // ← Ruta pública, no requiere token
  @Get()
  async findAll() {
    return this.listOrdersUseCase.execute();
  }

  @Get('my-orders')  // ← Ruta protegida (JwtAuthGuard global se activa)
  async getMyOrders(@CurrentUser() user: any) {
    return this.getOrdersByUserUseCase.execute(user.userId);
  }
}
```

---

## ⚙️ Configuración del .env

Tu archivo `.env` actual:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Vasco_0112
DB_NAME=marketplace_db
PORT=3000
```

**FALTA AGREGAR:**
```env
# JWT Configuration
JWT_SECRET=tu-clave-secreta-super-segura-y-larga-minimo-32-caracteres
JWT_EXPIRES_IN=1d
```

**Explicación:**
- **JWT_SECRET**: Clave secreta para firmar y verificar los tokens JWT. **DEBE SER SEGURA Y ÚNICA**
- **JWT_EXPIRES_IN**: Tiempo de expiración del token. Formatos válidos:
  - `1d` = 1 día
  - `1h` = 1 hora
  - `30m` = 30 minutos
  - `7d` = 7 días

**Ejemplo completo:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Vasco_0112
DB_NAME=marketplace_db
PORT=3000

# JWT Configuration
JWT_SECRET=mi-clave-secreta-super-segura-12345678901234567890
JWT_EXPIRES_IN=1d
```

---

## 📊 Diagrama Visual del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   CLIENTE    │
└──────┬───────┘
       │
       │ 1. POST /auth/login
       │    { email, password }
       ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthController.login()                                     │
│  @Public()                                                   │
│  @UseGuards(LocalAuthGuard) ←──────────────────────────────┐ │
└──────┬────────────────────────────────────────────────────┘ │
       │                                                        │
       │ 2. LocalAuthGuard activa                              │
       ▼                                                        │
┌─────────────────────────────────────────────────────────────┐│
│  LocalStrategy.validate(email, password)                    ││
│  - Busca usuario en BD                                      ││
│  - Compara password                                          ││
│  - Retorna { userId, email }                                 ││
└──────┬────────────────────────────────────────────────────┘│
       │                                                        │
       │ 3. request.user = { userId, email }                   │
       ▼                                                        │
┌─────────────────────────────────────────────────────────────┐│
│  LoginUseCase.execute()                                     ││
│  - Genera JWT token                                         ││
│  - Retorna { access_token, user }                           ││
└──────┬────────────────────────────────────────────────────┘│
       │                                                        │
       │ 4. Cliente recibe token                               │
       ▼                                                        │
┌──────────────┐                                               │
│   CLIENTE    │                                               │
│  Guarda token│                                               │
└──────┬───────┘                                               │
       │                                                        │
       │ 5. GET /auth/profile                                  │
       │    Authorization: Bearer <token>                      │
       ▼                                                        │
┌─────────────────────────────────────────────────────────────┐│
│  JwtAuthGuard (GLOBAL) se activa automáticamente          ││
│  - Verifica @Public()? No → continúa                        ││
└──────┬────────────────────────────────────────────────────┘│
       │                                                        │
       │ 6. JwtAuthGuard activa                                │
       ▼                                                        │
┌─────────────────────────────────────────────────────────────┐│
│  JwtStrategy.validate(payload)                              ││
│  - Extrae token del header                                  ││
│  - Verifica firma y expiración                              ││
│  - Busca usuario en BD                                      ││
│  - Retorna { userId, email }                                ││
└──────┬────────────────────────────────────────────────────┘│
       │                                                        │
       │ 7. request.user = { userId, email }                   │
       ▼                                                        │
┌─────────────────────────────────────────────────────────────┐│
│  AuthController.getProfile()                                ││
│  @CurrentUser() user ← Extrae request.user                  ││
│  - Retorna datos del usuario                                ││
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 Resumen Rápido

| Componente | Propósito | Cuándo Usar |
|------------|-----------|-------------|
| **LocalStrategy** | Valida email/password | Solo en login |
| **JwtStrategy** | Valida token JWT | En todas las rutas protegidas |
| **LocalAuthGuard** | Activa LocalStrategy | Solo en `POST /auth/login` |
| **JwtAuthGuard** | Activa JwtStrategy | En todas las rutas protegidas (ya es global) |
| **@Public()** | Marca ruta como pública | En rutas que no requieren autenticación |
| **@CurrentUser()** | Extrae usuario del request | Cuando necesitas datos del usuario |

---

## ✅ Checklist de Configuración

- [x] Instalar dependencias (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `passport-local`)
- [x] Crear `LocalStrategy` y `JwtStrategy`
- [x] Crear `LocalAuthGuard` y `JwtAuthGuard`
- [x] Crear decoradores `@Public()` y `@CurrentUser()`
- [x] Configurar `JwtModule` en `AuthModule`
- [x] Configurar guard global en `AppModule`
- [ ] **AGREGAR `JWT_SECRET` y `JWT_EXPIRES_IN` al `.env`** ⚠️

---

## 🚨 Errores Comunes

### Error 1: Usar LocalAuthGuard en rutas protegidas
```typescript
// ❌ MAL
@UseGuards(LocalAuthGuard)
@Get('profile')
async getProfile() { ... }

// ✅ BIEN
@UseGuards(JwtAuthGuard)  // o simplemente sin guard (ya es global)
@Get('profile')
async getProfile() { ... }
```

### Error 2: Olvidar @Public() en rutas públicas
```typescript
// ❌ MAL - Intentará validar token aunque no sea necesario
@Get('products')
async findAll() { ... }

// ✅ BIEN
@Public()
@Get('products')
async findAll() { ... }
```

### Error 3: No configurar JWT_SECRET
```env
# ❌ MAL - Usará el valor por defecto inseguro
# (no hay JWT_SECRET)

# ✅ BIEN
JWT_SECRET=tu-clave-secreta-super-segura-12345678901234567890
```

---

¡Ahora ya entiendes todo el flujo! 🎉

