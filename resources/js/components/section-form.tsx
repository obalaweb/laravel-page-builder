import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import ImageUpload from '@media-library/components/image-upload';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from './rich-text-editor';

interface SectionFormProps {
    type: string;
    data: any;
    onChange: (data: any) => void;
    metadata: {
        requiredFields: Record<string, string[]>;
        imageFields: Record<string, string[]>;
        types: string[];
    };
}

export function SectionForm({ type, data, onChange, metadata }: SectionFormProps) {
    const requiredFields = metadata.requiredFields[type] || [];
    const imageFields = metadata.imageFields[type] || [];

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // Special handling for common list-based sections (features, stats, testimonials)
    const isListSection = ['features', 'stats', 'testimonials', 'gallery', 'faq'].includes(type);

    if (isListSection) {
        const items = data.items || [];
        
        const addItem = () => {
            const newItem = type === 'stats' ? { num: '', label: '' } : { title: '', desc: '' };
            handleChange('items', [...items, newItem]);
        };

        const updateItem = (index: number, field: string, value: string) => {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], [field]: value };
            handleChange('items', newItems);
        };

        const removeItem = (index: number) => {
            handleChange('items', items.filter((_: any, i: number) => i !== index));
        };

        return (
            <div className="space-y-4">
                {(type === 'features' || type === 'gallery') && (
                    <div className="space-y-1.5">
                        <Label>Section Title</Label>
                        <Input 
                            value={data.title || ''} 
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g. Why Choose Us"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">List Items</Label>
                    <div className="space-y-3">
                        {items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-3 items-start p-3 border rounded bg-muted/10 relative group">
                                <div className="flex-1 grid grid-cols-1 gap-2">
                                    {type === 'stats' ? (
                                        <>
                                            <Input 
                                                value={item.num} 
                                                onChange={(e) => updateItem(i, 'num', e.target.value)}
                                                placeholder="Number (e.g. 5K+)"
                                            />
                                            <Input 
                                                value={item.label} 
                                                onChange={(e) => updateItem(i, 'label', e.target.value)}
                                                placeholder="Label (e.g. Clients)"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Input 
                                                value={item.title} 
                                                onChange={(e) => updateItem(i, 'title', e.target.value)}
                                                placeholder="Title"
                                            />
                                            <RichTextEditor 
                                                value={item.desc} 
                                                onChange={(val) => updateItem(i, 'desc', val)}
                                            />
                                        </>
                                    )}
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                                    onClick={() => removeItem(i)}
                                >
                                    <Trash2 size={14} className="text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full mt-2 border-dashed">
                        <Plus size={14} className="mr-1" />
                        Add Item
                    </Button>
                </div>
            </div>
        );
    }

    // Default form generator for other types (hero, cta, rich_text, etc.)
    return (
        <div className="space-y-4">
            {requiredFields.map(field => {
                if (imageFields.includes(field)) {
                    return (
                        <div key={field} className="space-y-1.5">
                            <Label>{field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Label>
                            <ImageUpload 
                                value={data[field]} 
                                onChange={(id) => handleChange(field, id)}
                            />
                        </div>
                    );
                }

                const isRichText = ['description', 'body', 'content', 'headline'].includes(field.toLowerCase());

                return (
                    <div key={field} className="space-y-1.5">
                        <Label>{field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Label>
                        {isRichText ? (
                            <RichTextEditor 
                                value={data[field] || ''} 
                                onChange={(val) => handleChange(field, val)}
                            />
                        ) : (
                            <Input 
                                value={data[field] || ''} 
                                onChange={(e) => handleChange(field, e.target.value)}
                            />
                        )}
                    </div>
                );
            })}

            {/* Handle non-required but common fields (like CTAs in Hero) */}
            {type === 'hero' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>CTA Text</Label>
                            <Input value={data.cta_text || ''} onChange={(e) => handleChange('cta_text', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>CTA Link</Label>
                            <Input value={data.cta_link || ''} onChange={(e) => handleChange('cta_link', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Secondary CTA Text</Label>
                            <Input value={data.secondary_cta_text || ''} onChange={(e) => handleChange('secondary_cta_text', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Secondary CTA Link</Label>
                            <Input value={data.secondary_cta_link || ''} onChange={(e) => handleChange('secondary_cta_link', e.target.value)} />
                        </div>
                    </div>
                </>
            )}

            {type === 'cta' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>Button Text</Label>
                        <Input value={data.button_text || ''} onChange={(e) => handleChange('button_text', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Button Link</Label>
                        <Input value={data.button_link || ''} onChange={(e) => handleChange('button_link', e.target.value)} />
                    </div>
                </div>
            )}
        </div>
    );
}
