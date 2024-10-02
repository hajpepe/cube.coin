"use client";
import { cn } from "@/lib/utils"; // Adjust this path based on your project structure
import { ReactNode } from "react"; // Import ReactNode type

// Add children to the component props
const Card = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <div
    className={cn(
      "rounded-xl border text-gray-950 shadow dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  >
    {children} {/* Render children inside the Card */}
  </div>
);

const CardHeader = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
