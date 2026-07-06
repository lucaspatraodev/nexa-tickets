<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::inertia('tickets', 'tickets', [
        'metrics' => [
            [
                'label' => 'Open Tickets',
                'value' => '28',
                'description' => '8% vs yesterday',
            ],
            [
                'label' => 'Due Today',
                'value' => '7',
                'description' => '3% vs yesterday',
            ],
            [
                'label' => 'SLA Breached',
                'value' => '2',
                'description' => 'Needs attention',
            ],
            [
                'label' => 'Resolved Today',
                'value' => '15',
                'description' => '20% vs yesterday',
            ],
        ],
        'filters' => ['All', 'High Priority', 'Waiting', 'Resolved'],
        'tickets' => [
            [
                'id' => 'TKT-1048',
                'subject' => 'Payment gateway not responding',
                'customer' => 'Sarah Johnson',
                'priority' => 'High',
                'status' => 'SLA Breached',
                'owner' => 'Lucas',
                'updatedAt' => '15m ago',
            ],
            [
                'id' => 'TKT-1032',
                'subject' => 'Unable to access reports',
                'customer' => 'Acme Corp',
                'priority' => 'High',
                'status' => 'Due in 30m',
                'owner' => 'Lucas',
                'updatedAt' => '30m ago',
            ],
            [
                'id' => 'TKT-1045',
                'subject' => 'Waiting for customer details',
                'customer' => 'Globex Inc',
                'priority' => 'Medium',
                'status' => 'Waiting',
                'owner' => 'Maya',
                'updatedAt' => '2h ago',
            ],
        ],
    ])->name('tickets.index');

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

require __DIR__.'/settings.php';
