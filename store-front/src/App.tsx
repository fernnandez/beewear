import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { AppShellLayout } from "@components/shared/AppShellLayout";
import { ScrollToTop } from "@components/shared/ScrollToTop";
import { ErrorBoundary } from "@components/shared/ErrorBoundary/ErrorBoundary";
import Account from "@pages/account/Account";
import { Home } from "@pages/home/Home";
import { NotFoundPage } from "@pages/notFound/NotFound";
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
            <Route path="/account" element={<Account />} />
            <Route path="/product/:publicId" element={<Products />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShellLayout>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
