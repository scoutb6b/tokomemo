import { BackButton } from "@/app/_components/BackButton";
import { Box } from "@mantine/core";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Box w="94%" mx="auto">
        <BackButton />
        {children}
      </Box>
    </>
  );
};

export default Layout;
