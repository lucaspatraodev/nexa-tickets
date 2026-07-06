<?php

use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::inertia('settings', 'settings', [
        'sections' => [
            [
                'title' => 'Profile',
                'description' => 'Update your name, email, and account information.',
                'href' => '/settings/profile',
            ],
            [
                'title' => 'Security',
                'description' => 'Manage password, passkeys, and two-factor authentication.',
                'href' => '/settings/security',
            ],
            [
                'title' => 'Appearance',
                'description' => 'Switch between light, dark, and system appearance.',
                'href' => '/settings/appearance',
            ],
            [
                'title' => 'Notifications',
                'description' => 'Review notification preferences for ticket events.',
                'href' => '/settings',
            ],
        ],
    ])->name('settings.index');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
