import React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Category } from '../types';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value || null);
  };

  return (
    <Select
      value={selectedCategory || ''}
      onChange={handleChange}
      displayEmpty
    >
      <MenuItem value="">
        <em>Select Category</em>
      </MenuItem>
      {categories.map((category) => (
        <MenuItem key={category.name} value={category.name}>
          {category.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CategorySelector;
