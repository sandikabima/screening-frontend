import React from "react";

export interface ColumnSkeletonConfig {
  width?: string;
  align?: "left" | "center" | "right";
  isIdentity?: boolean;
  isAction?: boolean;
}

interface TableRowSkeletonProps {
  columns: ColumnSkeletonConfig[];
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  columns,
}) => {
  return (
    <tr className="animate-pulse border-b border-zinc-900/60">
      {columns.map((col, idx) => {
        const alignClass =
          col.align === "center"
            ? "text-center"
            : col.align === "right"
              ? "text-right"
              : "text-left";

        const widthClass = col.width || "w-32";

        if (col.isIdentity) {
          return (
            <td key={idx} className={`py-3.5 px-4 ${widthClass}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 bg-zinc-900 rounded" />
                  <div className="h-2.5 w-44 bg-zinc-900/60 rounded" />
                </div>
              </div>
            </td>
          );
        }

        if (col.isAction) {
          return (
            <td key={idx} className={`py-3.5 px-4 ${widthClass} ${alignClass}`}>
              <div className="h-7 w-16 bg-zinc-900 border border-zinc-800 rounded ml-auto" />
            </td>
          );
        }

        return (
          <td key={idx} className={`py-3.5 px-4 ${widthClass} ${alignClass}`}>
            <div
              className={`h-4 bg-zinc-900 rounded ${
                col.align === "center"
                  ? "mx-auto w-20"
                  : col.align === "right"
                    ? "ml-auto w-24"
                    : "w-28"
              }`}
            />
          </td>
        );
      })}
    </tr>
  );
};
