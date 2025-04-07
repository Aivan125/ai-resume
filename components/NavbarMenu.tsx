"use client";

import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const NavbarMenu = () => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Renderiza un placeholder mientras no esté montado
  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-gray-300"></div>;
  }

  return (
    <UserButton
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements: {
          userButtonAvatarBox: "h-10 w-10 border-2 border-primary",
          userButtonTrigger:
            "focus:shadow-outline rounded-full hover:shadow-md transition-shadow",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Billing"
          href="/billing"
          labelIcon={<CreditCard className="size-4" />}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default NavbarMenu;
