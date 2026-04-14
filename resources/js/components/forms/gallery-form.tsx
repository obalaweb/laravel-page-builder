import { FormInput } from '../ui/form-input';
import { FormSelect } from '../ui/form-select';
import MediaSelector from '../media-selector';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import type { GalleryData } from '../../types/page-builder';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    data: GalleryData;
    onChange: (data: GalleryData) => void;
}

const columnOptions = [
    { id: '2', name: '2 Columns' },
    { id: '3', name: '3 Columns' },
    { id: '4', name: '4 Columns' },
];

export function GalleryForm({ data, onChange }: Props) {
    const [selectorOpen, setSelectorOpen] = useState(false);

    const addImage = (id: number, url: string) => {
        if (!id || !url) return;
        if (data.image_ids.includes(id)) return;
        onChange({
            ...data,
            image_ids: [...data.image_ids, id],
            image_urls: [...data.image_urls, url],
        });
    };

    const removeImage = (index: number) => {
        onChange({
            ...data,
            image_ids: data.image_ids.filter((_, i) => i !== index),
            image_urls: data.image_urls.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />

            <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-4 gap-2">
                    {data.image_urls.map((url, i) => (
                        <div key={i} className="relative aspect-square">
                            <img src={url} alt="" className="h-full w-full rounded object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
                    Add Image
                </Button>
                <MediaSelector
                    open={selectorOpen}
                    onOpenChange={setSelectorOpen}
                    onSelect={(id, url) => addImage(id, url)}
                />
            </div>

            <FormSelect
                label="Columns"
                value={String(data.columns)}
                onValueChange={(v) => onChange({ ...data, columns: Number(v) as GalleryData['columns'] })}
                options={columnOptions}
            />

            <div className="flex items-center gap-2">
                <Checkbox
                    id="lightbox"
                    checked={data.lightbox}
                    onCheckedChange={(v) => onChange({ ...data, lightbox: !!v })}
                />
                <Label htmlFor="lightbox">Enable lightbox on click</Label>
            </div>
        </div>
    );
}
