# Changelog

All notable changes to `codprez/laravel-page-builder` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2026-04-26

### Added

- **Hero carousel slides**: optional `HeroData.slides` array (`HeroSlideItem`: image, headline, subheadline, optional description). When any slide has an image URL, `SectionRenderer` shows a rotating hero with dot navigation; otherwise the single-image hero behaviour is unchanged.
- **Hero admin UI**: `HeroForm` supports adding/removing slides with per-slide image upload and copy fields, plus helper text for single-image vs carousel modes.

## [1.0.0] - 2024-01-01

### Added

- Initial release of the Laravel Page Builder package.
- `Page` Eloquent model with `title`, `slug`, `excerpt`, `content`, `image_id`, `meta_title`, `meta_description`, `status` (draft/published/archived), `is_home`, and `order` fillable attributes.
- `PageSection` Eloquent model with `page_id`, `type`, `order`, `data` (JSON cast), and `is_visible` fillable attributes.
- `TYPES` constant on `PageSection` defining all 12 built-in section types: `hero`, `about`, `features`, `stats`, `team`, `testimonials`, `cta`, `gallery`, `faq`, `contact`, `rich_text`, `video`.
- `Page::image()` and `Page::sections()` Eloquent relationships.
- `PageResource` and `PageSectionResource` API resources.
- `PageBuilder::register()` static method for registering custom section types with `requiredFields` and `imageFields` options.
- Configurable media model via `config/page-builder.php` (`media_model` key).
- Database migrations for `pages` and `page_sections` tables.
- Frontend TypeScript type definitions in `resources/js/types/page-builder.ts`.
- `SectionEditor` React component with drag-and-drop reordering powered by `@dnd-kit`.
- `SectionPicker` React component for selecting a section type to add.
- Per-section form components for all 12 built-in section types.
- `SectionRenderer` React component for rendering published sections on the frontend.
- `resources/js/index.ts` barrel export for all frontend types and components.
- Service provider with automatic config, migration, and resource publishing under the `page-builder-config`, `page-builder-migrations`, and `page-builder-resources` tags.
- MIT license.
