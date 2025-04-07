import { create } from "zustand";

interface PremiumModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const usePremiumModalStore = create<PremiumModalState>()((set) => ({
  // variable de estado
  open: false,

  // función que modifica el estado
  setOpen: (open) => set({ open }),
}));

export default usePremiumModalStore;
