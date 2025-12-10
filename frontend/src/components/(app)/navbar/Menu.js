// components/Menu.js
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaHotel,
  FaCompass,
  FaNewspaper,
  FaEnvelope,
} from "react-icons/fa";

const Menu = ({ mobile = false }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Accueil", link: "/", icon: FaHome },
    { name: "Logement", link: "/listings", icon: FaHotel },
    { name: "Excursion", link: "/excursion", icon: FaCompass },
    { name: "Articles", link: "/blog", icon: FaNewspaper },
    { name: "Contact", link: "/contact", icon: FaEnvelope },
  ];

  if (mobile) {
    return (
      <div className="flex flex-col px-2 py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.link;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.link}
              className={`flex items-center rounded-xl gap-3 p-3 text-sm font-semibold transition-all ${
                isActive
                  ? " text-black shadow-md"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              <Icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.link;

        return (
          <Link
            key={item.name}
            href={item.link}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all relative group ${
              isActive ? "text-black" : "text-neutral-700 hover:text-black"
            }`}
          >
            {item.name}
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-all duration-300 ${
                isActive
                  ? "w-full"
                  : "w-0 group-hover:w-full group-hover:left-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Menu;
