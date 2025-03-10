import { Skeleton } from "@mantine/core";

export const SkeletonGrid: React.FC = () => {
  return (
    <>
      <Skeleton height={150} width={160} radius="lg" />
      <Skeleton height={150} width={160} radius="lg" />
      <Skeleton height={150} width={160} radius="lg" />
      <Skeleton height={150} width={160} radius="lg" />
    </>
  );
};
