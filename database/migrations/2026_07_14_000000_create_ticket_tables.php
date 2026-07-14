<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('ticket_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('ticket_categories')->restrictOnDelete();
            $table->foreignId('group_id')->constrained('ticket_groups')->restrictOnDelete();
            $table->string('title', 160);
            $table->text('description');
            $table->string('type', 30)->index();
            $table->string('priority', 20)->default('medium')->index();
            $table->string('status', 30)->default('open')->index();
            $table->timestamp('due_at')->nullable()->index();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();

            $table->index(['requester_id', 'updated_at']);
            $table->index(['status', 'due_at']);
        });

        Schema::create('ticket_assignees', function (Blueprint $table) {
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['ticket_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_assignees');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('ticket_groups');
        Schema::dropIfExists('ticket_categories');
    }
};
