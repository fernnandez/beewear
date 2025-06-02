import "@mantine/core/styles.css"; // Mantine CSS
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import { BrowserRouter, Route, Routes } from "react-router";
import { Navigation } from "./components/Navigation/Navigation";
import { Home } from "./pages/Home/Home";
import "./styles/global.css"; // Importando o CSS global
import { CarouselPage } from "./pages/Carousel/Carousel";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<CarouselPage />} />
        </Routes>
      </Navigation>
    </BrowserRouter>
  );
}
