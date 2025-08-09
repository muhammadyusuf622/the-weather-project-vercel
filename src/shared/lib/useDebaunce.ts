import { useEffect, useState } from "react"


export const useDebaunce = (value: string, deley: number) => {
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setDebouncedValue(value)
    }, deley);

    return () => clearTimeout(timeOutId);
  }, [value, deley]);

  return debouncedValue;
}