import { useEffect, useRef, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetProducts } from "../../application/useGetProducts";
import { useGetCategories } from "../../application/useGetCategories";
import { ProductGrid } from "../components/ProductGrid";
import { FiltersSidebar } from "../components/FiltersSidebar";
import { Pagination } from "../components/Pagination";
import { SkeletonLoader } from "@/shared/ui/components/SkeletonLoader";
import { EmptyState } from "@/shared/ui/components/EmptyState";
import { useCatalogFilters } from "@/shared/stores/filters.store";
import { Box, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import type { Product } from "../../domain/Product";
import type { PaginatedProducts } from "../../domain/ProductFilters";
import styles from "./catalog-page.module.scss";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const {
    syncWithUrl,
    toUrlParams,
    clearFilters,
    setCategoryId,
    search,
    categoryId,
    size,
    color,
    page,
    limit,
    sortBy,
    order,
  } = useCatalogFilters();
  const isInitialMount = useRef(true);
  const isSyncingFromUrl = useRef(false);

  const isPaginated = useMemo(() => {
    return response && typeof response === "object" && "data" in response && "total" in response;
  }, [response]);

  const products: Product[] = useMemo(() => {
    if (!response) return [];
    if (isPaginated) {
      return (response as PaginatedProducts).data;
    }
    return response as Product[];
  }, [response, isPaginated]);

  const pagination = useMemo(() => {
    if (isPaginated) {
      return response as PaginatedProducts;
    }
    return null;
  }, [response, isPaginated]);

  const currentUrlParams = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    if (isInitialMount.current) {
      isSyncingFromUrl.current = true;
      
      const categorySlug = searchParams.get("category");
      if (categorySlug && categories) {
        const category = categories.find((cat) => cat.slug === categorySlug);
        if (category) {
          setCategoryId(category.id);
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("category");
          newParams.set("category_id", category.id.toString());
          setSearchParams(newParams, { replace: true });
          isInitialMount.current = false;
          setTimeout(() => {
            isSyncingFromUrl.current = false;
          }, 0);
          return;
        }
      }
      
      syncWithUrl(searchParams);
      isInitialMount.current = false;
      setTimeout(() => {
        isSyncingFromUrl.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    if (isSyncingFromUrl.current || isInitialMount.current) {
      return;
    }

    const params = toUrlParams();
    const newSearch = params.toString();

    if (newSearch !== currentUrlParams) {
      if (newSearch) {
        setSearchParams(params, { replace: true });
      } else {
        navigate("/catalog", { replace: true });
      }
    }
  }, [
    search,
    categoryId,
    size,
    color,
    page,
    limit,
    sortBy,
    order,
    currentUrlParams,
    toUrlParams,
    setSearchParams,
    navigate,
  ]);

  return (
    <Box className={styles.catalogPage}>
      <Box className={styles.catalogPage__sidebar}>
        <FiltersSidebar products={products} />
      </Box>

      <Box className={styles.catalogPage__content}>
        <Box className={styles.catalogPage__header}>
          <Typography variant="h1" className={styles.catalogPage__title}>
            Catálogo
          </Typography>
          {!isLoading && products && products.length > 0 && (
            <Typography variant="body2" className={styles.catalogPage__count}>
              {pagination
                ? `${pagination.total} producto(s) encontrado(s)`
                : `${products.length} producto(s) encontrado(s)`}
            </Typography>
          )}
        </Box>

        {isLoading ? (
          <SkeletonLoader count={9} variant="card" />
        ) : !products || products.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description="Intenta ajustar los filtros para ver más resultados"
            icon={<SearchOffIcon sx={{ fontSize: 64, color: "text.secondary" }} />}
            action={{
              label: "Limpiar filtros",
              onClick: () => {
                clearFilters();
                navigate("/catalog", { replace: true });
              },
            }}
          />
        ) : (
          <>
            <Box className={styles.catalogPage__grid}>
              <ProductGrid products={products} />
            </Box>
            {pagination && (
              <Pagination
                total={pagination.total}
                page={pagination.page}
                limit={pagination.limit}
                totalPages={pagination.totalPages}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
