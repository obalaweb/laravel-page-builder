// ─── Section Data Types ────────────────────────────────────────────────────────

/** One slide in a homepage-style hero carousel (optional; see `HeroData.slides`). */
export interface HeroSlideItem {
    image_id: number | null;
    image_url: string | null;
    headline: string;
    subheadline: string;
    /** Optional extra line under the headline on the public site. */
    description?: string;
}

export interface HeroData {
    headline: string;
    subheadline: string;
    image_id: number | null;
    image_url: string | null;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
    overlay_opacity: number;
    /**
     * When non-empty, the public site can render these as carousel slides (image + copy each).
     * Leave empty to use the single background image and headline/subheadline above.
     */
    slides?: HeroSlideItem[];
}

export interface AboutData {
    title: string;
    body: string;
    image_id: number | null;
    image_url: string | null;
    layout: 'image-left' | 'image-right';
}

export interface FeaturesItem {
    icon: string;
    title: string;
    description: string;
}
export interface FeaturesData {
    title: string;
    subtitle: string;
    items: FeaturesItem[];
}

export interface StatsItem {
    number: string;
    suffix: string;
    label: string;
}
export interface StatsData {
    title: string;
    items: StatsItem[];
}

export interface TeamItem {
    name: string;
    role: string;
    bio: string;
    image_id: number | null;
    image_url: string | null;
    linkedin: string;
    twitter: string;
}
export interface TeamData {
    title: string;
    subtitle: string;
    items: TeamItem[];
}

export interface TestimonialItem {
    quote: string;
    author_name: string;
    author_role: string;
    author_image_id: number | null;
    author_image_url: string | null;
}
export interface TestimonialsData {
    title: string;
    items: TestimonialItem[];
}

export interface CtaData {
    title: string;
    description: string;
    primary_button_text: string;
    primary_button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
    background: 'light' | 'dark' | 'primary';
}

export interface GalleryData {
    title: string;
    image_ids: number[];
    image_urls: string[];
    columns: 2 | 3 | 4;
    lightbox: boolean;
}

export interface FaqItem {
    question: string;
    answer: string;
}
export interface FaqData {
    title: string;
    subtitle: string;
    items: FaqItem[];
}

export interface ContactData {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    address: string;
    map_embed_url: string;
}

export interface RichTextData {
    title: string;
    body: string;
}

export interface VideoData {
    title: string;
    url: string;
    caption: string;
    autoplay: boolean;
}

// ─── Section Type Map ──────────────────────────────────────────────────────────

export type SectionDataMap = {
    hero: HeroData;
    about: AboutData;
    features: FeaturesData;
    stats: StatsData;
    team: TeamData;
    testimonials: TestimonialsData;
    cta: CtaData;
    gallery: GalleryData;
    faq: FaqData;
    contact: ContactData;
    rich_text: RichTextData;
    video: VideoData;
};

export type SectionType = keyof SectionDataMap;

export interface PageSection<T extends SectionType = SectionType> {
    id?: number;
    type: T;
    order: number;
    data: SectionDataMap[T];
    is_visible: boolean;
    _key: string; // client-side UUID for React keys
}

// ─── Section Definitions (labels, icons, defaults) ────────────────────────────

export interface SectionDefinition {
    type: SectionType;
    label: string;
    description: string;
    icon: string;
    defaultData: SectionDataMap[SectionType];
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
    {
        type: 'hero',
        label: 'Hero',
        description: 'Full-width banner with headline and call-to-action buttons.',
        icon: 'layout-template',
        defaultData: {
            headline: '',
            subheadline: '',
            image_id: null,
            image_url: null,
            primary_button_text: '',
            primary_button_url: '',
            secondary_button_text: '',
            secondary_button_url: '',
            overlay_opacity: 40,
            slides: [],
        } satisfies HeroData,
    },
    {
        type: 'about',
        label: 'About',
        description: 'Text and image side-by-side with layout control.',
        icon: 'info',
        defaultData: {
            title: '',
            body: '',
            image_id: null,
            image_url: null,
            layout: 'image-right',
        } satisfies AboutData,
    },
    {
        type: 'features',
        label: 'Features',
        description: 'Grid of feature highlights with icons.',
        icon: 'grid-3x3',
        defaultData: {
            title: '',
            subtitle: '',
            items: [{ icon: 'star', title: '', description: '' }],
        } satisfies FeaturesData,
    },
    {
        type: 'stats',
        label: 'Stats',
        description: 'Key numbers and metrics in a row.',
        icon: 'bar-chart-2',
        defaultData: {
            title: '',
            items: [{ number: '', suffix: '', label: '' }],
        } satisfies StatsData,
    },
    {
        type: 'team',
        label: 'Team',
        description: 'Team member cards with photos and bios.',
        icon: 'users',
        defaultData: {
            title: '',
            subtitle: '',
            items: [{ name: '', role: '', bio: '', image_id: null, image_url: null, linkedin: '', twitter: '' }],
        } satisfies TeamData,
    },
    {
        type: 'testimonials',
        label: 'Testimonials',
        description: 'Customer or partner quotes.',
        icon: 'quote',
        defaultData: {
            title: '',
            items: [{ quote: '', author_name: '', author_role: '', author_image_id: null, author_image_url: null }],
        } satisfies TestimonialsData,
    },
    {
        type: 'cta',
        label: 'Call to Action',
        description: 'Prominent action prompt with buttons.',
        icon: 'megaphone',
        defaultData: {
            title: '',
            description: '',
            primary_button_text: '',
            primary_button_url: '',
            secondary_button_text: '',
            secondary_button_url: '',
            background: 'primary',
        } satisfies CtaData,
    },
    {
        type: 'gallery',
        label: 'Gallery',
        description: 'Image grid with optional lightbox.',
        icon: 'image',
        defaultData: {
            title: '',
            image_ids: [],
            image_urls: [],
            columns: 3,
            lightbox: true,
        } satisfies GalleryData,
    },
    {
        type: 'faq',
        label: 'FAQ',
        description: 'Frequently asked questions in an accordion.',
        icon: 'circle-help',
        defaultData: {
            title: '',
            subtitle: '',
            items: [{ question: '', answer: '' }],
        } satisfies FaqData,
    },
    {
        type: 'contact',
        label: 'Contact',
        description: 'Contact details and optional map embed.',
        icon: 'map-pin',
        defaultData: {
            title: '',
            subtitle: '',
            email: '',
            phone: '',
            address: '',
            map_embed_url: '',
        } satisfies ContactData,
    },
    {
        type: 'rich_text',
        label: 'Rich Text',
        description: 'Free-form rich text content block.',
        icon: 'text',
        defaultData: {
            title: '',
            body: '',
        } satisfies RichTextData,
    },
    {
        type: 'video',
        label: 'Video',
        description: 'Embed a YouTube or Vimeo video.',
        icon: 'play-circle',
        defaultData: {
            title: '',
            url: '',
            caption: '',
            autoplay: false,
        } satisfies VideoData,
    },
];
