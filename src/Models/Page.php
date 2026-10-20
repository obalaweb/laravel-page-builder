<?php

namespace Codprez\PageBuilder\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image_id',
        'meta_title',
        'meta_description',
        'status',
        'is_home',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_home' => 'boolean',
        ];
    }

    public function image(): BelongsTo
    {
        /** @var class-string<\Illuminate\Database\Eloquent\Model> $mediaModel */
        $mediaModel = config('page-builder.media_model', \App\Models\Media::class);

        return $this->belongsTo($mediaModel, 'image_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class)->orderBy('order');
    }
}
