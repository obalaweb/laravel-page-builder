<?php

namespace Codprez\PageBuilder;

use Codprez\PageBuilder\Validation\SectionValidatorRegistry;
use Illuminate\Support\Facades\App;

class PageBuilder
{
    public static function registry(): SectionValidatorRegistry
    {
        return App::make(SectionValidatorRegistry::class);
    }

    public static function register(string $type, array $requiredFields = [], array $imageFields = []): void
    {
        static::registry()->register($type, $requiredFields, $imageFields);
    }

    /** @return array<string, string[]> */
    public static function requiredFields(): array
    {
        return static::registry()->requiredFields();
    }

    /** @return array<string, string[]> */
    public static function imageFields(): array
    {
        return static::registry()->imageFields();
    }

    public static function types(): array
    {
        return static::registry()->types();
    }
}
