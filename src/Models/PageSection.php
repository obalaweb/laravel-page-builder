<?php

namespace Codprez\PageBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageSection extends Model
{
    public const TYPES = [
        'hero',
        'about',
        'features',
        'stats',
        'team',
        'testimonials',
        'cta',
        'gallery',
        'faq',
        'contact',
        'rich_text',
        'video',
    ];

    protected $fillable = [
        'page_id',
        'type',
        'order',
        'data',
        'is_visible',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'is_visible' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
