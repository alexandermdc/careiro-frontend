import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm md:text-sm font-medium transition-colors transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-input bg-background shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 md:h-9 px-4 md:px-4 py-2 min-h-[44px] md:min-h-0",
        sm: "h-9 md:h-8 rounded-md px-3 text-xs min-h-[40px] md:min-h-0",
        lg: "h-12 md:h-10 rounded-md px-6 md:px-8 min-h-[48px] md:min-h-0",
        icon: "h-10 w-10 md:h-9 md:w-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
