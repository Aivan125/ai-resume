"use client";

import { SubscriptionLevel } from "@/lib/subscription";
import { createContext, ReactNode, useContext } from "react";

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined,
);

interface SubscriptionLevelProviderProps {
  children: ReactNode;
  userSubscriptionLevel: SubscriptionLevel;
}

const SubscriptionLevelProvider = ({
  userSubscriptionLevel,
  children,
}: SubscriptionLevelProviderProps) => {
  return (
    <SubscriptionLevelContext.Provider value={userSubscriptionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  );
};

const useSubscriptionLevel = () => {
  const contextValue = useContext(SubscriptionLevelContext);
  if (contextValue === undefined)
    throw new Error(
      "SubscriptionLevelContext was used outside of the SubscriptionLevelProvider",
    );
  return contextValue;
};

export { SubscriptionLevelProvider, useSubscriptionLevel };
