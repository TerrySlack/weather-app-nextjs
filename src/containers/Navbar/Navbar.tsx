import { memo, MouseEvent, KeyboardEvent } from "react";
import { useRouter } from "next/router";

import { Navbar } from "@/components/Navbar/Navbar";
import { ILink } from "@/types";

const links: ILink[] = [
  { name: "Weather", path: "/" },
  { name: "Images", path: "/images" },
];

const NavbarContainer = memo(() => {
  const router = useRouter();

  const onLinkKeyUp =
    (path: string) => (e: KeyboardEvent<HTMLAnchorElement>) => {
      if (e.key === "Enter") {
        router.push(path);
      }
    };

  return <Navbar links={links} onLinkKeyUp={onLinkKeyUp} />;
});

export { NavbarContainer as Navbar };
