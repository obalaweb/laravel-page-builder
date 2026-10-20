<?php

use Codprez\PageBuilder\Http\Controllers\Api\PageController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')
    ->middleware('api')
    ->group(function () {
        Route::get('/pages/home', [PageController::class, 'home']);
        Route::get('/pages/{slug}', [PageController::class, 'show']);
        Route::get('/pages', [PageController::class, 'index']);
    });
