<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register (Request $request){
       $request->validate([
           'name'     => 'required|string|max:255',
            'mobile'   => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:6'
       ]);

       $user = User::create([
            'name'     => $request->name,
            'mobile'   => $request->mobile,
            'password' => $request->password,
            'role'     => 'admin', 
       ]);

       $token = $user->createToken('auth-token')->plainTextToken;


       return response()->json([
          'message' => 'User register succesfully',
          'token' => $token,
          'user' => $user 
       ]);
    }



public function login(Request $request)
{
    $request->validate([
        'mobile' => 'required',
        'password' => 'required'
    ]);

    
    $user = User::where('mobile', $request->mobile)->first();


    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }


    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user
    ]);
}


public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
}
}
