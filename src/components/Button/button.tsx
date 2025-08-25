import { cn } from "@/lib/tailwind-merge";
import { ReactNode } from "react";


interface Props {
  children: ReactNode,
  type: "submit" | "button",
  className: string,
  onClick: Function,
  index?: number
}

const Button = ({children, type, className, onClick, index}: Props) => {
  return (
    <button
      type={type}
      className={cn(`h-fit w-fit rounded-lg shadow-inner hover:brightness-125 place-items-center`, className)}
      onClick={(e) => {
        if (index) return onClick(index);
        onClick(e);
      }}
    >
      {children}
    </button>
  )
}

export default Button;