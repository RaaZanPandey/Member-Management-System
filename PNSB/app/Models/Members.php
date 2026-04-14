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
        'blood_group',
        'father_or_husband_name',
        'dob',
        'permanent_address',
        'temporary_address',
        'postal_code',
        'email',
        'interest',
        'profession',
        'position',
        'monthly_income',
        'workplace_name',
        'workplace_postal_code',
        'education_qualification',
        'number_of_family_members',
        'registration_date',
        'registration_fee',
        'society_fee',
        'donation',
        'total',
        'reference_by',
        'membership_type'
    ];

    protected $casts = [
        'dob' => 'date',
        'registration_date' => 'date',
        'monthly_income' => 'decimal:2',
        'registration_fee' => 'decimal:2',
        'society_fee' => 'decimal:2',
        'donation' => 'decimal:2',
        'total' => 'decimal:2',
    ];
}