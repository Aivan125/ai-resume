"use client";

import { Button } from "@/components/ui/button";
import usePremiumModalStore from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CreateResumeButton {
  canCreate: boolean;
}

const CreateResumeButton = ({ canCreate }: CreateResumeButton) => {
  const premiumModal = usePremiumModalStore();

  if (canCreate) {
    return (
      <Button
        asChild
        className="bg-primary mx-auto flex w-fit gap-2"
        variant={"default"}
      >
        <Link href={"/editor"}>
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2"
    >
      <PlusSquare className="size-5" />
      New Resume
    </Button>
  );
};

export default CreateResumeButton;
