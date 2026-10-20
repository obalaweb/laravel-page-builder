import * as React from "react"
import { FormField } from "./form-field"
import type { TextareaProps } from "./textarea";
import { Textarea } from "./textarea"

interface FormTextareaProps extends TextareaProps {
  label?: string
  error?: string
}

export function FormTextarea({
  label,
  error,
  id,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <FormField label={label} error={error} id={id}>
      <Textarea
        id={id}
        className={className}
        {...props}
      />
    </FormField>
  )
}
