import PremiumModal from "@/components/PremiumModal";
import Navbar from "../../components/Navbar";
import { auth } from "@clerk/nextjs/server";
import { SubscriptionLevelProvider } from "./SubscriptionLevelContext";
import { getUserSubscriptionLevel } from "@/lib/subscription";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const userSubscriptionLevel = await getUserSubscriptionLevel(userId);

  return (
    <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionLevelProvider>
  );
}
