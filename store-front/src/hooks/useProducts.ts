import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProduct = (publicId: string) => {
  return useQuery({
    queryKey: ["product", publicId],
    queryFn: () => productService.getProduct(publicId),
    enabled: !!publicId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => productService.getCollections(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};
