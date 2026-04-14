import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './ui/button';
import { SectionPicker } from './section-picker';
import { HeroForm } from './forms/hero-form';
import { AboutForm } from './forms/about-form';
import { FeaturesForm } from './forms/features-form';
import { StatsForm } from './forms/stats-form';
import { TeamForm } from './forms/team-form';
import { TestimonialsForm } from './forms/testimonials-form';
import { CtaForm } from './forms/cta-form';
import { GalleryForm } from './forms/gallery-form';
import { FaqForm } from './forms/faq-form';
import { ContactForm } from './forms/contact-form';
import { RichTextForm } from './forms/rich-text-form';
import { VideoForm } from './forms/video-form';
import { SECTION_DEFINITIONS, type PageSection, type SectionType, type SectionDataMap } from '../types/page-builder';
import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';

// ─── Section Form Router ───────────────────────────────────────────────────────

function SectionForm({ section, onChange }: { section: PageSection; onChange: (s: PageSection) => void }) {
    const update = (data: SectionDataMap[SectionType]) => onChange({ ...section, data } as PageSection);

    switch (section.type) {
        case 'hero': return <HeroForm data={section.data as SectionDataMap['hero']} onChange={update} />;
        case 'about': return <AboutForm data={section.data as SectionDataMap['about']} onChange={update} />;
        case 'features': return <FeaturesForm data={section.data as SectionDataMap['features']} onChange={update} />;
        case 'stats': return <StatsForm data={section.data as SectionDataMap['stats']} onChange={update} />;
        case 'team': return <TeamForm data={section.data as SectionDataMap['team']} onChange={update} />;
        case 'testimonials': return <TestimonialsForm data={section.data as SectionDataMap['testimonials']} onChange={update} />;
        case 'cta': return <CtaForm data={section.data as SectionDataMap['cta']} onChange={update} />;
        case 'gallery': return <GalleryForm data={section.data as SectionDataMap['gallery']} onChange={update} />;
        case 'faq': return <FaqForm data={section.data as SectionDataMap['faq']} onChange={update} />;
        case 'contact': return <ContactForm data={section.data as SectionDataMap['contact']} onChange={update} />;
        case 'rich_text': return <RichTextForm data={section.data as SectionDataMap['rich_text']} onChange={update} />;
        case 'video': return <VideoForm data={section.data as SectionDataMap['video']} onChange={update} />;
        default: return null;
    }
}

// ─── Sortable Section Card ─────────────────────────────────────────────────────

interface SortableCardProps {
    section: PageSection;
    onChange: (s: PageSection) => void;
    onRemove: () => void;
}

function SortableCard({ section, onChange, onRemove }: SortableCardProps) {
    const [expanded, setExpanded] = useState(false);
    const def = SECTION_DEFINITIONS.find((d) => d.type === section.type);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section._key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="rounded-lg border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-5 w-5" />
                </button>

                <div className="flex-1">
                    <p className="text-sm font-semibold">{def?.label ?? section.type}</p>
                    {!section.is_visible && (
                        <p className="text-xs text-muted-foreground">Hidden</p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onChange({ ...section, is_visible: !section.is_visible })}
                    className="text-muted-foreground hover:text-foreground"
                    title={section.is_visible ? 'Hide section' : 'Show section'}
                >
                    {section.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                <button
                    type="button"
                    onClick={onRemove}
                    className="text-muted-foreground hover:text-destructive"
                    title="Remove section"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
            </div>

            {/* Expanded form */}
            {expanded && (
                <div className="border-t border-border px-4 py-4">
                    <SectionForm section={section} onChange={onChange} />
                </div>
            )}
        </div>
    );
}

// ─── Section Editor ────────────────────────────────────────────────────────────

interface Props {
    sections: PageSection[];
    onChange: (sections: PageSection[]) => void;
}

export function SectionEditor({ sections, onChange }: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = sections.findIndex((s) => s._key === active.id);
        const newIndex = sections.findIndex((s) => s._key === over.id);
        const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
        onChange(reordered);
    };

    const addSection = (type: SectionType) => {
        const def = SECTION_DEFINITIONS.find((d) => d.type === type)!;
        const newSection: PageSection = {
            type,
            order: sections.length,
            data: structuredClone(def.defaultData) as SectionDataMap[typeof type],
            is_visible: true,
            _key: crypto.randomUUID(),
        };
        onChange([...sections, newSection]);
    };

    const updateSection = (key: string, updated: PageSection) => {
        onChange(sections.map((s) => (s._key === key ? updated : s)));
    };

    const removeSection = (key: string) => {
        onChange(sections.filter((s) => s._key !== key).map((s, i) => ({ ...s, order: i })));
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s._key)} strategy={verticalListSortingStrategy}>
                    {sections.map((section) => (
                        <SortableCard
                            key={section._key}
                            section={section}
                            onChange={(updated) => updateSection(section._key, updated)}
                            onRemove={() => removeSection(section._key)}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {sections.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-border py-10 text-center">
                    <p className="text-sm text-muted-foreground">No sections yet. Add your first section below.</p>
                </div>
            )}

            <Button type="button" variant="outline" className="w-full" onClick={() => setPickerOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Section
            </Button>

            <SectionPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={addSection} />
        </div>
    );
}
