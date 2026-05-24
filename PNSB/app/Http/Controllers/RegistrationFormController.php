<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Models\Members;
use Illuminate\Http\Request;

class RegistrationFormController extends Controller
{
    public function store(Request $request)
    {
        try{
            //Validate request
        $request->validate([
            'name' => 'required|string|max:50',
            'registration_number' => 'required|integer|min:1',
            'phone_number' => 'required|string|max:255',
            'blood_group' => 'required|string|max:10',
            'father_or_husband_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'address' => 'required|string',
            'area' => 'nullable|string',
            'postal_code' => 'required|string|max:10',
            'interest' => 'required|string',
            'profession' => 'required|string',
            'position' => 'required|string',
            'workplace_name' => 'required|string',
            'education_qualification' => 'required|string',
            'number_of_family_members' => 'required|integer|min:1',
            'registration_date' => 'required|date',
            'registration_fee' => 'required|numeric',
            'society_fee' => 'required|numeric',
            'donation' => 'nullable|numeric',
            'total' => 'required|numeric',
            'reference_by' => 'nullable|string',
        ]);

        //Store data
        $form = Members::create($request->all());

        // Return response
        return response()->json([
            'message' => 'Registration form submitted successfully',
            'data' => $form
        ], 201);
        
        }
        catch (\Exception $e) {
        Log::error($e);
        return response()->json(['error' => $e->getMessage()], 500);
         }
    }
}