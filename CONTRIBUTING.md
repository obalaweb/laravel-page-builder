# Contributing to Laravel Page Builder

Thank you for considering a contribution to `codprez/laravel-page-builder`. The following guidelines will help make the process smooth for everyone involved.

---

## Code of Conduct

Be respectful and constructive in all interactions. We welcome contributors of all experience levels.

---

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub.
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/laravel-page-builder.git
cd laravel-page-builder
```

3. Install PHP dependencies:

```bash
composer install
```

4. Add the upstream remote so you can keep your fork up to date:

```bash
git remote add upstream https://github.com/obalaweb/laravel-page-builder.git
```

---

## Branch Naming

Create a dedicated branch for every contribution. Use the following conventions:

| Type        | Pattern                        | Example                         |
|-------------|--------------------------------|---------------------------------|
| Feature     | `feature/short-description`    | `feature/video-section-embed`   |
| Bug fix     | `fix/short-description`        | `fix/section-order-persistence` |
| Docs        | `docs/short-description`       | `docs/custom-section-guide`     |
| Refactor    | `refactor/short-description`   | `refactor/page-resource`        |
| Tests       | `test/short-description`       | `test/gallery-section-form`     |

Always branch off `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

---

## Coding Standards

### PHP

- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding style.
- Follow Laravel conventions for models, controllers, service providers, and resources.
- Use PHP 8.2+ features where appropriate (constructor property promotion, enums, named arguments, match expressions).
- Always declare explicit return types on methods.
- Use PHPDoc blocks for complex type shapes; avoid inline comments unless the logic is exceptionally complex.
- Run Laravel Pint to auto-fix style before committing:

```bash
vendor/bin/pint
```

### TypeScript / React

- Use TypeScript strict mode.
- Prefer named exports over default exports for components (except Inertia pages).
- Keep components small and focused; extract sub-components when a file grows large.
- Use Tailwind CSS v4 utility classes for all styling.

---

## Running Tests

This package uses [Pest](https://pestphp.com/) for testing.

Install dependencies and run the full test suite:

```bash
composer install
vendor/bin/pest
```

Run a specific test file or filter:

```bash
vendor/bin/pest tests/Feature/PageTest.php
vendor/bin/pest --filter=it_creates_a_page
```

Every pull request must include tests that cover the changed or added behaviour. Do not delete existing tests without prior discussion.

---

## Submitting a Pull Request

1. Ensure your branch is up to date with `upstream/main`.
2. Confirm all tests pass and Pint reports no issues.
3. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

4. Open a pull request against the `main` branch of the upstream repository.
5. Fill in the pull request template completely.
6. Be responsive to review feedback — address comments and push follow-up commits to the same branch.

### What Makes a Good PR

- A single, focused change per pull request.
- A clear description of the problem being solved and the approach taken.
- Tests for all new or changed behaviour.
- Updated documentation (README, docblocks) where relevant.
- No unrelated formatting changes mixed in with functional changes.

---

## Reporting Bugs

Use the GitHub issue tracker and fill in the bug report template. Include the package version, PHP version, Laravel version, and a minimal reproducible example.

---

## Suggesting Features

Open a GitHub issue using the feature request template. Describe the use case and the proposed API before starting implementation — this avoids wasted effort if the direction needs discussion.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
