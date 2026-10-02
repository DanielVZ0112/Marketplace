export interface ErpCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface ErpProveedor {
  id: number;
  nombre: string;
  contacto: string | null;
  telefono: string | null;
  sitio_web: string | null;
}

export interface CreateErpCategoriaInput {
  nombre: string;
  descripcion?: string;
}

export interface CreateErpProveedorInput {
  nombre: string;
  contacto?: string;
  telefono?: string;
  sitio_web?: string;
}
