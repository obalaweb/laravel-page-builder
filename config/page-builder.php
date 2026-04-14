<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Media Model
    |--------------------------------------------------------------------------
    | The fully-qualified class name of the model used for media records.
    | Must have at minimum: id, url columns.
    */
    'media_model' => \Codprez\MediaLibrary\Models\Media::class,

    /*
    |--------------------------------------------------------------------------
    | Routing Configuration
    |--------------------------------------------------------------------------
    */
    'routing' => [
        'prefix' => 'builder',
        'middleware' => ['web', 'auth'],
    ],
];
