import { ProductVariationFormValues } from "@localTypes/product";
import api from "./api";
import { uploadImage } from "./storage.service";
import { EditVariationFormValue } from "@components/product/ProductVariationsSection/EditVariationModal";

export const createProductVariation = async (
  publicId: string,
  data: ProductVariationFormValues
) => {
  const images = data.imageFiles.map(async (image) => {
    return await uploadImage(image);
  });

  const response = await api.post(`/product-variation/${publicId}`, {
    ...data,
    images: await Promise.all(images),
  });
  return response.data;
};

export const updateProductVariation = async (
  publicId: string,
  data: EditVariationFormValue
) => {
  const response = await api.patch(`/product-variation/${publicId}`, {
    ...data,
  });
  return response.data;
};

export const deleteProductVariation = async (publicId: string) => {
  const response = await api.delete(`/product-variation/${publicId}`);
  return response.data;
};

export async function addVariationImages(
  variationPublicId: string,
  images: File[]
) {
  const imagesSaved = images.map(async (image) => {
    return await uploadImage(image);
  });

  const { data } = await api.patch(
    `/product-variation/${variationPublicId}/images`,
    {
      images: await Promise.all(imagesSaved),
    }
  );
  return data;
}

export async function removeVariationImage(
  variationPublicId: string,
  image: string
) {
  const { data } = await api.patch(
    `/product-variation/${variationPublicId}/images/remove`,
    { image }
  );
  return data;
}
