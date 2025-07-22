import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";

import { AppShellLayout } from "@components/shared/AppShellLayout";
import { ScrollToTop } from "@components/shared/ScrollToTop";
import { MantineProvider } from "@mantine/core";
import { Home } from "@pages/home/Home";
import { Products } from "@pages/product/Products";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@utils/queryClient";
import { BrowserRouter, Route, Routes } from "react-router";

export default function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <AppShellLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:publicId" element={<Products />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </AppShellLayout>
        </BrowserRouter>
      </QueryClientProvider>
    </MantineProvider>
  );
}
