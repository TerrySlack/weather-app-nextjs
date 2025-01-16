import { Container } from "@/components/Container";
import { ReactNode } from "react";

interface ICard {
  children: ReactNode;
}
export const Card = ({ children }: ICard) => (
  <Container>
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  </Container>
);
