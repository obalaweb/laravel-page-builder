import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import type { FaqData, FaqItem } from '../../types/page-builder';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: FaqData;
    onChange: (data: FaqData) => void;
}

const blank = (): FaqItem => ({ question: '', answer: '' });

export function FaqForm({ data, onChange }: Props) {
    const setItem = (index: number, patch: Partial<FaqItem>) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...data, items });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
            <FormInput label="Subtitle" value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />

            <div className="space-y-3">
                <p className="text-sm font-medium">FAQ Items</p>
                {data.items.map((item, i) => (
                    <div key={i} className="relative rounded-md border border-border bg-muted/30 p-3 space-y-2">
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) })}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <FormInput label="Question" value={item.question} onChange={(e) => setItem(i, { question: e.target.value })} />
                        <FormTextarea label="Answer" rows={3} value={item.answer} onChange={(e) => setItem(i, { answer: e.target.value })} />
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, items: [...data.items, blank()] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Question
                </Button>
            </div>
        </div>
    );
}
