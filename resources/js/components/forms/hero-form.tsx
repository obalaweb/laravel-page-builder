import { FormInput } from '../ui/form-input';
import ImageUpload from '@media-library/components/image-upload';
import type { HeroData } from '../../types/page-builder';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface Props {
    data: HeroData;
    onChange: (data: HeroData) => void;
}

export function HeroForm({ data, onChange }: Props) {
    const set = <K extends keyof HeroData>(key: K, value: HeroData[K]) =>
        onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <FormInput label="Headline" value={data.headline} onChange={(e) => set('headline', e.target.value)} />
            <FormInput label="Subheadline" value={data.subheadline} onChange={(e) => set('subheadline', e.target.value)} />

            <ImageUpload
                label="Background Image"
                value={data.image_id}
                onChange={(id, url) => onChange({ ...data, image_id: id, image_url: url ?? null })}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Primary Button Text" value={data.primary_button_text} onChange={(e) => set('primary_button_text', e.target.value)} />
                <FormInput label="Primary Button URL" value={data.primary_button_url} onChange={(e) => set('primary_button_url', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Secondary Button Text" value={data.secondary_button_text} onChange={(e) => set('secondary_button_text', e.target.value)} />
                <FormInput label="Secondary Button URL" value={data.secondary_button_url} onChange={(e) => set('secondary_button_url', e.target.value)} />
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
