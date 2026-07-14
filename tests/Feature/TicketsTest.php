<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TicketsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private TicketCategory $category;

    private TicketGroup $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->category = TicketCategory::query()->create([
            'name' => 'Technical',
            'slug' => 'technical',
            'description' => 'Technical support',
            'is_active' => true,
        ]);
        $this->group = TicketGroup::query()->create([
            'name' => 'Support',
            'slug' => 'support',
            'description' => 'Support team',
            'is_active' => true,
        ]);
    }

    public function test_guests_are_redirected_from_tickets(): void
    {
        $this->get(route('tickets.index'))
            ->assertRedirect(route('login'));
    }

    public function test_index_uses_database_records_and_only_shows_tickets_visible_to_the_user(): void
    {
        $visibleTicket = $this->createTicket([
            'title' => 'Database-backed ticket card',
            'priority' => 'high',
        ]);
        $hiddenTicket = $this->createTicket(
            ['title' => 'Another customer ticket'],
            User::factory()->create(),
        );

        $this->actingAs($this->user)
            ->get(route('tickets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tickets')
                ->has('tickets', 1)
                ->where('tickets.0.id', $visibleTicket->id)
                ->where('tickets.0.title', 'Database-backed ticket card')
                ->where('tickets.0.priority', 'high')
                ->has('categories', 1)
                ->has('groups', 1)
                ->has('assignees', 2));

        $this->assertNotSame($visibleTicket->id, $hiddenTicket->id);
    }

    public function test_index_passes_the_complete_collection_for_react_to_filter(): void
    {
        $matchingTicket = $this->createTicket([
            'title' => 'Payment gateway timeout',
            'priority' => 'critical',
            'status' => 'waiting',
            'due_at' => now()->subHour(),
        ]);
        $this->createTicket([
            'title' => 'Payment gateway documentation',
            'priority' => 'low',
            'status' => 'open',
            'due_at' => now()->addDay(),
        ]);
        $this->createTicket([
            'title' => 'Unrelated critical issue',
            'priority' => 'critical',
            'status' => 'resolved',
            'due_at' => now()->subHour(),
            'resolved_at' => now(),
        ]);

        $this->actingAs($this->user)
            ->get(route('tickets.index', [
                'search' => 'gateway',
                'priority' => 'critical',
                'status' => 'waiting',
                'sla' => 'breached',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tickets', 3)
                ->where('tickets.2.id', $matchingTicket->id)
                ->where('tickets.2.display_status', 'SLA Breached'));
    }

    public function test_user_can_create_a_ticket_with_assignees(): void
    {
        $assignee = User::factory()->create();
        $forgedRequester = User::factory()->create();

        $response = $this->actingAs($this->user)->post(route('tickets.store'), [
            'requester_id' => $forgedRequester->id,
            'title' => 'Cannot generate an invoice',
            'description' => 'The invoice endpoint returns an unexpected error.',
            'category_id' => $this->category->id,
            'group_id' => $this->group->id,
            'assignee_ids' => [$assignee->id],
            'type' => 'incident',
            'priority' => 'high',
            'due_at' => null,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('tickets.index'));

        $ticket = Ticket::query()->where('title', 'Cannot generate an invoice')->firstOrFail();

        $this->assertSame($this->user->id, $ticket->requester_id);
        $this->assertSame('open', $ticket->status);
        $this->assertNotNull($ticket->due_at);
        $this->assertSame([$assignee->id], $ticket->assignees()->pluck('users.id')->all());
    }

    public function test_user_can_update_a_ticket_and_sync_assignees(): void
    {
        $oldAssignee = User::factory()->create();
        $newAssignee = User::factory()->create();
        $ticket = $this->createTicket();
        $ticket->assignees()->attach($oldAssignee);

        $response = $this->actingAs($this->user)
            ->from(route('tickets.index'))
            ->put(route('tickets.update', $ticket), [
                'title' => 'Updated ticket title',
                'description' => 'The ticket now contains a complete updated description.',
                'category_id' => $this->category->id,
                'group_id' => $this->group->id,
                'assignee_ids' => [$newAssignee->id],
                'type' => 'request',
                'priority' => 'low',
                'status' => 'resolved',
                'due_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('tickets.index'));

        $ticket->refresh();

        $this->assertSame('Updated ticket title', $ticket->title);
        $this->assertSame('resolved', $ticket->status);
        $this->assertNotNull($ticket->resolved_at);
        $this->assertNull($ticket->closed_at);
        $this->assertSame([$newAssignee->id], $ticket->assignees()->pluck('users.id')->all());
        $this->assertDatabaseMissing('ticket_assignees', [
            'ticket_id' => $ticket->id,
            'user_id' => $oldAssignee->id,
        ]);
    }

    public function test_user_can_view_and_delete_a_visible_ticket(): void
    {
        $ticket = $this->createTicket();

        $this->actingAs($this->user)
            ->get(route('tickets.show', $ticket))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tickets/show')
                ->where('ticket.id', $ticket->id));

        $this->actingAs($this->user)
            ->delete(route('tickets.destroy', $ticket))
            ->assertRedirect(route('tickets.index'));

        $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    }

    public function test_user_cannot_view_update_or_delete_another_users_ticket(): void
    {
        $ticket = $this->createTicket([], User::factory()->create());
        $payload = [
            'title' => 'Unauthorized change',
            'description' => 'This change must not be accepted by the application.',
            'category_id' => $this->category->id,
            'group_id' => $this->group->id,
            'assignee_ids' => [],
            'type' => 'incident',
            'priority' => 'medium',
            'status' => 'open',
            'due_at' => null,
        ];

        $this->actingAs($this->user)
            ->get(route('tickets.show', $ticket))
            ->assertForbidden();
        $this->actingAs($this->user)
            ->put(route('tickets.update', $ticket), $payload)
            ->assertForbidden();
        $this->actingAs($this->user)
            ->delete(route('tickets.destroy', $ticket))
            ->assertForbidden();

        $this->assertSame('Example support ticket', $ticket->fresh()->title);
    }

    public function test_ticket_payload_is_validated(): void
    {
        $this->actingAs($this->user)
            ->post(route('tickets.store'), [
                'title' => 'No',
                'description' => 'Short',
                'category_id' => 999,
                'group_id' => 999,
                'type' => 'invalid',
                'priority' => 'urgent',
            ])
            ->assertSessionHasErrors([
                'title',
                'description',
                'category_id',
                'group_id',
                'type',
                'priority',
            ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createTicket(array $attributes = [], ?User $requester = null): Ticket
    {
        return Ticket::query()->create([
            'requester_id' => ($requester ?? $this->user)->id,
            'title' => 'Example support ticket',
            'description' => 'A sufficiently detailed description for this support ticket.',
            'category_id' => $this->category->id,
            'group_id' => $this->group->id,
            'type' => 'incident',
            'priority' => 'medium',
            'status' => 'open',
            'due_at' => now()->addDay(),
            ...$attributes,
        ]);
    }
}
