import { ReactNode } from "react";

interface IContainer {
  children: ReactNode;
}
export const Container = ({ children }: IContainer) => (
  <div className="container mx-auto sm:px-6 lg:px-8">{children}</div>
);
