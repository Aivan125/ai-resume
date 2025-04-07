import { useEffect, useState } from "react";

// El generic T puede aceptar cualqier tipo por lo que estamos diciendo que el valor recibido puede ser de cualquier tipok por lo que al llamar al hook debemos especificar el tipo de dato a enviar a la función,
const useDebounce = <T>(value: T, delay: number = 250) => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, value]);

  return debounceValue;
};

export default useDebounce;

// Ejemplo de genérico para entender mejor la función
// T: para poder darle varios tipos de tipos sin usar el |
function identity<T>(value: T) {
  return value;
}

identity<string>("hello");
identity<number>(123);
identity<boolean>(true);
