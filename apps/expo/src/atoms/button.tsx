import type { VariantProps } from "class-variance-authority";
import { Pressable, Text } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/style-utils";

const buttonVariants = cva(
  "inline-flex shrink-0 flex-row items-center justify-center gap-2 rounded-full whitespace-nowrap transition-all outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/90 shadow-xs",
        destructive: "bg-destructive shadow-xs",
        outline: "bg-background border-border border shadow-xs",
        secondary: "bg-secondary shadow-xs",
        ghost: "active:bg-accent",
        link: "",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  "text-sm font-bold whitespace-nowrap transition-all outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        secondary: "text-secondary-foreground",
        outline: "text-foreground",
        ghost: "text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Pressable> &
  VariantProps<typeof buttonVariants>) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function ButtonText({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof Text> &
  VariantProps<typeof buttonTextVariants>) {
  return (
    <Text
      className={cn(buttonTextVariants({ variant, className }))}
      {...props}
    />
  );
}

export { buttonVariants, buttonTextVariants };
export { Button, ButtonText };
