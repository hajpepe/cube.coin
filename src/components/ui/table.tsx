"use client";

import { cn } from "@/lib/utils"; // Adjust this import path as necessary
import { ReactNode } from "react";

const Table = ({
  className,
  children,  // Include children in props
  ...props
}: { className?: string; children?: ReactNode }) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props}>
    {children}
  </thead>
);

const TableBody = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props}>
    {children}
  </tbody>
);

const TableFooter = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <tfoot
    className={cn(
      "border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-gray-800/50",
      className
    )}
    {...props}
  >
    {children}
  </tfoot>
);

const TableRow = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800",
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

const TableHead = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <th
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-gray-400",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

const TableCell = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <td
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

const TableCaption = ({
  className,
  children,
  ...props
}: { className?: string; children?: ReactNode }) => (
  <caption className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)} {...props}>
    {children}
  </caption>
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
