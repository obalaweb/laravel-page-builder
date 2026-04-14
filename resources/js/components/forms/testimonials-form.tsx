import { FormTextarea } from '../ui/form-textarea';
import { FormInput } from '../ui/form-input';
import ImageUpload from '@media-library/components/image-upload';
import { Button } from '../ui/button';
import type { TestimonialsData, TestimonialItem } from '../../types/page-builder';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: TestimonialsData;
    onChange: (data: TestimonialsData) => void;
}

const blank = (): TestimonialItem => ({
    quote: '', author_name: '', author_role: '', author_image_id: null, author_image_url: null,
});

export function TestimonialsForm({ data, onChange }: Props) {
    const setItem = (index: number, patch: Partial<TestimonialItem>) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...data, items });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />

            <div className="space-y-3">
                <p className="text-sm font-medium">Testimonials</p>
                {data.items.map((item, i) => (
                    <div key={i} className="relative rounded-md border border-border bg-muted/30 p-3 space-y-2">
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) })}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <FormTextarea label="Quote" rows={3} value={item.quote} onChange={(e) => setItem(i, { quote: e.target.value })} />

                        <div className="grid grid-cols-2 gap-2">
                            <FormInput label="Author Name" value={item.author_name} onChange={(e) => setItem(i, { author_name: e.target.value })} />
                            <FormInput label="Author Role" value={item.author_role} onChange={(e) => setItem(i, { author_role: e.target.value })} />
                        </div>

                        <ImageUpload
                            label="Author Photo"
                            value={item.author_image_id}
                            onChange={(id, url) => setItem(i, { author_image_id: id, author_image_url: url ?? null })}
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, items: [...data.items, blank()] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Testimonial
                </Button>
            </div>
        </div>
    );
}
