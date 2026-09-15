import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type NativeSelectProps = {
  label?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
  compact?: boolean;
  highlightWhenSet?: boolean;
  className?: string;
  required?: boolean;
};

/**
 * Styled native select used on filter bars and publish forms. Native is used
 * (not the popup Select) so rows stay compact like the Figma prototype.
 *
 * The OS chevron sits on the trailing edge; `appearance-none` plus a custom
 * icon lets us inset it so it does not collide with a control beside the field.
 */
export function NativeSelect({
  label,
  name,
  value,
  defaultValue,
  onChange,
  options,
  compact = false,
  highlightWhenSet = false,
  className,
  required = false,
}: NativeSelectProps) {
  const isActive = highlightWhenSet && value !== undefined && value !== "all";

  return (
    <div className={cn("flex flex-col gap-1.5", compact && "flex-row items-center gap-1")}>
      {label ? (
        compact ? (
          <span className="text-xs font-medium text-muted-foreground">{label}:</span>
        ) : (
          <Label htmlFor={name} className="font-semibold text-foreground">
            {label}
          </Label>
        )
      ) : null}
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange ? (event) => onChange(event.target.value) : undefined}
          className={cn(
            "appearance-none rounded-[6px] border bg-white text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            compact ? "px-2 py-1 pr-7 text-xs" : "w-full px-3 py-2.5 pr-9 text-sm",
            isActive ? "border-primary font-semibold text-primary" : "border-border",
            className,
          )}
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}
