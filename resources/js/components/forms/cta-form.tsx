import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormSelect } from '@/components/form/form-select';
import type { CtaData } from '../../types/page-builder';

interface Props {
    data: CtaData;
    onChange: (data: CtaData) => void;
}

const bgOptions = [
    { id: 'primary', name: 'Primary Color' },
    { id: 'dark', name: 'Dark' },
    { id: 'light', name: 'Light' },
];

export function CtaForm({ data, onChange }: Props) {
    const set = <K extends keyof CtaData>(key: K, value: CtaData[K]) =>
        onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => set('title', e.target.value)} />
            <FormTextarea label="Description" rows={3} value={data.description} onChange={(e) => set('description', e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Primary Button Text" value={data.primary_button_text} onChange={(e) => set('primary_button_text', e.target.value)} />
                <FormInput label="Primary Button URL" value={data.primary_button_url} onChange={(e) => set('primary_button_url', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Secondary Button Text" value={data.secondary_button_text} onChange={(e) => set('secondary_button_text', e.target.value)} />
                <FormInput label="Secondary Button URL" value={data.secondary_button_url} onChange={(e) => set('secondary_button_url', e.target.value)} />
            </div>

            <FormSelect
                label="Background"
                value={data.background}
                onValueChange={(v) => set('background', v as CtaData['background'])}
                options={bgOptions}
            />
        </div>
    );
}
