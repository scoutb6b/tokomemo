import { ActionIcon, Box, Flex, Image } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { supabase } from "../_libs/supabase";
import { useRouter } from "next/navigation";
import c from "./header.module.css";

export function Header() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Flex justify="space-between" className={c.header}>
      <Box>
        <Image
          src={null}
          fallbackSrc="https://placehold.co/200x40?text=Placeholder"
          w={200}
          h={40}
          alt=""
        ></Image>
      </Box>
      <Box>
        <ActionIcon
          onClick={handleLogout}
          variant="light"
          color="#ff922b"
          size="xl"
          radius="md"
          aria-label="logout"
        >
          <IconLogout size={30} />
        </ActionIcon>
      </Box>
    </Flex>
  );
}
