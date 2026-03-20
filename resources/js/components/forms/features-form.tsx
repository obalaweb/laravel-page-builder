import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import type { FeaturesData, FeaturesItem } from '../../types/page-builder';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: FeaturesData;
    onChange: (data: FeaturesData) => void;
}

const blank = (): FeaturesItem => ({ icon: 'star', title: '', description: '' });

export function FeaturesForm({ data, onChange }: Props) {
    const setTop = <K extends keyof FeaturesData>(key: K, value: FeaturesData[K]) =>
        onChange({ ...data, [key]: value });

    const setItem = (index: number, patch: Partial<FeaturesItem>) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...data, items });
    };

    const addItem = () => onChange({ ...data, items: [...data.items, blank()] });

    const removeItem = (index: number) =>
        onChange({ ...data, items: data.items.filter((_, i) => i !== index) });

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => setTop('title', e.target.value)} />
            <FormInput label="Subtitle" value={data.subtitle} onChange={(e) => setTop('subtitle', e.target.value)} />

            <div className="space-y-3">
                <p className="text-sm font-medium">Feature Items</p>
                {data.items.map((item, i) => (
                    <div key={i} className="relative rounded-md border border-border bg-muted/30 p-3 space-y-2">
                        <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <FormInput
                            label="Icon name (lucide)"
                            value={item.icon}
                            onChange={(e) => setItem(i, { icon: e.target.value })}
                        />
                        <FormInput label="Title" value={item.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                        <FormTextarea
                            label="Description"
                            rows={2}
                            value={item.description}
                            onChange={(e) => setItem(i, { description: e.target.value })}
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-1 h-4 w-4" /> Add Feature
                </Button>
            </div>
        </div>
    );
}
