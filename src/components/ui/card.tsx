"use client";
import { cn } from "@/lib/utils"; // Adjust this path based on your project structure

const Card = ({ className, ...props }: { className?: string }) => (
  <div
    className={cn(
      "rounded-xl  border  text-gray-950 shadow dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: { className?: string }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }: { className?: string }) => (
  <h3
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }: { className?: string }) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
);

const CardContent = ({ className, ...props }: { className?: string }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }: { className?: string }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
