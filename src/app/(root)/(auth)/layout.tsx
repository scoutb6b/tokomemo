import { Box } from "@mantine/core";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box w={375} mx="auto" mt={40}>
      {children}
    </Box>
  );
};

export default Layout;
