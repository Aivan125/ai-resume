"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { PaletteIcon } from "lucide-react";
import React, { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../../SubscriptionLevelContext";
import usePremiumModalStore from "@/hooks/usePremiumModal";
import { canUseCustomizations } from "@/lib/permissions";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const subscriptionLevel = useSubscriptionLevel();
  const premiumModal = usePremiumModalStore();
  const [showPopover, setShowpopover] = useState(false);
  return (
    <Popover open={showPopover} onOpenChange={setShowpopover}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          title="Change resume color"
          onClick={() => {
            if (!canUseCustomizations(subscriptionLevel)) {
              premiumModal.setOpen(true);
              return;
            }
            setShowpopover(true);
          }}
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-none bg-transparent shadow-none"
        align="end"
      >
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
