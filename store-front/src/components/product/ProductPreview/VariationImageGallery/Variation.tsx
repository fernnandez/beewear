import { Carousel } from "@mantine/carousel";
import {
  Center,
  Divider,
  Flex,
  Image,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight, IconPhoto } from "@tabler/icons-react";

interface Props {
  selectedVariation: {
    publicId: string;
    images: string[];
  };
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
}

export function Variation({ selectedVariation }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const images = selectedVariation?.images || [];

  return (
    <>
      {images?.length > 0 ? (
        <Carousel
          withIndicators={true}
          withControls
          h={"auto"}
          slideGap="xs"
          maw={600}
          miw={"100%"}
          nextControlIcon={
            <ThemeIcon color="yellow.5">
              <IconArrowRight size={18} />
            </ThemeIcon>
          }
          previousControlIcon={
            <ThemeIcon color="yellow.5">
              <IconArrowLeft size={18} color="white" />
            </ThemeIcon>
          }
          styles={(theme) => ({
            indicator: {
              backgroundColor: theme.colors.yellow[5],
              width: 16,
              height: 16,
            },
            controls: {
              color: theme.colors.yellow[5],
            },
          })}
        >
          {images?.map((url) => (
            <Carousel.Slide key={url}>
              <Paper withBorder radius="md" p="xs">
                <Center>
                  <Image src={url} key={url} w="100%" maw={500} mah={600} />
                </Center>
              </Paper>
            </Carousel.Slide>
          ))}
        </Carousel>
      ) : (
        <Paper withBorder radius="md" p="xs" w="100%">
          <Center>
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
          </Center>
        </Paper>
      )}
      {/* <Flex align="center" gap="md" direction={"row"}>
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
      </Flex> */}
      {isMobile && <Divider />}
    </>
  );
}
