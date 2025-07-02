import { Image, ImageProps } from "@mantine/core";
import { getImage } from "@services/storage.service";
import { useQuery } from "@tanstack/react-query";

interface ProductImagePreviewProps extends Omit<ImageProps, "src" | "alt"> {
  image: string;
}

export const ProductImagePreview = ({
  image,
  ...rest
}: ProductImagePreviewProps) => {
  const { data: src } = useQuery({
    queryKey: ["image", image],
    queryFn: () => getImage(image!),
    staleTime: 1000 * 60 * 5,
    enabled: !!image,
  });
  return (
    <Image src={src} radius="sm" h={400} w="auto" fit="contain" {...rest} />
  );
};
