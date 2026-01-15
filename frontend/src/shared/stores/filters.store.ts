import { create } from "zustand";
import type { SortBy, SortOrder } from "@/modules/catalog/domain/ProductFilters";

interface CatalogFilters {
  search: string;
  categoryId: number | null;
  size: string | null;
  color: string | null;
  page: number;
  limit: number;
  sortBy: SortBy | null;
  order: SortOrder;

  setSearch: (search: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setSize: (size: string | null) => void;
  setColor: (color: string | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (sortBy: SortBy | null) => void;
  setOrder: (order: SortOrder) => void;
  clearFilters: () => void;
  syncWithUrl: (params: URLSearchParams) => void;
  toUrlParams: () => URLSearchParams;
}

export const useCatalogFilters = create<CatalogFilters>((set, get) => ({
  search: "",
  categoryId: null,
  size: null,
  color: null,
  page: 1,
  limit: 20,
  sortBy: null,
  order: "asc",

  setSearch: (search) => set({ search, page: 1 }),
  setCategoryId: (categoryId) => set({ categoryId, page: 1 }),
  setSize: (size) => set({ size, page: 1 }),
  setColor: (color) => set({ color, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setOrder: (order) => set({ order, page: 1 }),
  clearFilters: () =>
    set({
      search: "",
      categoryId: null,
      size: null,
      color: null,
      page: 1,
      limit: 20,
      sortBy: null,
      order: "asc",
    }),

  syncWithUrl: (params: URLSearchParams) => {
    if (params.toString() === "") {
      set({
        search: "",
        categoryId: null,
        size: null,
        color: null,
        page: 1,
        limit: 20,
        sortBy: null,
        order: "asc",
      });
      return;
    }

    const search = params.get("search") || "";
    const categoryId = params.get("category_id");
    const size = params.get("size");
    const color = params.get("color");
    const page = params.get("page");
    const limit = params.get("limit");
    const sortBy = params.get("sortBy");
    const order = params.get("order");

    set({
      search,
      categoryId: categoryId ? Number(categoryId) : null,
      size: size || null,
      color: color || null,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      sortBy: (sortBy as SortBy) || null,
      order: (order as SortOrder) || "asc",
    });
  },

  toUrlParams: () => {
    const state = get();
    const params = new URLSearchParams();

    if (state.search) params.set("search", state.search);
    if (state.categoryId) params.set("category_id", state.categoryId.toString());
    if (state.size) params.set("size", state.size);
    if (state.color) params.set("color", state.color);
    if (state.page > 1) params.set("page", state.page.toString());
    if (state.limit !== 20) params.set("limit", state.limit.toString());
    if (state.sortBy) params.set("sortBy", state.sortBy);
    if (state.order !== "asc") params.set("order", state.order);

    return params;
  },
}));
