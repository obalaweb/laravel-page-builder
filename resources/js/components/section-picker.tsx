import { SECTION_DEFINITIONS, type SectionType } from '../types/page-builder';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    BarChart2,
    CircleHelp,
    Grid3x3,
    Image,
    Info,
    LayoutTemplate,
    MapPin,
    Megaphone,
    PlayCircle,
    Quote,
    Text,
    Users,
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
    'layout-template': LayoutTemplate,
    info: Info,
    'grid-3x3': Grid3x3,
    'bar-chart-2': BarChart2,
    users: Users,
    quote: Quote,
    megaphone: Megaphone,
    image: Image,
    'circle-help': CircleHelp,
    'map-pin': MapPin,
    text: Text,
    'play-circle': PlayCircle,
};

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (type: SectionType) => void;
}

export function SectionPicker({ open, onClose, onSelect }: Props) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Section</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {SECTION_DEFINITIONS.map((def) => {
                        const Icon = ICONS[def.icon] ?? LayoutTemplate;
                        return (
                            <button
                                key={def.type}
                                type="button"
                                onClick={() => {
                                    onSelect(def.type);
                                    onClose();
                                }}
                                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-accent"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{def.label}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{def.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end border-t border-border pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
