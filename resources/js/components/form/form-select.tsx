import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField } from "./form-field"

interface Option {
  id: string | number
  name: string
}

interface FormSelectProps {
  label?: string
  error?: string
  id?: string
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: Option[]
  className?: string
  disabled?: boolean
}

export function FormSelect({
  label,
  error,
  id,
  value,
  onValueChange,
  placeholder = "Select an option",
  options,
  className,
  disabled,
}: FormSelectProps) {
  // Radix Select does not allow empty string as a value for SelectItem.
  // We map empty strings to a special internal value.
  const INTERNAL_EMPTY_VALUE = "___empty___";

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue === INTERNAL_EMPTY_VALUE ? "" : newValue);
    }
  };

  const safeValue = value === "" || value === null || value === undefined 
    ? (options.some(opt => opt.id === "" || opt.id === null) ? INTERNAL_EMPTY_VALUE : undefined)
    : value.toString();

  return (
    <FormField label={label} error={error} id={id} className={className}>
      <Select value={safeValue} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const isOptionEmpty = option.id === "" || option.id === null || option.id === undefined;
            const optionValue = isOptionEmpty ? INTERNAL_EMPTY_VALUE : option.id.toString();
            
            return (
              <SelectItem key={option.id ?? 'empty'} value={optionValue}>
                {option.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  )
}
