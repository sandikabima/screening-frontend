import { useState } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}{" "}
      {visible && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-200 rounded shadow-lg whitespace-nowrap z-50 font-mono">
          {text}
        </div>
      )}
    </div>
  );
};
