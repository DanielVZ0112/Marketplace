# Módulo de Autenticación (Auth)

## 📁 Estructura del Módulo

El módulo de autenticación sigue la misma arquitectura hexagonal que los demás módulos:

```
auth/
├── application/
│   ├── dto/
│   │   └── login.dto.ts          # DTO para el login
│   └── login.usecase.ts          # Caso de uso para login
├── infrastructure/
│   ├── strategies/
│   │   ├── jwt.strategy.ts       # Estrategia JWT de Passport
│   │   └── local.strategy.ts     # Estrategia Local de Passport
│   ├── guards/
│   │   ├── jwt-auth.guard.ts     # Guard para proteger rutas con JWT
│   │   └── local-auth.guard.ts  # Guard para login local
│   └── decorators/
│       ├── public.decorator.ts   # Decorador para marcar rutas públicas
│       └── current-user.decorator.ts  # Decorador para obtener usuario actual
├── auth.controller.ts            # Controlador de autenticación
└── auth.module.ts                # Módulo de autenticación
```

## 🔐 ¿Por qué `@backend/src/modules/auth` y no `@backend/src/auth`?

**Respuesta:** La estructura recomendada en NestJS es mantener todos los módulos de dominio dentro de `src/modules/`, incluyendo el módulo de autenticación. Esto es lo más común y convencional porque:

1. **Consistencia**: Todos los módulos siguen la misma estructura
2. **Modularidad**: Cada módulo es independiente y puede ser fácilmente movido o reemplazado
3. **Escalabilidad**: Facilita el crecimiento del proyecto
4. **Convención**: Es la práctica estándar en proyectos NestJS

## 🚀 Funcionalidades

### 1. Login (`POST /auth/login`)
- Valida credenciales (email y password)
- Verifica que el usuario esté activo
- Genera un JWT token
- Retorna el token y datos del usuario

**Ejemplo de uso:**
```json
POST /auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  }
}
```

### 2. Perfil de Usuario (`GET /auth/profile`)
- Ruta protegida que requiere JWT
- Retorna los datos del usuario autenticado

**Ejemplo de uso:**
```bash
GET /auth/profile
Headers: Authorization: Bearer <token>
```

## 🛡️ Protección de Rutas

### Opción 1: Guard Global (Recomendado para APIs privadas)
En `app.module.ts`, descomenta el guard global:
```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
]
```

Con esto, **todas las rutas** estarán protegidas por defecto. Para marcar una ruta como pública, usa el decorador `@Public()`:

```typescript
@Controller('products')
export class ProductsController {
  @Public()  // Esta ruta es pública
  @Get()
  async findAll() {
    return this.listProductsUseCase.execute();
  }

  @Get(':id')  // Esta ruta requiere autenticación
  async findOne(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id);
  }
}
```

### Opción 2: Protección Manual por Ruta
Si prefieres proteger rutas manualmente, no uses el guard global y aplica el guard en cada controlador:

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)  // Protege todas las rutas del controlador
export class ProductsController {
  // ...
}
```

O en rutas específicas:
```typescript
@UseGuards(JwtAuthGuard)
@Get(':id')
async findOne(@Param('id') id: string) {
  // ...
}
```

## 📝 Decoradores Útiles

### `@Public()`
Marca una ruta como pública (no requiere autenticación):
```typescript
@Public()
@Get('public-route')
async publicRoute() {
  return { message: 'Esta ruta es pública' };
}
```

### `@CurrentUser()`
Obtiene el usuario autenticado en el controlador:
```typescript
@Get('my-profile')
async getMyProfile(@CurrentUser() user: any) {
  return user; // { userId: 1, email: 'usuario@example.com' }
}
```

## ⚙️ Configuración

### Variables de Entorno
Agrega estas variables a tu `.env`:

```env
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=1d  # Tiempo de expiración del token (1d, 1h, 30m, etc.)
```

### Importar el Módulo
El módulo ya está importado en `app.module.ts`. Si necesitas usar el JWT en otros módulos:

```typescript
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule],  // Importa JwtModule automáticamente
  // ...
})
```

## 🔄 Flujo de Autenticación

1. **Usuario hace login** → `POST /auth/login`
   - Se valida email y password
   - Se genera JWT token
   - Se retorna token al cliente

2. **Cliente hace petición protegida** → `GET /products/:id`
   - Cliente envía token en header: `Authorization: Bearer <token>`
   - `JwtAuthGuard` intercepta la petición
   - `JwtStrategy` valida el token
   - Si es válido, se inyecta el usuario en `request.user`
   - El controlador puede acceder al usuario con `@CurrentUser()`

3. **Si el token es inválido o expiró**:
   - Se retorna `401 Unauthorized`

## 📚 Recursos Adicionales

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](https://docs.nestjs.com/security/authentication#jwt-functionality)
- [Guards](https://docs.nestjs.com/guards)

