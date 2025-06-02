import { Carousel } from "@mantine/carousel";
import { CardItem } from "../CardItem/CardItem";

const items = [
  { image: "images/buzz.png", name: "Buzz", price: "$100" },
  { image: "images/polen.png", name: "Pólen", price: "$100" },
  { image: "images/queen-bee.png", name: "Queen Bee", price: "$100" },
  { image: "images/sting.png", name: "Sting", price: "$100" },
];

export function ProductCarousel() {
  return (
    <Carousel
      loop
      align="center"
      withControls={true}
      slideSize={{
        lg: "33.3333%", // 3 slides visíveis em telas grandes
        md: "50%", // 2 slides visíveis em telas médias
        sm: "100%", // 1 slide visível em telas pequenas
      }}
      slideGap={{
        base: 0, // Sem espaço entre os slides em telas pequenas
        sm: "md", // Espaço médio em telas médias e maiores
      }}
      controlsOffset="xs"
      controlSize={30}
    >
      {items.map((item, index) => (
        <Carousel.Slide key={index}>
          <CardItem image={item.image} name={item.name} price={item.price} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
