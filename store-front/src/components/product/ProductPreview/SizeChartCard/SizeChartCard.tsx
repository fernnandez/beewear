import { Accordion, Card, Table, Title } from "@mantine/core";

const SIZE_GUIDE = [
  { label: "XXS", bust: 76, waist: 58, hip: 84 },
  { label: "XS", bust: 80, waist: 62, hip: 88 },
  { label: "S", bust: 84, waist: 66, hip: 92 },
  { label: "M", bust: 88, waist: 70, hip: 96 },
  { label: "L", bust: 94, waist: 76, hip: 102 },
  { label: "XL", bust: 100, waist: 82, hip: 108 },
  { label: "XXL", bust: 106, waist: 88, hip: 114 },
];

export function SizeGuideCard() {
  return (
    <Card withBorder radius="md" shadow="sm" p="md" style={{ width: "100%" }}>
      <Accordion variant="separated" defaultValue="size-guide">
        <Accordion.Item value="size-guide">
          <Accordion.Control>
            <Title order={4}>Guia de Tamanhos</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Table
              // highlightOnHover
              horizontalSpacing="xs"
              verticalSpacing={3}
              withColumnBorders
              striped
              style={{ fontSize: 12 }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tamanho</Table.Th>
                  <Table.Th>Busto (cm)</Table.Th>
                  <Table.Th>Cintura (cm)</Table.Th>
                  <Table.Th>Quadril (cm)</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {SIZE_GUIDE.map((row) => (
                  <Table.Tr key={row.label}>
                    <Table.Td>{row.label}</Table.Td>
                    <Table.Td>{row.bust}</Table.Td>
                    <Table.Td>{row.waist}</Table.Td>
                    <Table.Td>{row.hip}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
}
