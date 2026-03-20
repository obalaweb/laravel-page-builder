<?php

namespace Codprez\PageBuilder\Validation;

class SectionValidatorRegistry
{
    /** @var array<string, string[]> */
    private array $requiredFields = [];

    /** @var array<string, string[]> */
    private array $imageFields = [];

    public function register(string $type, array $requiredFields = [], array $imageFields = []): void
    {
        $this->requiredFields[$type] = $requiredFields;
        $this->imageFields[$type] = $imageFields;
    }

    /** @return array<string, string[]> */
    public function requiredFields(): array
    {
        return $this->requiredFields;
    }

    /** @return array<string, string[]> */
    public function imageFields(): array
    {
        return $this->imageFields;
    }

    public function types(): array
    {
        return array_keys($this->requiredFields);
    }
}
