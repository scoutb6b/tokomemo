import { Group } from "@mantine/core";
import {
  IconBuildingStore,
  IconCalculator,
  IconIcons,
  IconListDetails,
} from "@tabler/icons-react";
import c from "./footer.module.css";
import { ActiveLink } from "./components/ActiveLink";

const links = [
  { href: "/product", label: "商品", icon: <IconListDetails size={45} /> },
  {
    href: "/store",
    label: "お店",
    icon: <IconBuildingStore stroke={1.5} size={45} />,
  },
  {
    href: "/category",
    label: "カテゴリー",
    icon: <IconIcons size={45} />,
  },
  {
    href: "/calc",
    label: "電卓",
    icon: <IconCalculator stroke={1.5} size={45} />,
  },
] as const;

export function Footer() {
  return (
    <footer className={c.flexGroup}>
      <Group gap="xl">
        {links.map((item) => {
          return (
            <ActiveLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          );
        })}
      </Group>
    </footer>
  );
}
