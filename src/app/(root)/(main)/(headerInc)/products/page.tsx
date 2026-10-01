import { Box } from "@mantine/core";
import { PageTransition } from "@/app/_components/PageTransition";
import { AddIcon } from "./_components/AddIcon";
import { Tab } from "./_components/Tab";

const ProductPage = () => {
  return (
    <PageTransition>
      <Box mb={80}>
        <Tab />
        <AddIcon />
      </Box>
    </PageTransition>
  );
};

export default ProductPage;
