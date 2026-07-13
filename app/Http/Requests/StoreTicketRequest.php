<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'requester_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],

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
                Rule::in([
                    'incident',
                    'request',
                    'task',
                    'question',
                    'change',
                ]),
            ],

            'priority' => [
                'required',
                'string',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'critical',
                ]),
            ],
        ];
    }
}