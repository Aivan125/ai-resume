import logo from "@/assets/logo.png";
import NavbarMenu from "@/components/NavbarMenu";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-3">
        <Link href={"/resumes"}>
          <Image
            src={logo}
            alt="logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">
            AI Resume Builder
          </span>
        </Link>
        <div className="flex items-center justify-center gap-3">
          <ThemeToggle />

          <NavbarMenu />
        </div>
      </div>
    </header>
  );
}
