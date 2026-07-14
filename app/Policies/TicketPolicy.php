<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return $this->belongsToUser($user, $ticket);
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $this->belongsToUser($user, $ticket);
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $this->belongsToUser($user, $ticket);
    }

    private function belongsToUser(User $user, Ticket $ticket): bool
    {
        return $ticket->requester_id === $user->id
            || $ticket->assignees()->whereKey($user->id)->exists();
    }
}
