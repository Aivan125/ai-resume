import { useEffect } from "react";

// EEste hook llamado useUnloadWarning implementa una advertencia cuando el usuario intenta abandonar o recargar la página.antes de que se recargue la página se ejecuta este hook para lanza una advertence de que se está recargando al página.
export const useUnloadWarning = (condition = true) => {
  useEffect(() => {
    if (!condition) {
      return;
    }

    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", listener);

    return () => window.removeEventListener("beforeunload", listener);
  }, [condition]);
};
