<?php

use App\Http\Controllers\TicketsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('/tickets', [TicketsController::class, 'index'])
        ->name('tickets.index');

    Route::get('/tickets/{ticket}', [TicketsController::class, 'show'])
        ->name('tickets.show');

    Route::post('/tickets', [TicketsController::class, 'store'])
        ->name('tickets.store');

    Route::put('/tickets/{ticket}', [TicketsController::class, 'update'])
        ->name('tickets.update');

    Route::inertia('insights', 'insights', [
        'metrics' => [
            [
                'label' => 'Resolution Rate',
                'value' => '94%',
                'delta' => '6% improvement',
            ],
            [
                'label' => 'Avg Response',
                'value' => '2h 34m',
                'delta' => '12% faster',
            ],
            [
                'label' => 'SLA Compliance',
                'value' => '96%',
                'delta' => '5% improvement',
            ],
        ],
        'trends' => [
            ['label' => 'Resolved this month', 'value' => '142'],
            ['label' => 'First response met', 'value' => '91%'],
            ['label' => 'Customer satisfaction', 'value' => '4.7'],
            ['label' => 'Escalations avoided', 'value' => '38'],
        ],
    ])->name('insights.index');
});

require __DIR__ . '/settings.php';
