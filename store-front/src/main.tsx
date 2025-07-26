import { AuthProvider } from "@contexts/auth-context.tsx";
import { CartProvider } from "@contexts/cart-context.tsx";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        defaultColorScheme="light"
        theme={{ primaryColor: "yellow" }}
      >
        <Notifications position="top-right" />
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
