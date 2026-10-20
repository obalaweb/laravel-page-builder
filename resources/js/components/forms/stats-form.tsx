import { FormInput } from '../ui/form-input';
import { Button } from '../ui/button';
import type { StatsData, StatsItem } from '../../types/page-builder';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: StatsData;
    onChange: (data: StatsData) => void;
}

const blank = (): StatsItem => ({ number: '', suffix: '', label: '' });

export function StatsForm({ data, onChange }: Props) {
    const setItem = (index: number, patch: Partial<StatsItem>) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...data, items });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />

            <div className="space-y-3">
                <p className="text-sm font-medium">Stats</p>
                {data.items.map((item, i) => (
                    <div key={i} className="relative grid grid-cols-3 gap-2 rounded-md border border-border bg-muted/30 p-3">
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) })}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <FormInput label="Number" value={item.number} onChange={(e) => setItem(i, { number: e.target.value })} />
                        <FormInput label="Suffix" placeholder="+" value={item.suffix} onChange={(e) => setItem(i, { suffix: e.target.value })} />
                        <FormInput label="Label" value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} />
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, items: [...data.items, blank()] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Stat
                </Button>
            </div>
        </div>
    );
}
