<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable([
    'requester_id',
    'title',
    'description',
    'category_id',
    'group_id',
    'type',
    'priority',
    'status',
    'resolved_at',
    'closed_at',
])]
class Ticket extends Model
{
    protected function casts(): array
    {
        return [
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(TicketGroup::class, 'group_id');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'ticket_assignees')
            ->using(TicketAssignee::class)
            ->withTimestamps();
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereNotIn('status', ['resolved', 'closed']);
    }

    public function scopeAssignedTo(Builder $query, User|int $user): Builder
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $query->whereHas('assignees', fn (Builder $query) => $query->whereKey($userId));
    }

    public function markResolved(): void
    {
        $this->forceFill([
            'status' => 'resolved',
            'resolved_at' => now(),
        ])->save();
    }

    public function close(): void
    {
        $this->forceFill([
            'status' => 'closed',
            'closed_at' => now(),
        ])->save();
    }
}
