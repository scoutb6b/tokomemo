import { Group, Skeleton } from "@mantine/core";

export const SkeltonBar = () => {
  return (
    <Group>
      <Skeleton height={40} radius="xl" mt={10} />
      <Skeleton height={40} radius="xl" mt={10} />
    </Group>
  );
};
