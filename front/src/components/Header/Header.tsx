import {
  Burger,
  Divider,
  Drawer,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingBag } from "@tabler/icons-react";
import classes from "./Header.module.css";

const links = [
  { link: "/hive", label: "Hive" },
  { link: "/polen", label: "Pólen" },
  { link: "/buzz", label: "Buzz" },
  { link: "/queen-bee", label: "Queen Bee" },
  { link: "/sting", label: "Sting" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger
            color="yellow.7"
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
          />
          <Text style={{ cursor: "pointer" }}>BeeWear</Text>
        </Group>

        <Drawer
          opened={opened}
          onClose={toggle}
          position="left"
          size="75%"
          title="Collections"
          padding="md"
        >
          <Stack gap="md">{items}</Stack>
        </Drawer>

        <Group gap={5} className={classes.links} visibleFrom="sm">
          {items}
        </Group>
        <Group>
          <Divider
            orientation="vertical"
            color="yellow.7"
            size="md" // Define a espessura
          />
          <UnstyledButton className={classes.shoppingBag}>
            <IconShoppingBag size={25} stroke={1.5} />
          </UnstyledButton>
          {/* <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          /> */}
        </Group>
      </div>
    </header>
  );
}
