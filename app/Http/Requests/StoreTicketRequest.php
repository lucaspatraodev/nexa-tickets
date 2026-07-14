<?php

namespace App\Http\Requests;

use App\Models\Ticket;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'min:3',
                'max:160',
            ],

            'description' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],

            'category_id' => [
                'required',
                'integer',
                'exists:ticket_categories,id',
            ],

            'group_id' => [
                'required',
                'integer',
                'exists:ticket_groups,id',
            ],

            'assignee_ids' => [
                'nullable',
                'array',
            ],

            'assignee_ids.*' => [
                'integer',
                'distinct',
                'exists:users,id',
            ],

            'type' => [
                'required',
                'string',
                Rule::in(Ticket::TYPES),
            ],

            'priority' => [
                'required',
                'string',
                Rule::in(Ticket::PRIORITIES),
            ],

            'due_at' => [
                'nullable',
                'date',
            ],
        ];
    }
}
