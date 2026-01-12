# 🔐 Sistema de Autenticación

El Marketplace Backend utiliza **JWT (JSON Web Tokens)** para autenticación, con la característica especial de que el login es **opcional** para realizar compras (Guest Checkout).

## 🎯 Características

- ✅ **Autenticación JWT** - Tokens seguros y stateless
- ✅ **Login Opcional** - Las compras pueden realizarse sin autenticación
- ✅ **Rutas Públicas** - Marcadas con decorador `@Public()`
- ✅ **Rutas Protegidas** - Requieren token JWT válido
- ✅ **Guards Globales** - Protección automática de rutas

## 🔑 Flujo de Autenticación

### 1. Login (Obtener Token)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "is_active": true
    }
  }
}
```

### 2. Usar Token en Peticiones

Incluye el token en el header `Authorization`:

```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ Rutas Públicas vs Protegidas

### Rutas Públicas (No requieren token)

Estas rutas están marcadas con el decorador `@Public()`:

```typescript
@Public()
@Get()
async findAll() { ... }
```

**Rutas públicas disponibles:**
- `POST /api/auth/login` - Login
- `POST /api/users` - Registro de usuario
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Ver producto
- `GET /api/categories` - Listar categorías
- `POST /api/customers` - Crear cliente (Guest)
- `POST /api/orders` - Crear orden (Guest)
- `POST /api/payments` - Crear pago (Guest)
- `POST /api/payments/process` - Procesar pago (Guest)

### Rutas Protegidas (Requieren token)

Todas las demás rutas requieren autenticación:

```typescript
@Get()
async findAll() {  // ← Requiere token por defecto
  // ...
}
```

**Rutas protegidas:**
- `GET /api/auth/profile` - Perfil del usuario
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `GET /api/orders` - Listar órdenes del usuario
- `GET /api/orders/:id` - Ver orden
- Y todas las demás operaciones de escritura

## 🔧 Configuración

### Variables de Entorno

```env
JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
JWT_EXPIRES_IN=1d
```

**⚠️ Importante:**
- `JWT_SECRET` debe ser una cadena segura y aleatoria
- En producción, usa al menos 32 caracteres
- No compartas este secreto públicamente

### Estructura del Token

El token JWT contiene:

```json
{
  "sub": 1,              // User ID
  "email": "user@example.com",
  "iat": 1234567890,    // Issued at
  "exp": 1234654290      // Expiration
}
```

## 🛒 Guest Checkout (Compra sin Login)

El sistema permite realizar compras **sin autenticación**:

### Flujo sin Login:

```
1. POST /api/customers     → Crear cliente (Guest)
2. POST /api/orders        → Crear orden
3. POST /api/payments      → Crear pago
4. POST /api/payments/process → Procesar pago
```

**Ventajas:**
- ✅ Experiencia más rápida para el usuario
- ✅ Menos fricción en el proceso de compra
- ✅ No requiere registro obligatorio

### Flujo con Login:

```
1. POST /api/auth/login    → Obtener token
2. GET /api/auth/profile   → Obtener datos del usuario
3. POST /api/orders        → Crear orden (con user_id)
4. GET /api/orders          → Ver historial de órdenes
```

**Ventajas:**
- ✅ Historial de compras
- ✅ Recuperación de datos automática
- ✅ Mejor experiencia para usuarios recurrentes

## 🔒 Implementación Técnica

### Guard Global

Todas las rutas están protegidas por defecto:

```typescript
// app.module.ts
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,  // ← Guard global
  },
]
```

### Decorador @Public()

Para marcar rutas como públicas:

```typescript
import { Public } from '../auth/infrastructure/decorators/public.decorator';

@Controller('products')
export class ProductsController {
  @Public()  // ← Esta ruta es pública
  @Get()
  async findAll() { ... }
}
```

### Estrategia JWT

```typescript
// auth/infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Login y Obtener Perfil

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Respuesta contiene access_token

# 2. Usar token para obtener perfil
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### Ejemplo 2: Compra sin Login (Guest)

```bash
# 1. Crear cliente
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+1234567890"
  }'

# 2. Crear orden (sin token)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "items": [...]
  }'
```

### Ejemplo 3: Compra con Login

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' \
  | jq -r '.data.access_token')

# 2. Crear orden (con token)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [...]
  }'
```

## ⚠️ Manejo de Errores

### Token Inválido o Expirado

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Token No Proporcionado

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Credenciales Incorrectas

```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "data": null
}
```

## 🔐 Seguridad

### Buenas Prácticas

1. **Nunca expongas JWT_SECRET** - Manténlo en variables de entorno
2. **Usa HTTPS en producción** - Los tokens viajan en headers
3. **Expiración de tokens** - Configura `JWT_EXPIRES_IN` apropiadamente
4. **Validación de contraseñas** - Usa bcrypt para hashing
5. **Rate limiting** - Implementa límites en endpoints de login

### Configuración Recomendada

```env
# Desarrollo
JWT_EXPIRES_IN=1d

# Producción
JWT_EXPIRES_IN=15m  # Tokens más cortos
# + Implementar refresh tokens
```

## 📚 Referencias

- [JWT.io](https://jwt.io/) - Documentación de JWT
- [NestJS Authentication](https://docs.nestjs.com/security/authentication) - Guía oficial
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/) - Estrategia JWT
