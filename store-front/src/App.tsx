import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";

import { AppShellLayout } from "@components/shared/AppShellLayout";
import { ScrollToTop } from "@components/shared/ScrollToTop";
import { Home } from "@pages/home/Home";
import { Login } from "@pages/login/Login";
import { Products } from "@pages/product/Products";
import { RegisterPage } from "@pages/register/Register";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@utils/queryClient";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <AppShellLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/product/:publicId" element={<Products />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </AppShellLayout>
    </QueryClientProvider>
  );
}
