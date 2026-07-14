<?php

namespace Database\Seeders;

use App\Models\TicketCategory;
use App\Models\TicketGroup;
use Illuminate\Database\Seeder;

class TicketCatalogSeeder extends Seeder
{
    /**
     * Seed the ticket catalog with the minimum options required by the form.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'General', 'slug' => 'general', 'description' => 'General support requests.'],
            ['name' => 'Billing', 'slug' => 'billing', 'description' => 'Payments, invoices, and subscriptions.'],
            ['name' => 'Technical', 'slug' => 'technical', 'description' => 'Technical incidents and product issues.'],
        ];

        foreach ($categories as $category) {
            TicketCategory::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [...$category, 'is_active' => true],
            );
        }

        $groups = [
            ['name' => 'Support', 'slug' => 'support', 'description' => 'First-line customer support.'],
            ['name' => 'Finance', 'slug' => 'finance', 'description' => 'Billing and financial operations.'],
            ['name' => 'Engineering', 'slug' => 'engineering', 'description' => 'Product and engineering escalation.'],
        ];

        foreach ($groups as $group) {
            TicketGroup::query()->updateOrCreate(
                ['slug' => $group['slug']],
                [...$group, 'is_active' => true],
            );
        }
    }
}
