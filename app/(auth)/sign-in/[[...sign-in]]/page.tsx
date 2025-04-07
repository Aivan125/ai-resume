import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex h-dvh items-center justify-center p-3">
      <SignIn />
    </main>
  );
}
