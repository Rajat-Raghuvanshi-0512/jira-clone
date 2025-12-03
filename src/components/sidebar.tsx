import Link from "next/link";
import Image from "next/image";
import { DottedSeparator } from "./ui/dotted-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <span className="text-2xl font-bold">Jira Clone</span>
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};
