import React, { ReactNode } from "react";
import c from "./index.module.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={c.mainLayout}>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
