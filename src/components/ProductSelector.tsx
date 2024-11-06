import React from "react";
import {
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { Product } from "../types";

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  disabled: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  setSelectedProducts,
  disabled,
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedIds = event.target.value as number[]; // Cast to number array
    const selectedProducts = products.filter((product) =>
      selectedIds.includes(product.id)
    );
    setSelectedProducts(selectedProducts);
  };

  const selectedIds = selectedProducts.map((product) => product.id); // Map to product IDs

  return (
    <Select
      multiple
      value={selectedIds}
      onChange={handleChange}
      renderValue={(selected) =>
        products
          .filter((product) => (selected as number[]).includes(product.id))
          .map((p) => p.title)
          .join(", ")
      }
      disabled={disabled}
    >
      {products.map((product) => (
        <MenuItem key={product.id} value={product.id}>
          <Checkbox checked={selectedIds.includes(product.id)} />
          <ListItemText primary={product.title} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default ProductSelector;
