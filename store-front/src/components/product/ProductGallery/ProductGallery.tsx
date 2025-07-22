import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router";

const products = [
  {
    id: 1,
    publicId: "089e3d84-9b47-46c2-98aa-7b47889bdfa8",
    name: "T-shirt",
    active: true,
    createdAt: "2025-07-12T17:23:29.401Z",
    updatedAt: "2025-07-12T17:23:29.401Z",
    aggregations: {
      totalStock: 28,
      totalValue: 2800,
    },
    collection: {
      id: 1,
      publicId: "8caec05d-3b8e-4309-9868-71b033eb8cd5",
      name: "Pólen",
      active: true,
      description:
        "UM ENXAME DE CORPOS EM MOVIMENTO,\nMENTES FOCADAS E CORAÇÕES PULSANDO\nNO MESMO RITMO.",
      imageUrl:
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773897/beewear/banner-amarelo.png",
      createdAt: "2025-07-12T17:17:12.869Z",
      updatedAt: "2025-07-17T17:56:50.776Z",
      deletedAt: null,
    },
    variations: [
      {
        publicId: "b690d155-9140-4320-a965-ac8707bfc94e",
        color: "#005e32",
        name: "verde musgo",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 1,
              publicId: "a3406e3c-c714-440e-a4b3-8f171daaceaf",
              quantity: 3,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-17T18:16:45.624Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 2,
              publicId: "b5881228-d705-4e79-8750-944144d96b54",
              quantity: 10,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:45.540Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 3,
              publicId: "72ddf7a1-a5cc-4952-9289-426be9a88c67",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 4,
              publicId: "7fe07e9b-91f0-4383-9ceb-0060d5acd93e",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 5,
              publicId: "bc4cafa4-ae9f-417d-8dbf-86300132d45f",
              quantity: 15,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:57.814Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 6,
              publicId: "6b49cb50-6335-4820-b682-45e635354ef6",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 7,
              publicId: "8ba33635-b8da-4c4e-baa5-b4cf33539825",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
        ],
        price: 100,
        stock: 28,
      },
      {
        publicId: "7aeae4a7-3154-49e3-99ca-801028016552",
        color: "#4f42ff",
        name: "azul",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 8,
              publicId: "d236a793-4ef3-42b8-b4a0-0e9740de22e8",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 9,
              publicId: "e185fbff-7376-45e4-93fc-982d3998567b",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 10,
              publicId: "28da01f5-b877-4e2b-bfa0-fbd44391f5af",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 11,
              publicId: "07c97d7b-bc41-4b06-9ec5-3d873ddbb4a2",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 12,
              publicId: "039297b0-4b34-4ff5-8e20-a7d3e40f45d9",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 13,
              publicId: "c7d3a4b5-37d3-466e-b9e8-190140502ae3",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 14,
              publicId: "fdf06eea-5550-4841-8fa9-d66efb564664",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773760/beewear/blue2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775105/beewear/blue1.jpg",
        ],
        price: 100,
        stock: 28,
      },
    ],
  },
  {
    id: 1,
    publicId: "089e3d84-9b47-46c2-98aa-7b47889bdfa8",
    name: "T-shirt",
    active: true,
    createdAt: "2025-07-12T17:23:29.401Z",
    updatedAt: "2025-07-12T17:23:29.401Z",
    aggregations: {
      totalStock: 28,
      totalValue: 2800,
    },
    collection: {
      id: 1,
      publicId: "8caec05d-3b8e-4309-9868-71b033eb8cd5",
      name: "Pólen",
      active: true,
      description:
        "UM ENXAME DE CORPOS EM MOVIMENTO,\nMENTES FOCADAS E CORAÇÕES PULSANDO\nNO MESMO RITMO.",
      imageUrl:
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773897/beewear/banner-amarelo.png",
      createdAt: "2025-07-12T17:17:12.869Z",
      updatedAt: "2025-07-17T17:56:50.776Z",
      deletedAt: null,
    },
    variations: [
      {
        publicId: "b690d155-9140-4320-a965-ac8707bfc94e",
        color: "#005e32",
        name: "verde musgo",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 1,
              publicId: "a3406e3c-c714-440e-a4b3-8f171daaceaf",
              quantity: 3,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-17T18:16:45.624Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 2,
              publicId: "b5881228-d705-4e79-8750-944144d96b54",
              quantity: 10,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:45.540Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 3,
              publicId: "72ddf7a1-a5cc-4952-9289-426be9a88c67",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 4,
              publicId: "7fe07e9b-91f0-4383-9ceb-0060d5acd93e",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 5,
              publicId: "bc4cafa4-ae9f-417d-8dbf-86300132d45f",
              quantity: 15,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:57.814Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 6,
              publicId: "6b49cb50-6335-4820-b682-45e635354ef6",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 7,
              publicId: "8ba33635-b8da-4c4e-baa5-b4cf33539825",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
        ],
        price: 100,
        stock: 28,
      },
      {
        publicId: "7aeae4a7-3154-49e3-99ca-801028016552",
        color: "#4f42ff",
        name: "azul",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 8,
              publicId: "d236a793-4ef3-42b8-b4a0-0e9740de22e8",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 9,
              publicId: "e185fbff-7376-45e4-93fc-982d3998567b",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 10,
              publicId: "28da01f5-b877-4e2b-bfa0-fbd44391f5af",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 11,
              publicId: "07c97d7b-bc41-4b06-9ec5-3d873ddbb4a2",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 12,
              publicId: "039297b0-4b34-4ff5-8e20-a7d3e40f45d9",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 13,
              publicId: "c7d3a4b5-37d3-466e-b9e8-190140502ae3",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 14,
              publicId: "fdf06eea-5550-4841-8fa9-d66efb564664",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773760/beewear/blue2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775105/beewear/blue1.jpg",
        ],
        price: 100,
        stock: 28,
      },
    ],
  },
  {
    id: 1,
    publicId: "089e3d84-9b47-46c2-98aa-7b47889bdfa8",
    name: "T-shirt",
    active: true,
    createdAt: "2025-07-12T17:23:29.401Z",
    updatedAt: "2025-07-12T17:23:29.401Z",
    aggregations: {
      totalStock: 28,
      totalValue: 2800,
    },
    collection: {
      id: 1,
      publicId: "8caec05d-3b8e-4309-9868-71b033eb8cd5",
      name: "Pólen",
      active: true,
      description:
        "UM ENXAME DE CORPOS EM MOVIMENTO,\nMENTES FOCADAS E CORAÇÕES PULSANDO\nNO MESMO RITMO.",
      imageUrl:
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773897/beewear/banner-amarelo.png",
      createdAt: "2025-07-12T17:17:12.869Z",
      updatedAt: "2025-07-17T17:56:50.776Z",
      deletedAt: null,
    },
    variations: [
      {
        publicId: "b690d155-9140-4320-a965-ac8707bfc94e",
        color: "#005e32",
        name: "verde musgo",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 1,
              publicId: "a3406e3c-c714-440e-a4b3-8f171daaceaf",
              quantity: 3,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-17T18:16:45.624Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 2,
              publicId: "b5881228-d705-4e79-8750-944144d96b54",
              quantity: 10,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:45.540Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 3,
              publicId: "72ddf7a1-a5cc-4952-9289-426be9a88c67",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 4,
              publicId: "7fe07e9b-91f0-4383-9ceb-0060d5acd93e",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 5,
              publicId: "bc4cafa4-ae9f-417d-8dbf-86300132d45f",
              quantity: 15,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:57.814Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 6,
              publicId: "6b49cb50-6335-4820-b682-45e635354ef6",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 7,
              publicId: "8ba33635-b8da-4c4e-baa5-b4cf33539825",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
        ],
        price: 100,
        stock: 28,
      },
      {
        publicId: "7aeae4a7-3154-49e3-99ca-801028016552",
        color: "#4f42ff",
        name: "azul",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 8,
              publicId: "d236a793-4ef3-42b8-b4a0-0e9740de22e8",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 9,
              publicId: "e185fbff-7376-45e4-93fc-982d3998567b",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 10,
              publicId: "28da01f5-b877-4e2b-bfa0-fbd44391f5af",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 11,
              publicId: "07c97d7b-bc41-4b06-9ec5-3d873ddbb4a2",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 12,
              publicId: "039297b0-4b34-4ff5-8e20-a7d3e40f45d9",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 13,
              publicId: "c7d3a4b5-37d3-466e-b9e8-190140502ae3",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 14,
              publicId: "fdf06eea-5550-4841-8fa9-d66efb564664",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773760/beewear/blue2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775105/beewear/blue1.jpg",
        ],
        price: 100,
        stock: 28,
      },
    ],
  },
  {
    id: 1,
    publicId: "089e3d84-9b47-46c2-98aa-7b47889bdfa8",
    name: "T-shirt",
    active: true,
    createdAt: "2025-07-12T17:23:29.401Z",
    updatedAt: "2025-07-12T17:23:29.401Z",
    aggregations: {
      totalStock: 28,
      totalValue: 2800,
    },
    collection: {
      id: 1,
      publicId: "8caec05d-3b8e-4309-9868-71b033eb8cd5",
      name: "Pólen",
      active: true,
      description:
        "UM ENXAME DE CORPOS EM MOVIMENTO,\nMENTES FOCADAS E CORAÇÕES PULSANDO\nNO MESMO RITMO.",
      imageUrl:
        "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773897/beewear/banner-amarelo.png",
      createdAt: "2025-07-12T17:17:12.869Z",
      updatedAt: "2025-07-17T17:56:50.776Z",
      deletedAt: null,
    },
    variations: [
      {
        publicId: "b690d155-9140-4320-a965-ac8707bfc94e",
        color: "#005e32",
        name: "verde musgo",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 1,
              publicId: "a3406e3c-c714-440e-a4b3-8f171daaceaf",
              quantity: 3,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-17T18:16:45.624Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 2,
              publicId: "b5881228-d705-4e79-8750-944144d96b54",
              quantity: 10,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:45.540Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 3,
              publicId: "72ddf7a1-a5cc-4952-9289-426be9a88c67",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 4,
              publicId: "7fe07e9b-91f0-4383-9ceb-0060d5acd93e",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 5,
              publicId: "bc4cafa4-ae9f-417d-8dbf-86300132d45f",
              quantity: 15,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T19:58:57.814Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 6,
              publicId: "6b49cb50-6335-4820-b682-45e635354ef6",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 7,
              publicId: "8ba33635-b8da-4c4e-baa5-b4cf33539825",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green4.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green3.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775071/beewear/green1.jpg",
        ],
        price: 100,
        stock: 28,
      },
      {
        publicId: "7aeae4a7-3154-49e3-99ca-801028016552",
        color: "#4f42ff",
        name: "azul",
        sizes: [
          {
            size: "XXS",
            stock: {
              id: 8,
              publicId: "d236a793-4ef3-42b8-b4a0-0e9740de22e8",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XS",
            stock: {
              id: 9,
              publicId: "e185fbff-7376-45e4-93fc-982d3998567b",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "S",
            stock: {
              id: 10,
              publicId: "28da01f5-b877-4e2b-bfa0-fbd44391f5af",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "M",
            stock: {
              id: 11,
              publicId: "07c97d7b-bc41-4b06-9ec5-3d873ddbb4a2",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "L",
            stock: {
              id: 12,
              publicId: "039297b0-4b34-4ff5-8e20-a7d3e40f45d9",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XL",
            stock: {
              id: 13,
              publicId: "c7d3a4b5-37d3-466e-b9e8-190140502ae3",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
          {
            size: "XXL",
            stock: {
              id: 14,
              publicId: "fdf06eea-5550-4841-8fa9-d66efb564664",
              quantity: 0,
              createdAt: "2025-07-12T17:23:29.401Z",
              updatedAt: "2025-07-12T17:23:29.401Z",
              deletedAt: null,
            },
          },
        ],
        images: [
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752773760/beewear/blue2.jpg",
          "https://res.cloudinary.com/dm1cthyvc/image/upload/v1752775105/beewear/blue1.jpg",
        ],
        price: 100,
        stock: 28,
      },
    ],
  },
];

export const ProductGallery = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Container size="xl" py={60}>
      <Group justify="space-between" align="flex-end" w={"100%"} mb={"xl"}>
        <Title order={2} fw={300} size="1.8rem" c="dark">
          Produtos
        </Title>
        <Group gap="xs">
          <Button variant="filled" color="dark" size="xs" radius="sm">
            Todos
          </Button>
          <Button variant="subtle" color="gray" size="xs" radius="sm">
            Pólen
          </Button>
          <Button variant="subtle" color="gray" size="xs" radius="sm">
            Sting
          </Button>
          <Button variant="subtle" color="gray" size="xs" radius="sm">
            Colmeia
          </Button>
        </Group>
      </Group>

      <Grid gutter={{ base: "md", sm: "md", md: "md", lg: "lg" }}>
        {products.map((product, index) => (
          <Grid.Col key={product.id} span={{ base: 6, lg: 4 }}>
            <Card
              onClick={
                isMobile ? () => navigate(`/product/${product.id}`) : () => {}
              }
              shadow="sm"
              padding={0}
              radius="md"
              withBorder
              style={{
                height: "100%",
                transition: "box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              styles={{
                root: {
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  },
                },
              }}
            >
              {/* Imagem do produto */}
              <Card.Section>
                <div style={{ position: "relative", aspectRatio: "3/4" }}>
                  <Image
                    src={
                      product.variations[0].images[index] || "/placeholder.svg"
                    }
                    alt={product.name}
                    fit="cover"
                    style={{
                      transition: "transform 0.3s ease",
                    }}
                    styles={{
                      root: {
                        "&:hover img": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  />
                </div>
              </Card.Section>

              {/* Conteúdo do card */}
              <Stack
                gap="xs"
                p={{ base: "xs", sm: "sm", md: "md" }}
                style={{ flexGrow: 1 }}
              >
                {/* Nome do produto */}
                <Text
                  fw={600}
                  size="md"
                  c="dark"
                  style={{ lineHeight: 1.2, flexGrow: 1 }}
                >
                  {product.name}
                </Text>

                {/* Preço */}
                <Title order={4} fw={400}>
                  €{product.variations[0].price.toFixed(2).replace(".", ",")}
                </Title>

                {/* Botão */}
                {!isMobile && (
                  <Button
                    variant="outline"
                    color="dark"
                    fullWidth
                    size="sm"
                    radius="md"
                    onClick={() => navigate(`/product/${product.id}`)}
                    styles={{
                      root: {
                        borderColor: "#dee2e6",
                        color: "#495057",
                        // backgroundColor: "transparent",
                        // "&:hover": {
                        //   backgroundColor: "#7d7d7dff",
                        // },
                      },
                    }}
                  >
                    Ver produto
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
