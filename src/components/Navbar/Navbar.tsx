import { MouseEvent, KeyboardEvent } from "react";
import Link from "next/link";
import React from "react";

import { ILink } from "@/types";

interface INavBar {
  links: ILink[];
  onLinkKeyUp: (path: string) => (e: KeyboardEvent<HTMLAnchorElement>) => void;
}

export const Navbar = ({ links, onLinkKeyUp }: INavBar) => {
  return (
    <nav className="bg-purple-600 p-4 flex justify-around">
      {links.map((link) => (
        <Link key={link.path} href={link.path}>
          <span
            onKeyUp={onLinkKeyUp(link.path)}
            className="text-white text-lg cursor-pointer"
          >
            {link.name}
          </span>
        </Link>
      ))}
    </nav>
  );
};
