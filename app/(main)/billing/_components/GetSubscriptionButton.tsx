"use client";

import { Button } from "@/components/ui/button";
import usePremiumModalStore from "@/hooks/usePremiumModal";

const GetSubscriptionButton = () => {
  const premiumModal = usePremiumModalStore();
  return (
    <Button onClick={() => premiumModal.setOpen(true)} variant={"premium"}>
      Get Premium Subscription
    </Button>
  );
};

export default GetSubscriptionButton;
