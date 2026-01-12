# 🏗️ Arquitectura del Proyecto

Este proyecto sigue los principios de **Arquitectura Hexagonal** (también conocida como Clean Architecture o Ports & Adapters), que separa la lógica de negocio de los detalles de implementación.

## 📐 Principios de Arquitectura

### Arquitectura Hexagonal

La arquitectura hexagonal divide la aplicación en **3 capas principales**:

1. **Domain (Dominio)** - Lógica de negocio pura, sin dependencias externas
2. **Application (Aplicación)** - Casos de uso y orquestación
3. **Infrastructure (Infraestructura)** - Implementaciones concretas (BD, HTTP, etc.)

```
┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
│  (Controllers, Repositories, External) │
├─────────────────────────────────────────┤
│         Application Layer               │
│      (Use Cases, DTOs, Services)        │
├─────────────────────────────────────────┤
│           Domain Layer                  │
│    (Entities, Interfaces, Business)    │
└─────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── modules/                    # Módulos de dominio
│   │   ├── products/              # Módulo de productos
│   │   │   ├── domain/            # Capa de dominio
│   │   │   │   ├── product.repository.ts      # Interface del repositorio
│   │   │   │   └── product-filters.interface.ts # Interfaces de dominio
│   │   │   ├── application/       # Capa de aplicación
│   │   │   │   ├── create-product.usecase.ts  # Casos de uso
│   │   │   │   ├── list-products.usecase.ts
│   │   │   │   └── dto/           # Data Transfer Objects
│   │   │   │       ├── create-product.dto.ts
│   │   │   │       └── filter-products.dto.ts
│   │   │   └── infrastructure/    # Capa de infraestructura
│   │   │       ├── products.controller.ts     # Controlador HTTP
│   │   │       └── product.typeorm.repository.ts # Implementación BD
│   │   ├── orders/                # Módulo de órdenes
│   │   ├── payments/              # Módulo de pagos
│   │   ├── auth/                  # Módulo de autenticación
│   │   └── ...
│   ├── database/                   # Base de datos
│   │   ├── entities/              # Entidades TypeORM
│   │   ├── migrations/            # Migraciones
│   │   └── seeders/               # Datos iniciales
│   ├── common/                    # Utilidades compartidas
│   │   ├── http/                  # Clases de respuesta HTTP
│   │   ├── filters/               # Filtros globales (excepciones)
│   │   └── interfaces/            # Interfaces compartidas
│   ├── app.module.ts              # Módulo raíz
│   └── main.ts                    # Punto de entrada
└── docs/                          # Documentación
```

## 🔄 Flujo de Datos

### Ejemplo: Crear un Producto

```
1. HTTP Request
   ↓
2. Controller (Infrastructure)
   ├── Valida formato HTTP
   ├── Convierte DTO a dominio
   └── Llama al Use Case
   ↓
3. Use Case (Application)
   ├── Valida reglas de negocio
   ├── Llama al Repository (interface)
   └── Retorna resultado
   ↓
4. Repository Implementation (Infrastructure)
   ├── Implementa la interface del dominio
   ├── Interactúa con TypeORM
   └── Persiste en PostgreSQL
   ↓
5. Response
   └── Retorna al cliente
```

## 🎯 Capas en Detalle

### 1. Domain Layer (Dominio)

**Responsabilidades:**
- Define las interfaces y contratos
- Contiene la lógica de negocio pura
- **NO** tiene dependencias externas
- Define las entidades del dominio

**Ejemplo:**
```typescript
// domain/product.repository.ts
export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
```

### 2. Application Layer (Aplicación)

**Responsabilidades:**
- Implementa los casos de uso
- Orquesta las operaciones
- Valida reglas de negocio
- Convierte entre DTOs y entidades de dominio

**Ejemplo:**
```typescript
// application/create-product.usecase.ts
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productData: CreateProductDto): Promise<Product> {
    // Lógica de negocio
    const product = this.productRepository.create(productData);
    return product;
  }
}
```

### 3. Infrastructure Layer (Infraestructura)

**Responsabilidades:**
- Implementa las interfaces del dominio
- Maneja detalles técnicos (HTTP, BD, etc.)
- Controllers para endpoints REST
- Repositorios concretos (TypeORM)

**Ejemplo:**
```typescript
// infrastructure/product.typeorm.repository.ts
@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly typeOrmRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    return await this.typeOrmRepository.save(product);
  }
}
```

## 🔌 Inversión de Dependencias

La arquitectura usa **Dependency Injection** para invertir las dependencias:

```typescript
// Domain define la interface
export interface ProductRepository { ... }

// Application depende de la interface (no de la implementación)
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)  // ← Inyección por símbolo
    private readonly productRepository: ProductRepository, // ← Interface
  ) {}
}

// Infrastructure implementa la interface
@Injectable()
export class ProductTypeOrmRepository implements ProductRepository { ... }

// Module conecta todo
@Module({
  providers: [
    {
      provide: PRODUCT_REPOSITORY,  // ← Símbolo
      useClass: ProductTypeOrmRepository, // ← Implementación
    },
  ],
})
```

## 📦 Módulos del Sistema

### Módulos Principales

1. **Products** - Gestión de productos y catálogo
2. **Categories** - Categorización de productos
3. **Orders** - Gestión de órdenes de compra
4. **Payments** - Procesamiento de pagos
5. **Customers** - Información de clientes
6. **Users** - Usuarios del sistema
7. **Auth** - Autenticación y autorización
8. **Product Variants** - Variantes de productos (tallas, colores)

### Comunicación entre Módulos

Los módulos se comunican a través de:
- **Use Cases** - Llamadas directas entre casos de uso
- **Repositories** - Acceso a datos compartidos
- **Events** - Eventos del sistema (futuro)

## 🎨 Patrones Utilizados

### Repository Pattern
- Abstrae el acceso a datos
- Permite cambiar la implementación sin afectar el dominio

### Use Case Pattern
- Un caso de uso = una operación de negocio
- Encapsula la lógica de negocio

### DTO Pattern
- Data Transfer Objects para validación
- Separación entre capas

### Dependency Injection
- Inversión de dependencias
- Facilita testing y mantenimiento

## 🧪 Testing

La arquitectura facilita el testing:

```typescript
// Mock del repository para tests
const mockRepository: ProductRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
};

// Test del use case sin dependencias reales
const useCase = new CreateProductUseCase(mockRepository);
```

## 📚 Ventajas de esta Arquitectura

✅ **Testeable** - Fácil crear mocks y tests
✅ **Mantenible** - Separación clara de responsabilidades
✅ **Escalable** - Fácil agregar nuevas features
✅ **Flexible** - Cambiar implementaciones sin afectar dominio
✅ **Independiente** - El dominio no depende de frameworks

## 🔗 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [NestJS Documentation](https://docs.nestjs.com/)
