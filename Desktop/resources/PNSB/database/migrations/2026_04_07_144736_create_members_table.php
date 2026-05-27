<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('members', function (Blueprint $table) {
       $table->id();
       $table->string('name');
       $table->integer('registration_number');
       $table->string('phone_number');
       $table->string('blood_group');
       $table->string('father_or_husband_name');
       $table->date('dob');
       $table->text('address');
       $table->text('area');
       $table->string('postal_code');
       $table->string('interest');
       $table->string('profession'); 
       $table->string('position');
       $table->string('workplace_name');
       $table->string('education_qualification'); 
       $table->integer('number_of_family_members'); 
       $table->date('registration_date');
       $table->integer('registration_fee');
       $table->integer('society_fee');
       $table->integer('donation')->default(0);
       $table->integer('total');
       $table->string('reference_by');
       $table->string('membership_type'); 
        $table->string('is_board_members'); 
       $table->timestamps(); 
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
