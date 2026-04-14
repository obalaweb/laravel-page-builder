import { FormInput } from '../ui/form-input';
import { RichTextEditor } from '../rich-text-editor';
import ImageUpload from '../image-upload';
import { FormSelect } from '../ui/form-select';
import type { AboutData } from '../../types/page-builder';

interface Props {
    data: AboutData;
    onChange: (data: AboutData) => void;
}

const layoutOptions = [
    { id: 'image-right', name: 'Image Right' },
    { id: 'image-left', name: 'Image Left' },
];

export function AboutForm({ data, onChange }: Props) {
    const set = <K extends keyof AboutData>(key: K, value: AboutData[K]) =>
        onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => set('title', e.target.value)} />

            <RichTextEditor
                label="Body"
                value={data.body}
                onChange={(v) => set('body', v)}
                minHeight="200px"
            />

            <ImageUpload
                label="Image"
                value={data.image_id}
                onChange={(id, url) => onChange({ ...data, image_id: id, image_url: url ?? null })}
            />

            <FormSelect
                label="Image Layout"
                value={data.layout}
                onValueChange={(v) => set('layout', v as AboutData['layout'])}
                options={layoutOptions}
            />
        </div>
    );
}
