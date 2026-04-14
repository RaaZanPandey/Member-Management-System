<?php

namespace App\Http\Controllers;
use App\Models\Members;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function getAllMember(){
        return response()->json(members::all());
    }

    public function getById($id){
        $member = members::find($id);

        if (!$member) {
            return response()->json([
                "message" => "Member not found"
            ], 404);
          }
        return response()->json($member);

    }
}
