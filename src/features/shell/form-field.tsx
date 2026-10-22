import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

/**
 * Labeled text input used on auth and firmware forms.
 *
 * @param value - Controlled text, when the parent tracks the field
 * @param onChange - Receives the new text for a controlled field
 */
export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="h-auto rounded-[6px] bg-white px-3 py-2.5 placeholder:text-muted-foreground"
      />
    </div>
  );
}
