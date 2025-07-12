import { Loading, ProtectedRoute } from "@components/shared";
import CollectionDetailPage from "@pages/collection/CollectionDetails";
import CollectionsPage from "@pages/collection/CollectionPage";
import NewCollectionPage from "@pages/collection/NewCollectionPage";
import { Login } from "@pages/login/Login";
import { NotFoundPage } from "@pages/notFound/NotFound";
import NewProductPage from "@pages/product/NewProductPage";
import ProductDetailPage from "@pages/product/ProductDetails";
import ProductsPage from "@pages/product/ProductsPage";
import { RegisterPage } from "@pages/register/Register";
import ReportsPage from "@pages/reports/ReportsPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@utils/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/auth-context";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/reports" replace />} />
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
