import { Center, Loader, Stack, Text } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/auth-context";
import { Login } from "./pages/Login/Login";

import CollectionsPage from "./pages/collection/CollectionPage";
import NewCollectionPage from "./pages/collection/NewCollectionPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import NewProductPage from "./pages/product/NewProductPage";
import ProductsPage from "./pages/product/ProductsPage";
import { RegisterPage } from "./pages/Register/Register";
import ReportsPage from "./pages/Reports/ReportsPage";
import CollectionDetailPage from "@pages/collection/CollectionDetails";

export const queryClient = new QueryClient();

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" color="blue" />
          <Text c="dimmed" mt="md">
            Carregando...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
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
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
