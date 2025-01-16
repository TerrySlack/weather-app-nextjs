import { Navbar } from "@/containers/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
