import { Box, Divider, Image, Stack, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ProductCarousel } from "../../components/ProductCarousel/ProductCarousel";

export const Home = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Define o src da imagem com base na media query
  const imageSrc = isMobile
    ? "images/sting-collection-mobile.png"
    : "images/sting-collection.png";

  return (
    <>
      <Image
        src="images/banner.png"
        alt="Banner"
        radius="md"
        style={{ width: "100%", height: "auto" }}
      />

      <Stack mt={"xl"} mb={"xl"}>
        <Title order={3} fw={400}>
          Hiven Collection
        </Title>
        <Divider />
        <Box maw={"65%"} mx="auto" style={{ width: "100%", height: "auto" }}>
          <ProductCarousel />
        </Box>
        <Divider />
      </Stack>

      <Image
        src={imageSrc}
        alt="Banner"
        radius="md"
        fit="cover" // Garante que a imagem ocupe o container sem distorcer
        style={{ width: "100%", height: "auto" }} // Para desktop
      />

      <Stack mt={"xl"} mb={"xl"}>
        <Title order={3} fw={400}>
          Sting Collection
        </Title>
        <Divider />
        <Box maw={"65%"} mx="auto" style={{ width: "100%", height: "auto" }}>
          <ProductCarousel />
        </Box>
        <Divider />
      </Stack>
    </>
  );
};
