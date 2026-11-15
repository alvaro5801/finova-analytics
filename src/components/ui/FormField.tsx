import clsx from "clsx";

const inputClass =
  "w-full rounded-xl border border-line bg-sunken px-3 py-2.5 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-faint focus:border-primary/70 focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger/60";

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error)
    return (
      <p id={`${id}-error`} className="text-xs text-danger">
        {error}
      </p>
    );
  if (hint)
    return (
      <p id={`${id}-hint`} className="text-xs text-faint">
        {hint}
      </p>
    );
  return null;
}

const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

export function TextField({
  id,
  label,
  error,
  hint,
  className,
  ...inputProps
}: { id: string; label: string; error?: string; hint?: string } & React.ComponentProps<"input">) {
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={inputClass}
        {...inputProps}
      />
      <Message id={id} error={error} hint={hint} />
    </div>
  );
}

export function SelectInput({
  id,
  label,
  hint,
  options,
  ...selectProps
}: {
  id: string;
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
} & React.ComponentProps<"select">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted">
        {label}
      </label>
      <select id={id} aria-describedby={describedBy(id, undefined, hint)} className={inputClass} {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Message id={id} hint={hint} />
    </div>
  );
}
