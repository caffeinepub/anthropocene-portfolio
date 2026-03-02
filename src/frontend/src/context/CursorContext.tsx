import { createContext, useContext, useState } from "react";

interface CursorContextType {
  isRevealed: boolean;
  setIsRevealed: (v: boolean) => void;
  isHoveringCTA: boolean;
  setIsHoveringCTA: (v: boolean) => void;
}

const CursorContext = createContext<CursorContextType>({
  isRevealed: false,
  setIsRevealed: () => {},
  isHoveringCTA: false,
  setIsHoveringCTA: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  return (
    <CursorContext.Provider
      value={{ isRevealed, setIsRevealed, isHoveringCTA, setIsHoveringCTA }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
