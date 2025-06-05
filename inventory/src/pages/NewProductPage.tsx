"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Title,
  Text,
  Card,
  Group,
  Button,
  Container,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  SimpleGrid,
  Flex,
} from "@mantine/core"
import { IconPackage, IconGavel } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { AppShellLayout } from "../components/AppShell"

const categories = ["Camisetas", "Calças", "Vestidos", "Blusas", "Saias", "Casacos", "Shorts", "Acessórios"]
const sizes = ["PP", "P", "M", "G", "GG", "XGG", "34", "36", "38", "40", "42", "44", "46", "48"]

export default function NewProductPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    size: "",
    price: "",
    stock: "",
    minStock: "",
    description: "",
    supplier: "",
    color: "",
  })

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você salvaria o produto no banco de dados
    console.log("Produto criado:", formData)

    notifications.show({
      title: "Produto cadastrado",
      message: `${formData.name} foi adicionado ao estoque`,
      color: "green",
    })

    navigate("/products")
  }

  const generateSKU = () => {
    if (!formData.category) {
      notifications.show({
        title: "Atenção",
        message: "Selecione uma categoria para gerar o SKU",
        color: "yellow",
      })
      return
    }

    const categoryCode = formData.category.substring(0, 3).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const sku = `${categoryCode}${randomNum}`
    handleInputChange("sku", sku)
  }

  return (
    <AppShellLayout>
      <Container size="xl">
        <Title order={2} mb="md">
          Novo Produto
        </Title>
        <Text c="dimmed" mb="xl">
          Cadastre um novo item no estoque
        </Text>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="lg">
            {/* Informações Básicas */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Group>
                  <IconPackage size={18} />
                  <Title order={4}>Informações Básicas</Title>
                </Group>
                <Text size="sm" c="dimmed">
                  Dados principais do produto
                </Text>
              </Card.Section>

              <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                <TextInput
                  label="Nome do Produto"
                  placeholder="Ex: Camiseta Básica Branca"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />

                <Flex gap="md" align="flex-end">
                  <TextInput
                    label="SKU"
                    placeholder="Ex: CAM001"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    required
                    style={{ flex: 1 }}
                  />
                  <Button onClick={generateSKU} variant="outline" style={{ marginBottom: "1px" }}>
                    Gerar
                  </Button>
                </Flex>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                <Select
                  label="Categoria"
                  placeholder="Selecione..."
                  data={categories}
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                  required
                />

                <Select
                  label="Tamanho"
                  placeholder="Selecione..."
                  data={sizes}
                  value={formData.size}
                  onChange={(value) => handleInputChange("size", value)}
                  required
                />

                <TextInput
                  label="Cor"
                  placeholder="Ex: Branco, Azul, Preto"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </SimpleGrid>

              <Textarea
                label="Descrição"
                placeholder="Descrição detalhada do produto..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                minRows={3}
              />
            </Card>

            {/* Preço e Estoque */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs" mb="md">
                <Title order={4}>Preço e Estoque</Title>
                <Text size="sm" c="dimmed">
                  Configurações de preço e controle de estoque
                </Text>
              </Card.Section>

              <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                <NumberInput
                  label="Preço de Venda (R$)"
                  placeholder="0,00"
                  value={formData.price === "" ? "" : Number(formData.price)}
                  onChange={(value) => handleInputChange("price", value)}
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  required
                />

                <NumberInput
                  label="Quantidade em Estoque"
                  placeholder="0"
                  value={formData.stock === "" ? "" : Number(formData.stock)}
                  onChange={(value) => handleInputChange("stock", value)}
                  min={0}
                  required
                />

                <NumberInput
                  label="Estoque Mínimo"
                  placeholder="0"
                  value={formData.minStock === "" ? "" : Number(formData.minStock)}
                  onChange={(value) => handleInputChange("minStock", value)}
                  min={0}
                  required
                />
              </SimpleGrid>

              <TextInput
                label="Fornecedor"
                placeholder="Nome do fornecedor"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
              />
            </Card>

            {/* Botões de Ação */}
            <Group justify="flex-end">
              <Button component={Link} to="/products" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" leftSection={<IconGavel size={16} />}>
                Salvar Produto
              </Button>
            </Group>
          </Flex>
        </form>
      </Container>
    </AppShellLayout>
  )
}
