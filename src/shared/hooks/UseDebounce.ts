import { useCallback, useRef, useEffect } from 'react';

export const useDebounce = (delay = 300, immediate = true) => {
  const debouncingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstCall = useRef(immediate);

  const debounce = useCallback(
    (func: () => void) => {
      // Primeira execução sem delay, se configurado
      if (isFirstCall.current) {
        isFirstCall.current = false;
        func();
      } else {
        // Limpa o timeout anterior, caso haja
        if (debouncingTimer.current) {
          clearTimeout(debouncingTimer.current);
        }

        // Configura o timeout para execução do callback
        debouncingTimer.current = setTimeout(() => {
          func();
        }, delay);
      }
    },
    [delay], // Dependência do delay
  );

  // Limpeza do timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (debouncingTimer.current) {
        clearTimeout(debouncingTimer.current);
      }
    };
  }, []);

  return { debounce };
};
