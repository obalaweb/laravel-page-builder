import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { 
    Maximize2, 
    Minimize2, 
    Save, 
    ArrowLeft, 
    ExternalLink, 
    Smartphone, 
    Monitor, 
    GripVertical 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { SectionManager } from './section-manager';
import { cn } from '../lib/utils';
import { PageSection, SectionDefinition } from '../types/page-builder';

interface VisualPageBuilderProps {
    page: {
        title: string;
        slug: string;
        status: 'draft' | 'published';
        is_home: boolean;
        sections: PageSection[];
    };
    sectionMetadata: {
        types: string[];
        requiredFields: Record<string, string[]>;
    };
    previewUrl: string;
    onSave: (data: any) => void;
    processing?: boolean;
    errors?: Record<string, string>;
    backUrl?: string;
}

export function VisualPageBuilder({ 
    page, 
    sectionMetadata, 
    previewUrl, 
    onSave, 
    processing, 
    errors = {}, 
    backUrl = '/admin/pages' 
}: VisualPageBuilderProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
    const [data, setData] = useState({
        title: page.title,
        slug: page.slug,
        status: page.status,
        is_home: page.is_home,
        sections: page.sections,
    });
    
    const [previewHeight, setPreviewHeight] = useState(800);
    const previewRef = useRef<HTMLIFrameElement>(null);

    // Initial sync and BroadcastChannel setup
    useEffect(() => {
        const channel = new BroadcastChannel('page-builder-preview');
        
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'PREVIEW_READY') {
                // Send current sections to the newly ready iframe
                if (previewRef.current?.contentWindow) {
                    previewRef.current.contentWindow.postMessage(
                        { type: 'UPDATE_SECTIONS', sections: data.sections },
                        '*'
                    );
                }
            } else if (event.data?.type === 'UPDATE_HEIGHT') {
                const newHeight = event.data.height;
                setPreviewHeight(current => {
                    if (Math.abs(current - newHeight) > 5) {
                        return newHeight;
                    }
                    return current;
                });
            }
        };

        channel.onmessage = (event) => {
            if (event.data?.type === 'UPDATE_HEIGHT') {
                const newHeight = event.data.height;
                setPreviewHeight(current => {
                    if (Math.abs(current - newHeight) > 5) {
                        return newHeight;
                    }
                    return current;
                });
            }
        };

        window.addEventListener('message', handleMessage);

        // Sync to channel on start (for external tabs already open)
        channel.postMessage({ type: 'UPDATE_SECTIONS', sections: data.sections });

        return () => {
            window.removeEventListener('message', handleMessage);
            channel.close();
        };
    }, []);

    // Sync sections to listeners whenever they change
    useEffect(() => {
        const channel = new BroadcastChannel('page-builder-preview');
        channel.postMessage({ type: 'UPDATE_SECTIONS', sections: data.sections });
        
        if (previewRef.current?.contentWindow) {
            previewRef.current.contentWindow.postMessage(
                { type: 'UPDATE_SECTIONS', sections: data.sections },
                '*'
            );
        }

        return () => channel.close();
    }, [data.sections]);

    const handleUpdate = (key: string, value: any) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        onSave(data);
    };

    const isDirty = JSON.stringify(data) !== JSON.stringify({
        title: page.title,
        slug: page.slug,
        status: page.status,
        is_home: page.is_home,
        sections: page.sections,
    });

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("flex flex-col h-screen overflow-hidden bg-background", isFullscreen && "fixed inset-0 z-50")}
        >
            {/* Top Toolbar - Glassmorphism */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-2 border-b bg-background/60 backdrop-blur-xl h-14 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-accent/10">
                        <a href={backUrl}><ArrowLeft size={16} className="mr-2" /> Back</a>
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <div>
                        <h1 className="font-semibold text-sm tracking-tight">{data.title || 'Untitled Page'}</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={cn(
                                "size-1.5 rounded-full",
                                data.status === 'published' ? "bg-green-500" : "bg-orange-500"
                            )} />
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">{data.status}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex bg-muted/50 rounded-full p-1 border">
                        <Button 
                            variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="size-7 rounded-full transition-all" 
                            onClick={() => setPreviewDevice('desktop')}
                        >
                            <Monitor size={14} />
                        </Button>
                        <Button 
                            variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="size-7 rounded-full transition-all" 
                            onClick={() => setPreviewDevice('mobile')}
                        >
                            <Smartphone size={14} />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 hidden lg:block" />

                    <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setIsFullscreen(!isFullscreen)}>
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </Button>
                    
                    <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => submit()} 
                        disabled={processing || !isDirty}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-4"
                    >
                        <Save size={16} className="mr-2" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden pt-14">
                <PanelGroup direction="horizontal">
                    {/* Editor Panel - Refined Sidebar */}
                    <Panel 
                        defaultSize={30} 
                        minSize={25} 
                        className="overflow-y-auto custom-scrollbar"
                    >
                        <motion.div 
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="bg-card shrink-0 px-6 py-8 h-full"
                        >
                            <div className="space-y-10">
                                {/* Settings Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1">Global Settings</h3>
                                        <Select value={data.status} onValueChange={(val) => handleUpdate('status', val)}>
                                            <SelectTrigger className="h-7 w-[90px] text-[10px] uppercase font-bold tracking-wider">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
    
                                    <div className="grid grid-cols-1 gap-6 bg-muted/30 p-4 rounded-xl border border-border/50">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Page Title</Label>
                                            <Input 
                                                id="title" 
                                                value={data.title} 
                                                onChange={(e) => handleUpdate('title', e.target.value)} 
                                                className="h-9 text-sm bg-background border-border/60 focus:ring-accent"
                                                required 
                                            />
                                            {errors.title && <p className="text-[10px] text-destructive">{errors.title}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">URL Slug</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-[10px] text-muted-foreground font-mono">/</span>
                                                <Input 
                                                    id="slug" 
                                                    value={data.slug} 
                                                    onChange={(e) => handleUpdate('slug', e.target.value)} 
                                                    className="h-9 text-sm pl-6 bg-background border-border/60 focus:ring-accent"
                                                    required 
                                                />
                                            </div>
                                            {errors.slug && <p className="text-[10px] text-destructive">{errors.slug}</p>}
                                        </div>
                                        <div className="flex items-center space-x-2 pt-1">
                                            <Checkbox
                                                id="is_home"
                                                checked={data.is_home}
                                                onCheckedChange={(checked) => handleUpdate('is_home', checked)}
                                            />
                                            <Label htmlFor="is_home" className="text-xs font-semibold leading-none text-muted-foreground">Set as Home Page</Label>
                                        </div>
                                    </div>
                                </div>
    
                                <Separator className="opacity-50" />
    
                                {/* Section Manager */}
                                <div className="space-y-2">
                                     <div className="flex items-center justify-between px-1">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Layout Builder</h3>
                                    </div>
                                    <SectionManager 
                                        sections={data.sections}
                                        onChange={(sections) => handleUpdate('sections', sections)}
                                        metadata={sectionMetadata}
                                        previewRef={previewRef}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </Panel>

                    {/* Resize Handle */}
                    <PanelResizeHandle className="group relative w-1.5 flex items-center justify-center bg-zinc-100 hover:bg-primary/20 transition-all border-x border-border/40">
                        <div className="absolute top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-border shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={12} className="text-muted-foreground" />
                        </div>
                    </PanelResizeHandle>

                    {/* Preview Panel - Browser Shell */}
                    <Panel defaultSize={70}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="bg-zinc-100/50 dark:bg-zinc-900 shadow-inner relative flex items-start justify-center p-6 md:p-12 overflow-y-auto h-full"
                        >
                            <div 
                                className={cn(
                                    "transition-all duration-700 ease-in-out relative flex flex-col shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-background shrink-0",
                                    previewDevice === 'mobile' 
                                        ? 'w-[375px] h-[760px] rounded-[3.5rem] border-[12px] border-zinc-950 bg-zinc-950 overflow-hidden my-auto' 
                                        : 'w-full rounded-2xl border border-border/50 overflow-hidden'
                                )}
                                style={previewDevice === 'desktop' ? { height: `${Math.max(800, previewHeight)}px` } : {}}
                            >
                                {/* Desktop Browser Header */}
                                {previewDevice === 'desktop' && (
                                    <div className="h-10 bg-muted/20 border-b flex items-center px-4 shrink-0 gap-6">
                                        <div className="flex gap-1.5">
                                            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <div className="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        </div>
                                        <div className="flex-1 max-w-sm ml-4">
                                            <div className="h-6 bg-muted/40 rounded-md flex items-center px-3 gap-2">
                                                <Monitor size={10} className="text-muted-foreground" />
                                                <div className="text-[10px] text-muted-foreground font-medium truncate">paipai.travel/{data.slug}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
    
                                {/* Mobile Notch Indicator */}
                                {previewDevice === 'mobile' && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-950 z-40 rounded-b-2xl" />
                                )}
                                
                                <iframe 
                                    ref={previewRef}
                                    src={previewUrl}
                                    className={cn(
                                        "w-full flex-1 border-none bg-white transition-opacity",
                                        processing ? "opacity-50" : "opacity-100"
                                    )}
                                    title="Live Preview"
                                />
                                
                                {/* Live Status Indicator Overlay */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white pointer-events-none border border-white/10 shadow-xl">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="font-bold tracking-widest uppercase">Live Sync Active</span>
                                </div>
                            </div>
                            
                            <a 
                                href={previewUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="absolute bottom-6 right-6 bg-white dark:bg-zinc-900 border border-border/60 hover:border-primary p-2.5 rounded-full shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0 group"
                                title="Open in new tab"
                            >
                                <ExternalLink size={18} className="group-hover:text-primary transition-colors" />
                            </a>
                        </motion.div>
                    </Panel>
                </PanelGroup>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
            `}} />
        </motion.div>
    );
}
