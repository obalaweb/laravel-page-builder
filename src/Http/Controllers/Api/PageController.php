<?php

namespace Codprez\PageBuilder\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Codprez\PageBuilder\Http\Resources\PageResource;
use Codprez\PageBuilder\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::where('status', 'published')
            ->orderBy('order')
            ->get();

        return PageResource::collection($pages);
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->with(['sections', 'image'])
            ->firstOrFail();

        return new PageResource($page);
    }

    public function home()
    {
        $page = Page::where('is_home', true)
            ->where('status', 'published')
            ->with(['sections' => function ($query) {
                $query->where('is_visible', true)->orderBy('order');
            }, 'image'])
            ->firstOrFail();

        return new PageResource($page);
    }
}
