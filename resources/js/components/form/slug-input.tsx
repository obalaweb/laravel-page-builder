import * as React from 'react';
import { FormField } from './form-field';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/slugify';

interface SlugInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
    label?: string;
    error?: string;
    /** Current slug value */
    value: string;
    /** The title value to watch and auto-derive slug from */
    titleValue?: string;
    onChange: (value: string) => void;
}

export function SlugInput({
    label = 'Slug',
    error,
    id = 'slug',
    value,
    titleValue,
    onChange,
    ...props
}: SlugInputProps) {
    const prevTitleRef = React.useRef<string>(titleValue ?? '');
    const isDirtyRef = React.useRef<boolean>(false);

    // When the title changes and the slug hasn't been manually edited, sync it.
    React.useEffect(() => {
        if (titleValue === undefined) {
            return;
        }

        const prevSlugFromTitle = slugify(prevTitleRef.current);
        const currentSlugMatchesPrev = value === prevSlugFromTitle || value === '';

        // Only auto-update if slug still matches what would have been auto-generated,
        // so manual edits are preserved.
        if (!isDirtyRef.current || currentSlugMatchesPrev) {
            onChange(slugify(titleValue));
            isDirtyRef.current = false;
        }

        prevTitleRef.current = titleValue;
    }, [titleValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        isDirtyRef.current = true;
        onChange(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Normalise on blur so free-typed slugs are also clean.
        const cleaned = slugify(e.target.value);
        if (cleaned !== value) {
            onChange(cleaned);
        }
    };

    return (
        <FormField label={label} error={error} id={id}>
            <Input
                id={id}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                {...props}
            />
        </FormField>
    );
}
