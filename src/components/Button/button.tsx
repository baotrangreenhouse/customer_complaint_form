import { cn } from "@/lib/tailwind-merge";
import { ReactNode } from "react";


interface Props {
  children: ReactNode,
  className: string,
  onClick: Function,
  index: number
}

const Button = ({children, className, onClick, index}: Props) => {
  return (
    <button
      type="button"
      className={cn(`h-fit w-fit rounded-lg shadow-inner hover:brightness-125`, className)}
      onClick={(e) => onClick(index)}
    >
      {children}
    </button>
  )
}

export default Button;