<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegistrationFormController;
use App\Http\Controllers\MemberController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/registration', [RegistrationFormController::class, 'store']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/get_all', [MemberController::class, 'getAllMember']);

Route::middleware('auth:sanctum')->get('/get_by_id/{id}', [MemberController::class, 'getById']);

Route::middleware('auth:sanctum')->post('/update_default', [MemberController::class, 'updateDefault']);

Route::middleware('auth:sanctum')->delete('/delete_member/{id}', [MemberController::class, 'deleteMember']);

Route::middleware('auth:sanctum')->put('/update_member/{id}', [MemberController::class, 'updateMember']);

Route::middleware('auth:sanctum')->post('/import-csv', [MemberController::class, 'importCSV']);

Route::middleware('auth:sanctum')->get('/export-csv', [MemberController::class, 'exportExcel']);