import React from 'react';
import { Label } from './label';
import { cn } from '../../lib/utils';

// Simple internal textarea to avoid importing more UI components if not needed
// but we'll use a styled version consistent with our design
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export function FormTextarea({ label, error, className, ...props }: FormTextareaProps) {
    return (
        <div className="space-y-1.5">
            <Label className={cn(error && "text-destructive")}>{label}</Label>
            <textarea 
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )} 
                {...props} 
            />
            {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
        </div>
    );
}
