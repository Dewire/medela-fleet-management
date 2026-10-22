"use client";

import { Search } from "lucide-react";
import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** One row in a location suggestion list. */
type LocationOption = {
  label: string;
  value: string;
};

/**
 * Search field that lists matching places and fills the input when one is chosen.
 *
 * @param label - Visible field label
 * @param name - Form control name
 * @param value - Current text
 * @param placeholder - Hint shown while the field is empty
 * @param options - Matches for the current text
 * @param onChange - Receives text as it is typed
 * @param onSelect - Receives the value of a chosen suggestion
 */
export function LocationSearchField({
  label,
  name,
  value,
  placeholder,
  options,
  onChange,
  onSelect,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  options: readonly LocationOption[];
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const showList = open && options.length > 0;

  function choose(next: string) {
    onSelect(next);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className="h-auto rounded-[6px] bg-white py-2.5 pr-3 pl-9 placeholder:text-muted-foreground"
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            const first = options[0];
            if (event.key === "Enter" && showList && first) {
              event.preventDefault();
              choose(first.value);
            }
          }}
        />
        {showList ? (
          // Out of flow so opening matches does not change the dialog height.
          <ul
            id={listId}
            role="listbox"
            className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-[6px] border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-black/5"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(option.value);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
