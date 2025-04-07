"use client";

import LoadingButton from "@/components/LoadingButton";
import { toast } from "sonner";
import { createCustomerPortalSession } from "../action";
import { useState } from "react";

const ManageSubscriptionButton = () => {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  }
  return (
    <LoadingButton onClick={handleClick} loading={loading} variant="premium">
      {" "}
      Manage subscription
    </LoadingButton>
  );
};

export default ManageSubscriptionButton;
