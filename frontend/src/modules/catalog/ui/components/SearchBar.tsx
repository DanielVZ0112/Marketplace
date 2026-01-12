import { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCatalogFilters } from "../../../../shared/stores/filters.store";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function SearchBar() {
  const [localSearch, setLocalSearch] = useState("");
  const setSearch = useCatalogFilters((s) => s.setSearch);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <TextField
      fullWidth
      placeholder="Buscar productos..."
      value={localSearch}
      onChange={(e) => setLocalSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
