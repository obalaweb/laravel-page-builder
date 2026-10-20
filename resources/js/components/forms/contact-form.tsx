import { FormInput } from '../ui/form-input';
import { FormTextarea } from '../ui/form-textarea';
import type { ContactData } from '../../types/page-builder';

interface Props {
    data: ContactData;
    onChange: (data: ContactData) => void;
}

export function ContactForm({ data, onChange }: Props) {
    const set = <K extends keyof ContactData>(key: K, value: ContactData[K]) =>
        onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => set('title', e.target.value)} />
            <FormInput label="Subtitle" value={data.subtitle} onChange={(e) => set('subtitle', e.target.value)} />

            <div className="grid grid-cols-2 gap-4">
                <FormInput label="Email" type="email" value={data.email} onChange={(e) => set('email', e.target.value)} />
                <FormInput label="Phone" value={data.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>

            <FormTextarea label="Address" rows={2} value={data.address} onChange={(e) => set('address', e.target.value)} />
            <FormInput label="Map Embed URL" value={data.map_embed_url} onChange={(e) => set('map_embed_url', e.target.value)} />
        </div>
    );
}
