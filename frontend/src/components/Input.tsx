import { twMerge } from "tailwind-merge";

const Input = (props: React.ComponentProps<"input">) => {
  return (
    <input
      {...props}
      type={props.type || "text"}
      size={props.size || 10}
      className={twMerge(
        "p-2 w-full box-border border-slate-700 focus:border-slate-300 border-0 bg-transparent text-white border-b-2 outline-none",
        props.className
      )}
    />
  );
};

export default Input;
