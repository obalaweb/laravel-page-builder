import { Component, type ReactNode, useEffect, useState } from 'react';
import type { HeroData, HeroSlideItem, PageSection, SectionType } from '../types/page-builder';

// ─── Error Boundary ────────────────────────────────────────────────────────────

class SectionErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// ─── Section Display Components ────────────────────────────────────────────────

function HeroCarouselBlock({ data, slides }: { data: HeroData; slides: HeroSlideItem[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const id = window.setInterval(() => {
            setIndex((v) => (v + 1) % slides.length);
        }, 6000);
        return () => window.clearInterval(id);
    }, [slides.length]);

    const slide = slides[index]!;
    const opacity = (data.overlay_opacity ?? 40) / 100;

    return (
        <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-gray-900 text-white md:min-h-[560px]">
            {slide.image_url && (
                <>
                    <img src={slide.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black" style={{ opacity }} />
                </>
            )}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
                {slide.headline && <h1 className="text-4xl font-bold leading-tight md:text-5xl">{slide.headline}</h1>}
                {slide.subheadline && <p className="mt-4 text-lg text-white/80 md:text-xl">{slide.subheadline}</p>}
                {(slide.description ?? '').length > 0 && (
                    <p className="mt-3 text-base text-white/75 md:text-lg">{slide.description}</p>
                )}
                {(data.primary_button_text || data.secondary_button_text) && (
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {data.primary_button_text && (
                            <a
                                href={data.primary_button_url || '#'}
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                {data.primary_button_text}
                            </a>
                        )}
                        {data.secondary_button_text && (
                            <a
                                href={data.secondary_button_url || '#'}
                                className="rounded-lg border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                {data.secondary_button_text}
                            </a>
                        )}
                    </div>
                )}
            </div>
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Slide ${i + 1}`}
                            onClick={() => setIndex(i)}
                            className={`h-2 rounded-full transition-all ${index === i ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

function HeroSection({ data }: { data: HeroData }) {
    const slides = (data.slides ?? []).filter((s) => s.image_url);

    if (slides.length > 0) {
        return <HeroCarouselBlock data={data} slides={slides} />;
    }

    return (
        <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-gray-900 text-white">
            {data.image_url && (
                <>
                    <img
                        src={data.image_url}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: (data.overlay_opacity ?? 40) / 100 }}
                    />
                </>
            )}
            <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
                {data.headline && <h1 className="text-4xl font-bold leading-tight md:text-5xl">{data.headline}</h1>}
                {data.subheadline && <p className="mt-4 text-lg text-white/80 md:text-xl">{data.subheadline}</p>}
                {(data.primary_button_text || data.secondary_button_text) && (
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        {data.primary_button_text && (
                            <a
                                href={data.primary_button_url || '#'}
                                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
                            >
                                {data.primary_button_text}
                            </a>
                        )}
                        {data.secondary_button_text && (
                            <a
                                href={data.secondary_button_url || '#'}
                                className="rounded-lg border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                            >
                                {data.secondary_button_text}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

function AboutSection({ data }: { data: import('../types/page-builder').AboutData }) {
    const isLeft = data.layout === 'image-left';
    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <div className={`flex flex-col items-center gap-12 md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                {data.image_url && (
                    <div className="w-full flex-shrink-0 md:w-1/2">
                        <img src={data.image_url} alt={data.title} className="rounded-2xl object-cover shadow-lg" />
                    </div>
                )}
                <div className="flex-1">
                    {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                    {data.body && (
                        <div
                            className="prose prose-lg mt-4 max-w-none"
                            dangerouslySetInnerHTML={{ __html: data.body }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection({ data }: { data: import('../types/page-builder').FeaturesData }) {
    return (
        <section className="bg-muted/30 px-6 py-20">
            <div className="mx-auto max-w-6xl">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                    {data.subtitle && <p className="mt-3 text-lg text-muted-foreground">{data.subtitle}</p>}
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {data.items.map((item, i) => (
                        <div key={i} className="rounded-xl bg-card p-6 shadow-sm">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl text-primary">
                                ✦
                            </div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="mt-2 text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StatsSection({ data }: { data: import('../types/page-builder').StatsData }) {
    return (
        <section className="bg-primary px-6 py-16 text-primary-foreground">
            <div className="mx-auto max-w-6xl">
                {data.title && <h2 className="mb-10 text-center text-2xl font-bold">{data.title}</h2>}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {data.items.map((item, i) => (
                        <div key={i} className="text-center">
                            <p className="text-5xl font-extrabold">
                                {item.number}
                                <span className="text-3xl">{item.suffix}</span>
                            </p>
                            <p className="mt-2 text-primary-foreground/80">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamSection({ data }: { data: import('../types/page-builder').TeamData }) {
    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
                {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                {data.subtitle && <p className="mt-3 text-lg text-muted-foreground">{data.subtitle}</p>}
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((item, i) => (
                    <div key={i} className="rounded-xl bg-card p-6 text-center shadow-sm">
                        {item.image_url && (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                            />
                        )}
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                        {item.bio && <p className="mt-3 text-sm">{item.bio}</p>}
                        <div className="mt-3 flex justify-center gap-3">
                            {item.linkedin && (
                                <a href={item.linkedin} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                                    LinkedIn
                                </a>
                            )}
                            {item.twitter && (
                                <a href={item.twitter} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                                    Twitter
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function TestimonialsSection({ data }: { data: import('../types/page-builder').TestimonialsData }) {
    return (
        <section className="bg-muted/30 px-6 py-20">
            <div className="mx-auto max-w-6xl">
                {data.title && <h2 className="mb-10 text-center text-3xl font-bold">{data.title}</h2>}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.items.map((item, i) => (
                        <div key={i} className="rounded-xl bg-card p-6 shadow-sm">
                            <p className="text-muted-foreground italic">"{item.quote}"</p>
                            <div className="mt-4 flex items-center gap-3">
                                {item.author_image_url && (
                                    <img
                                        src={item.author_image_url}
                                        alt={item.author_name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-semibold">{item.author_name}</p>
                                    <p className="text-xs text-muted-foreground">{item.author_role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaSection({ data }: { data: import('../types/page-builder').CtaData }) {
    const bgClass =
        data.background === 'dark'
            ? 'bg-gray-900 text-white'
            : data.background === 'light'
              ? 'bg-muted/40 text-foreground'
              : 'bg-primary text-primary-foreground';

    return (
        <section className={`px-6 py-20 ${bgClass}`}>
            <div className="mx-auto max-w-3xl text-center">
                {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                {data.description && <p className="mt-4 text-lg opacity-80">{data.description}</p>}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {data.primary_button_text && (
                        <a
                            href={data.primary_button_url || '#'}
                            className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:opacity-90"
                        >
                            {data.primary_button_text}
                        </a>
                    )}
                    {data.secondary_button_text && (
                        <a
                            href={data.secondary_button_url || '#'}
                            className="rounded-lg border border-current px-6 py-3 font-semibold transition hover:bg-white/10"
                        >
                            {data.secondary_button_text}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

function GallerySection({ data }: { data: import('../types/page-builder').GalleryData }) {
    const colClass = data.columns === 2 ? 'grid-cols-2' : data.columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3';
    return (
        <section className="mx-auto max-w-6xl px-6 py-20">
            {data.title && <h2 className="mb-8 text-center text-3xl font-bold">{data.title}</h2>}
            <div className={`grid gap-4 ${colClass}`}>
                {data.image_urls.map((url, i) => (
                    <img key={i} src={url} alt="" className="aspect-square w-full rounded-xl object-cover" />
                ))}
            </div>
        </section>
    );
}

function FaqSection({ data }: { data: import('../types/page-builder').FaqData }) {
    return (
        <section className="mx-auto max-w-3xl px-6 py-20">
            <div className="text-center">
                {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                {data.subtitle && <p className="mt-3 text-muted-foreground">{data.subtitle}</p>}
            </div>
            <div className="mt-10 space-y-4">
                {data.items.map((item, i) => (
                    <details key={i} className="group rounded-xl border border-border bg-card">
                        <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold">
                            {item.question}
                            <span className="ml-4 transition group-open:rotate-180">▾</span>
                        </summary>
                        <p className="px-6 pb-4 text-muted-foreground">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

function ContactSection({ data }: { data: import('../types/page-builder').ContactData }) {
    return (
        <section className="bg-muted/30 px-6 py-20">
            <div className="mx-auto max-w-4xl">
                <div className="text-center">
                    {data.title && <h2 className="text-3xl font-bold">{data.title}</h2>}
                    {data.subtitle && <p className="mt-3 text-muted-foreground">{data.subtitle}</p>}
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {data.email && (
                        <div className="rounded-xl bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <a href={`mailto:${data.email}`} className="mt-1 block font-semibold text-primary hover:underline">
                                {data.email}
                            </a>
                        </div>
                    )}
                    {data.phone && (
                        <div className="rounded-xl bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="mt-1 font-semibold">{data.phone}</p>
                        </div>
                    )}
                    {data.address && (
                        <div className="rounded-xl bg-card p-5 text-center shadow-sm">
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <p className="mt-1 font-semibold">{data.address}</p>
                        </div>
                    )}
                </div>
                {data.map_embed_url && (
                    <div className="mt-8 overflow-hidden rounded-xl">
                        <iframe
                            src={data.map_embed_url}
                            className="h-80 w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Map"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

function RichTextSection({ data }: { data: import('../types/page-builder').RichTextData }) {
    return (
        <section className="mx-auto max-w-3xl px-6 py-16">
            {data.title && <h2 className="mb-6 text-2xl font-bold">{data.title}</h2>}
            {data.body && (
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: data.body }} />
            )}
        </section>
    );
}

function VideoSection({ data }: { data: import('../types/page-builder').VideoData }) {
    if (!data.url) return null;

    const embedUrl = data.url
        .replace('watch?v=', 'embed/')
        .replace('youtu.be/', 'youtube.com/embed/')
        .replace('vimeo.com/', 'player.vimeo.com/video/')
        + (data.autoplay ? '?autoplay=1&mute=1' : '');

    return (
        <section className="mx-auto max-w-4xl px-6 py-16">
            {data.title && <h2 className="mb-6 text-center text-2xl font-bold">{data.title}</h2>}
            <div className="aspect-video overflow-hidden rounded-2xl shadow-lg">
                <iframe
                    src={embedUrl}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={data.title || 'Video'}
                />
            </div>
            {data.caption && <p className="mt-3 text-center text-sm text-muted-foreground">{data.caption}</p>}
        </section>
    );
}

// ─── Main Renderer ─────────────────────────────────────────────────────────────

function SectionSwitch({ section }: { section: PageSection }) {
    if (!section.is_visible) return null;

    switch (section.type as SectionType) {
        case 'hero': return <HeroSection data={section.data as HeroData} />;
        case 'about': return <AboutSection data={section.data as import('../types/page-builder').AboutData} />;
        case 'features': return <FeaturesSection data={section.data as import('../types/page-builder').FeaturesData} />;
        case 'stats': return <StatsSection data={section.data as import('../types/page-builder').StatsData} />;
        case 'team': return <TeamSection data={section.data as import('../types/page-builder').TeamData} />;
        case 'testimonials': return <TestimonialsSection data={section.data as import('../types/page-builder').TestimonialsData} />;
        case 'cta': return <CtaSection data={section.data as import('../types/page-builder').CtaData} />;
        case 'gallery': return <GallerySection data={section.data as import('../types/page-builder').GalleryData} />;
        case 'faq': return <FaqSection data={section.data as import('../types/page-builder').FaqData} />;
        case 'contact': return <ContactSection data={section.data as import('../types/page-builder').ContactData} />;
        case 'rich_text': return <RichTextSection data={section.data as import('../types/page-builder').RichTextData} />;
        case 'video': return <VideoSection data={section.data as import('../types/page-builder').VideoData} />;
        default: return null;
    }
}

export function SectionRenderer({ section }: { section: PageSection }) {
    return (
        <SectionErrorBoundary>
            <SectionSwitch section={section} />
        </SectionErrorBoundary>
    );
}
