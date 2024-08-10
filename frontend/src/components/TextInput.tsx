const TextInput = (props: React.ComponentProps<"input">) => {
  return (
    <input
      {...props}
      size={props.size || 10}
      className={`p-2 w-full box-border border-slate-700 focus:border-slate-300 border-0 bg-transparent text-white border-b-2 outline-none ${props.className}`}
    />
  );
};

export default TextInput;
