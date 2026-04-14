import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Home, Globe } from 'lucide-react';
import ConfirmModal from '../../../components/confirm-modal';
import { Button } from '../../../ui/button';
import { useConfirm } from '../../../hooks/use-confirm';

import { Badge } from '../../../ui/badge';

type PageRow = {
    id: number;
    slug: string;
    title: string;
    status: 'draft' | 'published';
    is_home: boolean;
};

export default function AdminPages({ pages }: { pages: PageRow[] }) {
    const { confirm, confirmModalProps } = useConfirm();

    return (
        <>
            <Head title="Pages" />
            <ConfirmModal {...confirmModalProps} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-3 sm:p-4">
                <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-sidebar-border">
                    <div>
                        <h1 className="text-2xl font-semibold">Pages</h1>
                        <p className="text-sm text-muted-foreground">Manage dynamic pages and their sections.</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/builder/pages/create">
                            <Plus className="mr-2 size-4" />
                            Add Page
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3 text-center">Home</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id} className="border-t border-sidebar-border/60 dark:border-sidebar-border">
                                        <td className="px-4 py-3 font-medium">
                                            <div className="flex flex-col">
                                                <span>{page.title}</span>
                                                <span className="text-xs text-muted-foreground font-mono">{page.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-accent">
                                            {page.is_home && <Home size={16} className="mx-auto" />}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                                                {page.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex flex-wrap justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/builder/pages/${page.slug}/edit`}>
                                                        <Edit className="mr-1 size-3.5" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        confirm({
                                                            title: 'Delete page?',
                                                            description: `"${page.title}" will be permanently deleted.`,
                                                            onConfirm: () => router.delete(`/builder/pages/${page.slug}`),
                                                        })
                                                    }
                                                    disabled={page.is_home}
                                                >
                                                    <Trash2 className="mr-1 size-3.5" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pages.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 py-12 text-center">
                        <p className="text-muted-foreground">No dynamic pages yet.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/builder/pages/create">
                                <Plus className="mr-2 size-4" />
                                Add First Page
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

AdminPages.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Pages', href: '/builder/pages' },
    ],
};
