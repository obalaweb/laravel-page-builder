import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Plus, Trash2, ChevronUp, ChevronDown, ListOrdered, GripVertical, Info } from 'lucide-react';
import { SectionForm } from './section-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Separator } from './ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Section {
    id: string | number;
    type: string;
    data: any;
    order: number;
}

interface SectionManagerProps {
    sections: Section[];
    onChange: (sections: Section[]) => void;
    metadata: {
        requiredFields: Record<string, string[]>;
        imageFields: Record<string, string[]>;
        types: string[];
    };
    previewRef: React.RefObject<HTMLIFrameElement>;
}

function SortableSectionItem({ 
    section, 
    index, 
    total, 
    isActive, 
    onToggle, 
    onRemove, 
    onUpdateData, 
    onMove,
    metadata 
}: { 
    section: Section; 
    index: number; 
    total: number;
    isActive: boolean; 
    onToggle: (open: boolean) => void; 
    onRemove: () => void;
    onUpdateData: (data: any) => void;
    onMove: (direction: 'up' | 'down') => void;
    metadata: SectionManagerProps['metadata'];
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative", isDragging && "z-50")}>
            <Collapsible 
                open={isActive}
                onOpenChange={onToggle}
                className={cn(
                    "border rounded-xl transition-all duration-300 overflow-hidden",
                    isActive 
                        ? "bg-background shadow-xl border-primary/20 ring-1 ring-primary/10 -mx-1 scale-[1.02] z-10" 
                        : "bg-background/40 hover:bg-background shadow-sm border-border/50",
                    isDragging && "opacity-50 border-primary"
                )}
            >
                <div className={cn(
                    "flex items-center px-4 py-3 cursor-pointer select-none group",
                    isActive ? "bg-primary/5" : "bg-transparent"
                )}>
                    {/* Drag Handle */}
                    <div 
                        {...attributes} 
                        {...listeners} 
                        className="mr-3 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-primary transition-colors"
                    >
                        <GripVertical size={16} />
                    </div>

                    <CollapsibleTrigger asChild>
                        <div className="flex-1 flex items-center gap-3">
                            <div className={cn(
                                "flex items-center justify-center size-8 rounded-lg border shadow-sm transition-colors",
                                isActive ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground"
                            )}>
                                <span className="text-[10px] font-bold">{index + 1}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-[11px] font-bold uppercase tracking-widest",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {section.type}
                                </span>
                                <span className="text-[10px] text-muted-foreground/60 font-medium">
                                    {section.type === 'hero' ? 'Page Header' : 
                                     section.type === 'stats' ? 'Key Metrics' :
                                     section.type === 'features' ? 'Selling Points' :
                                     section.type === 'cta' ? 'Conversion Zone' : 'Content Block'}
                                </span>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    
                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="size-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30" 
                            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                            disabled={index === 0}
                        >
                            <ChevronUp size={14} />
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="size-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30" 
                            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                            disabled={index === total - 1}
                        >
                            <ChevronDown size={14} />
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="size-7 rounded-full text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors" 
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>

                <CollapsibleContent>
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 border-t bg-muted/5 space-y-6"
                    >
                        <SectionForm 
                            type={section.type}
                            data={section.data}
                            onChange={onUpdateData}
                            metadata={metadata}
                        />
                    </motion.div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

export function SectionManager({ sections, onChange, metadata, previewRef }: SectionManagerProps) {
    const [activeSection, setActiveSection] = useState<string | number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Sync with preview iframe
    useEffect(() => {
        if (previewRef.current && previewRef.current.contentWindow) {
            const sectionsCopy = JSON.parse(JSON.stringify(sections));
            previewRef.current.contentWindow.postMessage(
                { type: 'UPDATE_SECTIONS', sections: sectionsCopy },
                '*'
            );
        }
    }, [sections]);

    const addSection = (type: string) => {
        const newSection: Section = {
            id: `new-${Date.now()}`,
            type,
            data: {},
            order: sections.length + 1,
        };
        
        metadata.requiredFields[type]?.forEach(field => {
            newSection.data[field] = '';
        });
        
        onChange([...sections, newSection]);
        setActiveSection(newSection.id);
    };

    const removeSection = (id: string | number) => {
        const newSections = sections.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }));
        onChange(newSections);
    };

    const updateSectionData = (id: string | number, newData: any) => {
        const updatedSections = sections.map(s => (s.id === id ? { ...s, data: newData } : s));
        onChange(updatedSections);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);

            const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
                ...s,
                order: i + 1,
            }));

            onChange(newSections);
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        
        onChange(newSections.map((s, i) => ({ ...s, order: i + 1 })));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium flex items-center gap-2">
                    <ListOrdered size={20} className="text-primary" />
                    Page Sections
                </h2>
                
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="h-8 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-[11px] font-bold uppercase tracking-wider">
                                <Plus size={14} className="mr-1" />
                                Add Section
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase py-2 px-2 tracking-[0.2em]">Select Section Type</div>
                            {metadata.types.map(type => (
                                <DropdownMenuItem key={type} onClick={() => addSection(type)} className="text-[11px] font-semibold py-2">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator className="opacity-50" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-3 relative min-h-[100px]">
                    {sections.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20 border-border/50">
                            <div className="flex justify-center mb-3">
                                <Info size={32} className="text-muted-foreground/30" />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">Your page layout is empty.</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">Start by adding a Hero section.</p>
                        </div>
                    )}

                    <SortableContext
                        items={sections.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <AnimatePresence initial={false}>
                            {sections.map((section, index) => (
                                <motion.div
                                    key={section.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SortableSectionItem 
                                        section={section}
                                        index={index}
                                        total={sections.length}
                                        isActive={activeSection === section.id}
                                        onToggle={(open) => setActiveSection(open ? section.id : null)}
                                        onRemove={() => removeSection(section.id)}
                                        onUpdateData={(data) => updateSectionData(section.id, data)}
                                        onMove={(dir) => moveSection(index, dir)}
                                        metadata={metadata}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
}
