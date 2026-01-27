import { useState, useCallback } from "react";

export const useModal = () => {
  const [isActive, setIsActive] = useState(false);

  const toggle = useCallback(() => setIsActive(prev => !prev), []);

  return { isActive , toggle };
};