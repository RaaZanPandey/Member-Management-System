<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Members extends Model
{
    use HasFactory;

    protected $table = 'members';

    protected $fillable = [
        'name',
        'phone_number',
        'registration_number',
        'blood_group',
        'father_or_husband_name',
        'dob',
        'address',
        'area',
        'postal_code',
        'interest',
        'profession',
        'position',
        'workplace_name',
        'education_qualification',
        'number_of_family_members',
        'registration_date',
        'registration_fee',
        'society_fee',
        'donation',
        'total',
        'reference_by',
        'is_board_members',
        'membership_type'
    ];

    protected $casts = [
        'dob' => 'date',
        'registration_date' => 'date',
        'registration_fee' => 'decimal:2',
        'society_fee' => 'decimal:2',
        'donation' => 'decimal:2',
        'total' => 'decimal:2',
    ];
}