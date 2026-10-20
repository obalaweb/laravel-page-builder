<?php

use Codprez\PageBuilder\Http\Controllers\Admin\PageController;
use Illuminate\Support\Facades\Route;

$prefix = config('page-builder.routing.prefix', 'builder');
$middleware = config('page-builder.routing.middleware', ['web', 'auth']);

Route::middleware($middleware)
    ->prefix($prefix)
    ->name('admin.') // Keeping admin. prefix for compatibility with existing views if needed
    ->group(function () {
        Route::resource('pages', PageController::class)->names([
            'index' => 'pages.index',
            'create' => 'pages.create',
            'store' => 'pages.store',
            'edit' => 'pages.edit',
            'update' => 'pages.update',
            'destroy' => 'pages.destroy',
        ]);
    });
