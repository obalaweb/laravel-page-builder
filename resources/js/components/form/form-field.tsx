import * as React from "react"
import InputError from "@/components/input-error"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label?: string
  error?: string
  id?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  id,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children}
      {error && <InputError message={error} className="mt-2" />}
    </div>
  )
}
