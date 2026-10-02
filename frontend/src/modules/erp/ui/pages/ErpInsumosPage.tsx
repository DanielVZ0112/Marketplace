import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateCategoria,
  useCreateProveedor,
  useGetCategorias,
  useGetProveedores,
} from "../../application/useCatalogoErp";
import { useCreateInsumo, useGetInsumos, useUpdateInsumo } from "../../application/useInsumosErp";
import type { InsumoErp, InsumoErpInput, UnidadMedida } from "../../domain/InsumoErp";
import { getApiErrorMessage } from "../../infrastructure/ErpApiRepository";
import { UNIDAD_LABEL, formatCop } from "../format";

const UNIDADES: UnidadMedida[] = ["ml", "hoja", "unidad", "uso"];

const EMPTY_FORM: InsumoErpInput = {
  nombre: "",
  unidad_medida: "unidad",
  costo_unitario: 0,
  stock_actual: 0,
  stock_minimo: 0,
  categoria_id: 0,
  proveedor_id: null,
};

export function ErpInsumosPage() {
  const insumosQuery = useGetInsumos();
  const categoriasQuery = useGetCategorias();
  const proveedoresQuery = useGetProveedores();
  const createInsumo = useCreateInsumo();
  const updateInsumo = useUpdateInsumo();
  const createCategoria = useCreateCategoria();
  const createProveedor = useCreateProveedor();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InsumoErp | null>(null);
  const [form, setForm] = useState<InsumoErpInput>(EMPTY_FORM);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoProveedor, setNuevoProveedor] = useState("");
  const [error, setError] = useState("");

  const categorias = categoriasQuery.data ?? [];
  const proveedores = proveedoresQuery.data ?? [];

  const categoriaInicial = () =>
    categorias.find((categoria) => categoria.nombre === "General")?.id ??
    categorias[0]?.id ??
    0;

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, categoria_id: categoriaInicial() });
    setNuevaCategoria("");
    setNuevoProveedor("");
    setError("");
    setOpen(true);
  };

  const openEdit = (insumo: InsumoErp) => {
    setEditing(insumo);
    setForm({
      nombre: insumo.nombre,
      unidad_medida: insumo.unidad_medida,
      costo_unitario: Number(insumo.costo_unitario),
      stock_actual: Number(insumo.stock_actual),
      stock_minimo: Number(insumo.stock_minimo),
      categoria_id: insumo.categoria_id,
      proveedor_id: insumo.proveedor_id,
    });
    setNuevaCategoria("");
    setNuevoProveedor("");
    setError("");
    setOpen(true);
  };

  const crearCategoria = () => {
    const nombre = nuevaCategoria.trim();
    if (!nombre) {
      return;
    }
    createCategoria.mutate(
      { nombre },
      {
        onSuccess: (categoria) => {
          setForm((current) => ({ ...current, categoria_id: categoria.id }));
          setNuevaCategoria("");
        },
        onError: (mutationError) => {
          setError(getApiErrorMessage(mutationError, "No se pudo crear la categoría"));
        },
      },
    );
  };

  const crearProveedor = () => {
    const nombre = nuevoProveedor.trim();
    if (!nombre) {
      return;
    }
    createProveedor.mutate(
      { nombre },
      {
        onSuccess: (proveedor) => {
          setForm((current) => ({ ...current, proveedor_id: proveedor.id }));
          setNuevoProveedor("");
        },
        onError: (mutationError) => {
          setError(getApiErrorMessage(mutationError, "No se pudo crear el proveedor"));
        },
      },
    );
  };

  const save = () => {
    const payload: InsumoErpInput = {
      nombre: form.nombre.trim(),
      unidad_medida: form.unidad_medida,
      costo_unitario: Number(form.costo_unitario),
      stock_actual: Number(form.stock_actual),
      stock_minimo: Number(form.stock_minimo),
      categoria_id: Number(form.categoria_id),
      proveedor_id: form.proveedor_id ? Number(form.proveedor_id) : null,
    };
    const onError = (mutationError: unknown) => {
      setError(getApiErrorMessage(mutationError, "No se pudo guardar el insumo"));
    };
    if (editing) {
      updateInsumo.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => setOpen(false), onError },
      );
      return;
    }
    createInsumo.mutate(payload, { onSuccess: () => setOpen(false), onError });
  };

  const saving = createInsumo.isPending || updateInsumo.isPending;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Insumos y costos
      </Typography>
      <Button variant="contained" onClick={openCreate} sx={{ mb: 2 }}>
        Nuevo insumo
      </Button>
      {insumosQuery.isError && (
        <Alert severity="error">No se pudieron cargar los insumos.</Alert>
      )}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell align="right">Costo unitario</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Mínimo</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(insumosQuery.data ?? []).map((insumo) => {
              const bajoMinimo = Number(insumo.stock_actual) < Number(insumo.stock_minimo);
              return (
                <TableRow key={insumo.id}>
                  <TableCell>{insumo.nombre}</TableCell>
                  <TableCell>{insumo.categoria?.nombre ?? "—"}</TableCell>
                  <TableCell>{insumo.proveedor?.nombre ?? "—"}</TableCell>
                  <TableCell>{UNIDAD_LABEL[insumo.unidad_medida]}</TableCell>
                  <TableCell align="right">{formatCop(Number(insumo.costo_unitario))}</TableCell>
                  <TableCell align="right" sx={{ color: bajoMinimo ? "error.main" : undefined }}>
                    {insumo.stock_actual}
                  </TableCell>
                  <TableCell align="right">{insumo.stock_minimo}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openEdit(insumo)}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Editar insumo" : "Nuevo insumo"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre"
            value={form.nombre}
            onChange={(event) => setForm({ ...form, nombre: event.target.value })}
            required
            sx={{ mt: 1 }}
          />
          <TextField
            select
            label="Categoría"
            value={form.categoria_id || ""}
            onChange={(event) =>
              setForm({ ...form, categoria_id: Number(event.target.value) })
            }
            required
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Nueva categoría"
              value={nuevaCategoria}
              onChange={(event) => setNuevaCategoria(event.target.value)}
              fullWidth
            />
            <Button
              onClick={crearCategoria}
              disabled={createCategoria.isPending || !nuevaCategoria.trim()}
            >
              Crear
            </Button>
          </Box>
          <TextField
            select
            label="Proveedor"
            value={form.proveedor_id ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                proveedor_id: event.target.value === "" ? null : Number(event.target.value),
              })
            }
          >
            <MenuItem value="">Sin proveedor</MenuItem>
            {proveedores.map((proveedor) => (
              <MenuItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Nuevo proveedor"
              value={nuevoProveedor}
              onChange={(event) => setNuevoProveedor(event.target.value)}
              fullWidth
            />
            <Button
              onClick={crearProveedor}
              disabled={createProveedor.isPending || !nuevoProveedor.trim()}
            >
              Crear
            </Button>
          </Box>
          <TextField
            select
            label="Unidad"
            value={form.unidad_medida}
            onChange={(event) =>
              setForm({ ...form, unidad_medida: event.target.value as UnidadMedida })
            }
          >
            {UNIDADES.map((unidad) => (
              <MenuItem key={unidad} value={unidad}>
                {UNIDAD_LABEL[unidad]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Costo unitario"
            type="number"
            value={form.costo_unitario}
            onChange={(event) =>
              setForm({ ...form, costo_unitario: Number(event.target.value) })
            }
            slotProps={{ htmlInput: { min: 0, step: "0.0001" } }}
          />
          <TextField
            label="Stock actual"
            type="number"
            value={form.stock_actual}
            onChange={(event) =>
              setForm({ ...form, stock_actual: Number(event.target.value) })
            }
            slotProps={{ htmlInput: { min: 0, step: "0.0001" } }}
          />
          <TextField
            label="Stock mínimo"
            type="number"
            value={form.stock_minimo}
            onChange={(event) =>
              setForm({ ...form, stock_minimo: Number(event.target.value) })
            }
            slotProps={{ htmlInput: { min: 0, step: "0.0001" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={saving || !form.nombre.trim() || !form.categoria_id}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
