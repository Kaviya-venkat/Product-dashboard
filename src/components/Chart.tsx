import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Product } from "../types";

interface ChartProps {
  category: string | null;
  products: Product[];
}

const Chart: React.FC<ChartProps> = ({ category, products }) => {
  const options = {
    chart: { type: "column" },
    title: { text: `Products in selected Category` },
    xAxis: { categories: products.map((product) => product.title) },
    yAxis: { title: { text: "Price" } },
    series: [
      {
        name: category,
        data: products.map((product) => product.price),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Chart;
