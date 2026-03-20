import { FormInput } from '@/components/form/form-input';
import { RichTextEditor } from '@/components/form/rich-text-editor';
import type { RichTextData } from '../../types/page-builder';

interface Props {
    data: RichTextData;
    onChange: (data: RichTextData) => void;
}

export function RichTextForm({ data, onChange }: Props) {
    return (
        <div className="space-y-4">
            <FormInput
                label="Title (optional)"
                value={data.title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
            />
            <RichTextEditor
                label="Body"
                value={data.body}
                onChange={(v) => onChange({ ...data, body: v })}
                minHeight="250px"
            />
        </div>
    );
}
