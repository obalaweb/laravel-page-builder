import React from 'react';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../../lib/utils';

interface FormSelectProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    options: any[]; // Changed to any[] to handle different object shapes
    error?: string;
    className?: string;
}

export function FormSelect({ label, value, onValueChange, placeholder, options, error, className }: FormSelectProps) {
    return (
        <div className="space-y-1.5">
            <Label className={cn(error && "text-destructive")}>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className={cn(
                    error && "border-destructive focus:ring-destructive",
                    className
                )}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt, i) => {
                        const val = opt.value || opt.id || String(i);
                        const lbl = opt.label || opt.name || val;
                        return (
                            <SelectItem key={val} value={val}>
                                {lbl}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
        </div>
    );
}
