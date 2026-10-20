<?php

namespace Codprez\PageBuilder;

use Codprez\PageBuilder\Validation\SectionValidatorRegistry;
use Illuminate\Support\ServiceProvider;

class PageBuilderServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/page-builder.php', 'page-builder');

        $this->app->singleton(SectionValidatorRegistry::class, function () {
            return new SectionValidatorRegistry();
        });
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/page-builder.php' => config_path('page-builder.php'),
        ], 'page-builder-config');

        $this->publishes([
            __DIR__.'/../database/migrations/' => database_path('migrations'),
        ], 'page-builder-migrations');

        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');

        $this->registerBuiltInSections();
    }

    private function registerBuiltInSections(): void
    {
        $registry = $this->app->make(SectionValidatorRegistry::class);

        $registry->register('hero', ['headline'], ['image_id']);
        $registry->register('about', ['body'], ['image_id']);
        $registry->register('features', ['items']);
        $registry->register('stats', ['items']);
        $registry->register('team', ['items']);
        $registry->register('testimonials', ['items']);
        $registry->register('cta', ['title']);
        $registry->register('gallery', ['image_ids']);
        $registry->register('faq', ['items']);
        $registry->register('contact', []);
        $registry->register('rich_text', ['body']);
        $registry->register('video', ['url']);
    }
}
