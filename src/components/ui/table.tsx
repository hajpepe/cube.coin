"use client";

import { cn } from "@/lib/utils"; // Adjust this import path as necessary

const Table = ({ className, ...props }: { className?: string }) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }: { className?: string }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

const TableBody = ({ className, ...props }: { className?: string }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableFooter = ({ className, ...props }: { className?: string }) => (
  <tfoot
    className={cn(
      "border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-gray-800/50",
      className
    )}
    {...props}
  />
);

const TableRow = ({ className, ...props }: { className?: string }) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800",
      className
    )}
    {...props}
  />
);

const TableHead = ({ className, ...props }: { className?: string }) => (
  <th
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] dark:text-gray-400",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }: { className?: string }) => (
  <td
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
);

const TableCaption = ({ className, ...props }: { className?: string }) => (
  <caption
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
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
