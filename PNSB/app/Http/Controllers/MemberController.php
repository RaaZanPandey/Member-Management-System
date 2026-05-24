<?php

namespace App\Http\Controllers;
use App\Models\Members;
use Illuminate\Http\Request;
use App\Services\UserService;

class MemberController extends Controller
{
    public function getAllMember(){
        return response()->json(Members::all());
    }

    public function getById($id){
        $member = Members::find($id);

        if (!$member) {
            return response()->json([
                "message" => "Member not found"
            ], 404);
          }
        return response()->json($member);
    }

    public function updateDefault(UserService $userservice){
     try{
      $userservice = $userservice->filterDefaulter();
      return response()->json(['message' => 'Defaulter check completed']);

     } catch (Exception $e){
           return response()->json(["message" => $e->getMessage()]);
     }
    }

    public function updateMember(Request $request, $id) {
       $member = Members::find($id);
    
       if (!$member) {
          return response()->json(['message' => 'Member not found'], 404);
       }
       $member->update($request->all());
    
       return response()->json(['message' => 'Member updated successfully'], 200);
     }

    public function deleteMember($id){
    try{
        $member = Members::find($id);
        if (!$member) {
            return response()->json([
                "message" => "Member not found"
            ], 404);
          }
        $member->delete();
        return response()->json(['message'=>'Member deleted succesfully'], 200);
    }    
    catch (Exception $e){
        return response()->json(['message' => $e->getMessage()], 500);
     }
    }

    
    public function importCSV(Request $request){
     if (!$request->hasFile('file')) {
        return response()->json(['message' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');
    $handle = fopen($file->getPathname(), 'r');

    // Skip header row
    fgetcsv($handle);

    $imported = 0;
    $existingIds = Members::pluck('id')->toArray();

    while (($row = fgetcsv($handle)) !== false) {
        $id = $row[0] ?? null;

        // Skip if already exists
        if (!$id || in_array($id, $existingIds)) continue;

        Members::create([
            'name'                    => $row[1]  ?? null,
            'blood_group'             => $row[2]  ?? null,
            'phone_number'            => $row[3]  ?? null,
            'registration_number'     => $row[4]  ?? null,
            'father_or_husband_name'  => $row[5]  ?? null,
            'dob'                     => $row[6]  ?? null,
            'address'                 => $row[7]  ?? null,
            'area'                    => $row[8]  ?? null,
            'postal_code'             => $row[9]  ?? null,
            'profession'              => $row[10] ?? null,
            'position'                => $row[11] ?? null,
            'workplace_name'          => $row[12] ?? null,
            'interest'                => $row[13] ?? null,
            'education_qualification' => $row[14] ?? null,
            'number_of_family_members'=> $row[15] ?? null,
            'membership_type'         => $row[16] ?? null,
            'registration_date'       => $row[17] ?? null,
            'is_board_members'        => $row[18] ?? null,
            'reference_by'            => $row[19] ?? null,
            'registration_fee'        => $row[20] ?? 0,
            'society_fee'             => $row[21] ?? 0,
            'donation'                => $row[22] ?? 0,
            'total'                   => $row[23] ?? 0,
        ]);

        $imported++;
    }

    fclose($handle);

    return response()->json([
        'message' => $imported . ' new members imported successfully'
    ], 200);
}

public function exportExcel()
{
    $members = Members::all();

    $headers = [
        'Content-Type'        => 'text/csv',
        'Content-Disposition' => 'attachment; filename="members.csv"',
    ];

    $callback = function () use ($members) {
        $file = fopen('php://output', 'w');

        // Header Row — all real columns
        fputcsv($file, [
            'ID',
            'Name',
            'Blood Group',
            'Phone Number',
            'Registration Number',
            'Father/Husband Name',
            'Date of Birth',
            'Address',
            'Area',
            'Postal Code',
            'Profession',
            'Position',
            'Workplace Name',
            'Interest',
            'Education Qualification',
            'Number of Family Members',
            'Membership Type',
            'Registration Date',
            'Is Board Member',
            'Reference By',
            'Registration Fee',
            'Society Fee',
            'Donation',
            'Total',
        ]);

        // Data Rows — all real columns
        foreach ($members as $m) {
            fputcsv($file, [
                $m->id,
                $m->name,
                $m->blood_group,
                $m->phone_number,
                $m->registration_number,
                $m->father_or_husband_name,
                $m->dob,
                $m->address,
                $m->area,
                $m->postal_code,
                $m->profession,
                $m->position,
                $m->workplace_name,
                $m->interest,
                $m->education_qualification,
                $m->number_of_family_members,
                $m->membership_type,
                $m->registration_date,
                $m->is_board_members,
                $m->reference_by,
                $m->registration_fee,
                $m->society_fee,
                $m->donation,
                $m->total,
            ]);
        }

        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}
}
