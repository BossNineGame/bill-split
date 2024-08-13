import { useState } from "react";
import { twMerge } from "tailwind-merge";

const Input = (props: React.ComponentProps<"input">) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <input
      {...props}
      type={props.type || "text"}
      size={props.size || 10}
      autoComplete="off"
      className={twMerge(
        "p-2 w-full box-border border-slate-700 focus:border-slate-300 border-0 bg-transparent text-white border-b-2 outline-none",
        props.className
      )}
      readOnly={!isFocused}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default Input;
