import { Head, router } from '@inertiajs/react';
import { VisualPageBuilder } from '@page-builder/index';
import { toast } from 'sonner';

interface EditPageProps {
    page: any;
    sectionMetadata: any;
    previewUrl: string;
}

export default function EditPage({ page, sectionMetadata, previewUrl }: EditPageProps) {
    const handleSave = (data: any) => {
        router.put(`/builder/pages/${page.slug}`, data, {
            onSuccess: () => {
                toast.success('Page saved successfully');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError as string || 'Failed to save page');
            }
        });
    };

    return (
        <>
            <Head title={`Editing: ${page.title}`} />
            <VisualPageBuilder 
                page={page}
                sectionMetadata={sectionMetadata}
                previewUrl={previewUrl}
                onSave={handleSave}
                backUrl="/builder/pages"
            />
        </>
    );
}

// Disable default layout as we are building a custom fullscreen experience
EditPage.layout = (page: React.ReactNode) => page;
