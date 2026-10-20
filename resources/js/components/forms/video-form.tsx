import { FormInput } from '../ui/form-input';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import type { VideoData } from '../../types/page-builder';

interface Props {
    data: VideoData;
    onChange: (data: VideoData) => void;
}

export function VideoForm({ data, onChange }: Props) {
    const set = <K extends keyof VideoData>(key: K, value: VideoData[K]) =>
        onChange({ ...data, [key]: value });

    return (
        <div className="space-y-4">
            <FormInput label="Title (optional)" value={data.title} onChange={(e) => set('title', e.target.value)} />
            <FormInput
                label="Video URL"
                placeholder="https://www.youtube.com/watch?v=..."
                value={data.url}
                onChange={(e) => set('url', e.target.value)}
            />
            <FormInput label="Caption" value={data.caption} onChange={(e) => set('caption', e.target.value)} />
            <div className="flex items-center gap-2">
                <Checkbox
                    id="autoplay"
                    checked={data.autoplay}
                    onCheckedChange={(v) => set('autoplay', !!v)}
                />
                <Label htmlFor="autoplay">Autoplay (muted)</Label>
            </div>
        </div>
    );
}
