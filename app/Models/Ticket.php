<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $requester_id
 * @property int $category_id
 * @property int $group_id
 * @property string $title
 * @property string $description
 * @property string $type
 * @property string $priority
 * @property string $status
 * @property Carbon|null $due_at
 * @property Carbon|null $resolved_at
 * @property Carbon|null $closed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $requester
 * @property-read TicketCategory $category
 * @property-read TicketGroup $group
 * @property-read Collection<int, User> $assignees
 */
#[Fillable([
    'requester_id',
    'title',
    'description',
    'category_id',
    'group_id',
    'type',
    'priority',
    'status',
    'due_at',
    'resolved_at',
    'closed_at',
])]
class Ticket extends Model
{
    /** @var list<string> */
    public const TYPES = ['incident', 'request', 'task', 'question', 'change'];

    /** @var list<string> */
    public const PRIORITIES = ['low', 'medium', 'high', 'critical'];

    /** @var list<string> */
    public const STATUSES = ['open', 'in_progress', 'waiting', 'resolved', 'closed'];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /** @return BelongsTo<TicketCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    /** @return BelongsTo<TicketGroup, $this> */
    public function group(): BelongsTo
    {
        return $this->belongsTo(TicketGroup::class, 'group_id');
    }

    /** @return BelongsToMany<User, $this, TicketAssignee, 'pivot'> */
    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'ticket_assignees')
            ->using(TicketAssignee::class)
            ->withTimestamps();
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereNotIn('status', ['resolved', 'closed']);
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeAssignedTo(Builder $query, User|int $user): Builder
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $query->whereHas('assignees', fn (Builder $query) => $query->where('users.id', $userId));
    }

    /**
     * @param  Builder<Ticket>  $query
     * @return Builder<Ticket>
     */
    public function scopeVisibleTo(Builder $query, User|int $user): Builder
    {
        $userId = $user instanceof User ? $user->id : $user;

        return $query->where(function (Builder $query) use ($userId) {
            $query
                ->where('requester_id', $userId)
                ->orWhereHas('assignees', fn (Builder $query) => $query->where('users.id', $userId));
        });
    }

    public function markResolved(): void
    {
        $this->forceFill([
            'status' => 'resolved',
            'resolved_at' => now(),
            'closed_at' => null,
        ])->save();
    }

    public function close(): void
    {
        $this->forceFill([
            'status' => 'closed',
            'resolved_at' => $this->resolved_at ?? now(),
            'closed_at' => now(),
        ])->save();
    }
}
