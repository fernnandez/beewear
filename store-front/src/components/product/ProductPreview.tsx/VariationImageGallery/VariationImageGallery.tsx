import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Center,
  Divider,
  Flex,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp, IconPhoto } from "@tabler/icons-react";
import { EmblaCarouselType } from "node_modules/embla-carousel/esm/components/EmblaCarousel";
import { useEffect, useState } from "react";

interface Props {
  selectedVariation: {
    publicId: string;
    images: string[];
  };
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
}

export function VariationImageGallery({
  selectedVariation,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const imageCount = selectedVariation?.images?.length || 0;
  const useCarousel = imageCount > 7;

  const [api, setApi] = useState<EmblaCarouselType | null>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateButtons();
    api.on("select", updateButtons);
  }, [api]);

  const handlePrev = () => api?.scrollPrev();
  const handleNext = () => api?.scrollNext();

  return (
    <>
      <Flex align="center" gap="md" direction={"row"}>
        {imageCount > 1 && (
          <Flex
            direction="column"
            gap="xs"
            justify="center"
            align="center"
            style={{ maxHeight: 550, overflow: "hidden" }}
          >
            {useCarousel ? (
              <Stack gap="xs" align="center" miw={65}>
                <ActionIcon
                  onClick={handlePrev}
                  color="dark"
                  variant="outline"
                  disabled={!canScrollPrev}
                >
                  <IconChevronUp size={20} />
                </ActionIcon>
                <Carousel
                  miw={50}
                  orientation="vertical"
                  height={350}
                  slideSize="90px"
                  // slideGap="xs"
                  withControls={false}
                  withIndicators={false}
                  getEmblaApi={setApi}
                  emblaOptions={{ align: "center", slidesToScroll: 3 }}
                  styles={{
                    control: { opacity: 0.6, "&:hover": { opacity: 1 } },
                  }}
                >
                  {selectedVariation.images.map((image, index) => (
                    <Carousel.Slide key={index} w={50}>
                      <Paper
                        withBorder
                        p={2}
                        radius="sm"
                        style={{
                          cursor: "pointer",
                          borderColor:
                            index === selectedImageIndex
                              ? "var(--mantine-color-dark-6)"
                              : undefined,
                          borderWidth: index === selectedImageIndex ? 2 : 1,
                        }}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image src={image} w={50} h={50} />
                      </Paper>
                    </Carousel.Slide>
                  ))}
                </Carousel>
                <ActionIcon
                  onClick={handleNext}
                  color="dark"
                  variant="outline"
                  disabled={!canScrollNext}
                >
                  <IconChevronDown size={20} />
                </ActionIcon>
              </Stack>
            ) : (
              selectedVariation.images.map((image, index) => (
                <Paper
                  key={index}
                  withBorder
                  p={2}
                  radius="sm"
                  style={{
                    cursor: "pointer",
                    borderColor:
                      index === selectedImageIndex
                        ? "var(--mantine-color-dark-6)"
                        : undefined,
                    borderWidth: index === selectedImageIndex ? 2 : 1,
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image src={image} w={60} h={60} />
                </Paper>
              ))
            )}
          </Flex>
        )}

        <Paper withBorder radius="md" p="xs" w="100%">
          <Center>
            {imageCount > 0 ? (
              <Image
                src={selectedVariation.images[selectedImageIndex]}
                key={selectedVariation.publicId}
                w="100%"
                maw={500}
              />
            ) : (
              <Flex
                h={300}
                align="center"
                justify="center"
                direction="column"
                gap="md"
                bg="var(--mantine-color-gray-0)"
                w="100%"
              >
                <IconPhoto size={48} color="var(--mantine-color-gray-5)" />
                <Text c="dimmed" size="sm">
                  Nenhuma imagem disponível
                </Text>
              </Flex>
            )}
          </Center>
        </Paper>
      </Flex>
      {isMobile && <Divider />}
    </>
  );
}
