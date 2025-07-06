import { Loading, ProtectedRoute } from "@components/shared";
import CollectionDetailPage from "@pages/collection/CollectionDetails";
import { NotFoundPage } from "@pages/notFound/NotFound";
import ProductDetailPage from "@pages/product/ProductDetails";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@utils/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/auth-context";
import CollectionsPage from "./pages/collection/CollectionPage";
import NewCollectionPage from "./pages/collection/NewCollectionPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import { Login } from "./pages/Login/Login";
import NewProductPage from "./pages/product/NewProductPage";
import ProductsPage from "./pages/product/ProductsPage";
import { RegisterPage } from "./pages/Register/Register";
import ReportsPage from "./pages/Reports/ReportsPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute>
              <NewProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:publicId"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <CollectionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/new"
          element={
            <ProtectedRoute>
              <NewCollectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections/:publicId"
          element={
            <ProtectedRoute>
              <CollectionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
