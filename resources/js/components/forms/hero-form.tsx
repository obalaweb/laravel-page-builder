import { FormInput } from '../ui/form-input';
import ImageUpload from '@media-library/components/image-upload';
import type { HeroData, HeroSlideItem } from '../../types/page-builder';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: HeroData;
    onChange: (data: HeroData) => void;
}

const blankSlide = (): HeroSlideItem => ({
    image_id: null,
    image_url: null,
    headline: '',
    subheadline: '',
    description: '',
});

export function HeroForm({ data, onChange }: Props) {
    const set = <K extends keyof HeroData>(key: K, value: HeroData[K]) => onChange({ ...data, [key]: value });

    const slides = data.slides ?? [];

    const setSlide = (index: number, patch: Partial<HeroSlideItem>) => {
        const next = slides.map((item, i) => (i === index ? { ...item, ...patch } : item));
        set('slides', next);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-md border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Single image vs carousel</p>
                <p className="mt-1">
                    Use the fields below for one static hero. Add <strong>slides</strong> for a multi-slide hero (each
                    slide has its own image and text). When at least one slide has an image, those slides take
                    precedence over the single background image for carousel-style homepages.
                </p>
            </div>

            <FormInput label="Headline" value={data.headline} onChange={(e) => set('headline', e.target.value)} />
            <FormInput label="Subheadline" value={data.subheadline} onChange={(e) => set('subheadline', e.target.value)} />

            <ImageUpload
                label="Background Image (single-hero mode)"
                value={data.image_id}
                onChange={(id, url) => onChange({ ...data, image_id: id, image_url: url ?? null })}
            />

            <div className="space-y-3">
                <p className="text-sm font-medium">Carousel slides</p>
                {slides.map((item, i) => (
                    <div key={i} className="relative space-y-3 rounded-md border border-border bg-muted/30 p-3 pt-8">
                        <button
                            type="button"
                            onClick={() => set('slides', slides.filter((_, idx) => idx !== i))}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                            title="Remove slide"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <ImageUpload
                            label={`Slide ${i + 1} image`}
                            value={item.image_id}
                            onChange={(id, url) => setSlide(i, { image_id: id, image_url: url ?? null })}
                        />
                        <FormInput label="Headline" value={item.headline} onChange={(e) => setSlide(i, { headline: e.target.value })} />
                        <FormInput
                            label="Subheadline"
                            value={item.subheadline}
                            onChange={(e) => setSlide(i, { subheadline: e.target.value })}
                        />
                        <FormInput
                            label="Description (optional)"
                            value={item.description ?? ''}
                            onChange={(e) => setSlide(i, { description: e.target.value })}
                        />
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => set('slides', [...slides, blankSlide()])}>
                    <Plus className="mr-1 h-4 w-4" /> Add slide
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Primary Button Text" value={data.primary_button_text} onChange={(e) => set('primary_button_text', e.target.value)} />
                <FormInput label="Primary Button URL" value={data.primary_button_url} onChange={(e) => set('primary_button_url', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    label="Secondary Button Text"
                    value={data.secondary_button_text}
                    onChange={(e) => set('secondary_button_text', e.target.value)}
                />
                <FormInput
                    label="Secondary Button URL"
                    value={data.secondary_button_url}
                    onChange={(e) => set('secondary_button_url', e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label>Overlay Opacity ({data.overlay_opacity}%)</Label>
                <Input
                    type="range"
                    min={0}
                    max={90}
                    step={5}
                    value={data.overlay_opacity}
                    onChange={(e) => set('overlay_opacity', Number(e.target.value))}
                    className="h-2 cursor-pointer"
                />
            </div>
        </div>
    );
}
