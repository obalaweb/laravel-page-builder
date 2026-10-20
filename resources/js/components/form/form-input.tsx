import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "./form-field"

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label?: string
  error?: string
}

export function FormInput({
  label,
  error,
  id,
  className,
  ...props
}: FormInputProps) {
  return (
    <FormField label={label} error={error} id={id} className={className}>
      <Input id={id} {...props} />
    </FormField>
  )
}
