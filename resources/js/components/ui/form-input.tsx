import React from 'react';
import { Label } from './label';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <Label className={cn(error && "text-destructive")}>{label}</Label>
            <Input 
                className={cn(
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )} 
                {...props} 
            />
            {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
        </div>
    );
}
