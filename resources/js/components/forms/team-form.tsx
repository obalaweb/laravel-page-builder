import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import ImageUpload from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import type { TeamData, TeamItem } from '../../types/page-builder';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    data: TeamData;
    onChange: (data: TeamData) => void;
}

const blank = (): TeamItem => ({
    name: '', role: '', bio: '', image_id: null, image_url: null, linkedin: '', twitter: '',
});

export function TeamForm({ data, onChange }: Props) {
    const setItem = (index: number, patch: Partial<TeamItem>) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange({ ...data, items });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
            <FormInput label="Subtitle" value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />

            <div className="space-y-3">
                <p className="text-sm font-medium">Team Members</p>
                {data.items.map((item, i) => (
                    <div key={i} className="relative rounded-md border border-border bg-muted/30 p-3 space-y-2">
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) })}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <FormInput label="Name" value={item.name} onChange={(e) => setItem(i, { name: e.target.value })} />
                            <FormInput label="Role / Title" value={item.role} onChange={(e) => setItem(i, { role: e.target.value })} />
                        </div>

                        <FormTextarea label="Bio" rows={2} value={item.bio} onChange={(e) => setItem(i, { bio: e.target.value })} />

                        <ImageUpload
                            label="Photo"
                            value={item.image_id}
                            onChange={(id, url) => setItem(i, { image_id: id, image_url: url ?? null })}
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <FormInput label="LinkedIn URL" value={item.linkedin} onChange={(e) => setItem(i, { linkedin: e.target.value })} />
                            <FormInput label="Twitter URL" value={item.twitter} onChange={(e) => setItem(i, { twitter: e.target.value })} />
                        </div>
                    </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, items: [...data.items, blank()] })}>
                    <Plus className="mr-1 h-4 w-4" /> Add Member
                </Button>
            </div>
        </div>
    );
}
