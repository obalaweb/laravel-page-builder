<?php

namespace Codprez\PageBuilder\Http\Controllers\Admin;

use Codprez\PageBuilder\Models\Page;
use Codprez\PageBuilder\PageBuilder;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pages/index', [
            'pages' => Page::orderBy('order')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pages/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'status' => 'required|in:draft,published',
            'is_home' => 'boolean',
        ]);

        $page = Page::create($validated);

        return redirect()->route('admin.pages.edit', $page->slug)
            ->with('success', 'Page created successfully.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('admin/pages/edit', [
            'page' => $page->load('sections'),
            'sectionMetadata' => [
                'requiredFields' => PageBuilder::requiredFields(),
                'imageFields' => PageBuilder::imageFields(),
                'types' => PageBuilder::types(),
            ],
            'previewUrl' => config('app.frontend_url', 'http://localhost:3000') . '/preview',
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'status' => 'required|in:draft,published',
            'is_home' => 'boolean',
            'sections' => 'array',
            'sections.*.type' => 'required|string',
            'sections.*.data' => 'required|array',
            'sections.*.order' => 'required|integer',
        ]);

        $page->update($request->only(['title', 'slug', 'status', 'is_home']));

        if ($request->has('sections')) {
            $page->sections()->delete();
            foreach ($request->sections as $section) {
                $page->sections()->create([
                    'type' => $section['type'],
                    'data' => $section['data'],
                    'order' => $section['order'],
                    'is_visible' => true,
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Page saved successfully.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')
            ->with('success', 'Page deleted successfully.');
    }
}
