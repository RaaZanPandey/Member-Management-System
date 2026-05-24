<?php

namespace App\Services;
use App\Models\Members;
use Illuminate\Support\Carbon;

class UserService{
    public function filterDefaulter() : void{
       $generalmember = Members::Where('membership_type', 'General')->get();
       Members::where('membership_type', 'General')
       ->where('registration_date', '<', Carbon::now()->subMonths(12))
       ->update(['membership_type' => 'Defaulter']);
    }
}