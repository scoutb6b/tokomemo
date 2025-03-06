import { Box } from "@mantine/core";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Box w="94%" mx="auto">
        {children}
      </Box>
    </>
  );
};

export default Layout;
