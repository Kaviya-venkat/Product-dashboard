import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  Button,
  CircularProgress,
  Checkbox,
  ListItemText,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "./Dashboard.scss"; // Importing the SCSS file

// Types for Category and Product
interface Category {
  slug: string;
  name: string;
  url: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Categories state
  const [products, setProducts] = useState<Product[]>([]); // Products state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Selected category
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // Selected products
  const [chartOptions, setChartOptions] = useState({}); // Chart options
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch categories on mount
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(
          data.map((category: { slug: string; name: string; url: string }) => ({
            slug: category.slug,
            name: category.name,
            url: category.url,
          }))
        );
      });
  }, []);

  // Fetch products when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      const selectedCategoryData = categories.find(
        (category) => category.slug === selectedCategory
      );
      if (selectedCategoryData) {
        fetch(selectedCategoryData.url)
          .then((res) => res.json())
          .then((data) => setProducts(data.products)); // Assuming data.products contains the list of products
      }
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
    setSelectedProducts([]); // Clear selected products if category changes
  };

  const handleProductChange = (event: SelectChangeEvent<number[]>) => {
    const selectedIds = event.target.value as number[];
    setSelectedProducts(selectedIds);
  };

  const handleClear = () => {
    setSelectedCategory(null);
    setSelectedProducts([]);
    setChartOptions({}); // Reset the chart to initial state
  };

  const handleRunReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const selectedData = selectedProducts.length
        ? products.filter((product) => selectedProducts.includes(product.id))
        : products;

      setChartOptions({
        chart: {
          type: "column",
        },
        title: {
          text: `Products in selected Category`,
        },
        xAxis: {
          categories: selectedData.map((product) => product.title),
        },
        yAxis: {
          title: {
            text: "Price ($)",
          },
        },
        series: [
          {
            name: "Price",
            data: selectedData.map((product) => product.price),
          },
        ],
      });

      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Filters Panel */}
      <div className="filters-panel">
        <div className="filters-header">
          <Typography variant="h6">Filters</Typography>
          <button className="clear-button" onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* Category Selector */}
        <div className="filter-select">
          <Select
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
            displayEmpty
            className="select-category"
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.slug} value={category.slug}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Product Selector */}
        <div className="filter-select">
          <Select
            multiple
            value={selectedProducts}
            onChange={handleProductChange}
            displayEmpty
            className="select-product"
            disabled={!selectedCategory}
            renderValue={(selected) => {
              const selectedTitles = (selected as number[])
                .map((id) => {
                  const product = products.find((p) => p.id === id);
                  return product ? product.title : "";
                })
                .join(", ");
              return selectedTitles || "Select Product";
            }}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                <Checkbox checked={selectedProducts.includes(product.id)} />
                <ListItemText primary={product.title} />
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Run Report Button */}
        <Button
          variant="contained"
          onClick={handleRunReport}
          className="run-report-button"
          disabled={!selectedCategory || isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Run Report"
          )}
        </Button>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        {Object.keys(chartOptions).length ? (
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        ) : (
          <div className="spinner">
            <Typography variant="body1">
              Select filters and run report to display the chart.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
