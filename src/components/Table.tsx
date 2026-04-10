import { Children, type ReactNode } from "react";

export interface TableColumn {
  key: string;
  label: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableProps {
  columns: TableColumn[];
  children: ReactNode;
  emptyMessage: string;
  emptyColSpan: number;
  isLoading?: boolean;
  loadingMessage?: string;
}

export default function Table({
  columns,
  children,
  emptyMessage,
  emptyColSpan,
  isLoading = false,
  loadingMessage = "Loading data...",
}: TableProps) {
  const hasRows = Children.count(children) > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-700 border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className ?? "p-4 font-semibold"}
                onClick={column.onClick}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={emptyColSpan}
                className="p-8 text-center text-gray-500"
              >
                {loadingMessage}
              </td>
            </tr>
          ) : hasRows ? (
            children
          ) : (
            <tr>
              <td
                colSpan={emptyColSpan}
                className="p-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
