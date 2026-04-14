import { Head, useForm } from '@inertiajs/react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';


export default function CreatePage() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        status: 'draft',
        is_home: false,
    });

    const handleTitleChange = (value: string) => {
        setData((prev) => ({
            ...prev,
            title: value,
            slug: prev.slug || value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }));
    };

    return (
        <>
            <Head title="Add Page" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h1 className="text-2xl font-semibold">Add Page</h1>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/builder/pages');
                    }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="space-y-4 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} required />
                                {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                            </div>
                            <div className="flex items-end space-x-2 pb-2">
                                <Checkbox
                                    id="is_home"
                                    checked={data.is_home}
                                    onCheckedChange={(checked) => setData('is_home', checked as boolean)}
                                />
                                <Label htmlFor="is_home" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Set as Home Page
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Page'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreatePage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Pages', href: '/builder/pages' },
        { title: 'Add Page', href: '/builder/pages/create' },
    ],
};
