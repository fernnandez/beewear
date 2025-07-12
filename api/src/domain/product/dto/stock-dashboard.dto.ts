export interface StockDashboardDto {
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    noStockCount: number;
  };
  lowStockAlerts: {
    name: string;
    category: string;
    size: string;
    stock: number;
    minStock: number;
  }[];
  recentMovements: {
    productName: string;
    date: string;
    type: 'Compra' | 'Venda';
    quantity: number;
  }[];
}
