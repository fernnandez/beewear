import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { AppShellLayout } from "@components/shared/AppShellLayout";
import { ErrorBoundary } from "@components/shared/ErrorBoundary/ErrorBoundary";
import { ScrollToTop } from "@components/shared/ScrollToTop";
import { CheckoutProvider } from "@contexts/checkout-context";
import Account from "@pages/account/Account";
import Addresses from "@pages/address/Addresses";
import { Checkout } from "@pages/checkout/Checkout";
import { CheckoutSuccess } from "@pages/checkout/CheckoutSuccess";

import { ProtectedRoute } from "@components/shared/ProtectedRoute/ProtectedRoute";
import { Home } from "@pages/home/Home";
import { NotFoundPage } from "@pages/notFound/NotFound";
import { OrderDetails } from "@pages/order/OrderDetails";
import { Orders } from "@pages/order/Orders";
import { Products } from "@pages/product/Products";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@utils/queryClient";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <AppShellLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:publicId" element={<Products />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/addresses"
              element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/orders/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            {/* Rotas de checkout envolvidas pelo CheckoutProvider */}
            <Route
              path="/checkout"
              element={
                <CheckoutProvider>
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                </CheckoutProvider>
              }
            />
            <Route
              path="/checkout/success"
              element={
                <CheckoutProvider>
                  <ProtectedRoute>
                    <CheckoutSuccess />
                  </ProtectedRoute>
                </CheckoutProvider>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShellLayout>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
