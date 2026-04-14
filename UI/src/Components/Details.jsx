import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Details = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    extractUser();
  }, []);

  async function extractUser() {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_by_id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        setMember(response.data);
        console.log(member);
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch user data !");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg font-medium">
            Loading member details...
          </p>
        </div>
      </div>
    );
  }

  if (!member) {
    return <div className="p-5">Member not found</div>;
  }

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-base">{value || "-"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">

      <div className="bg-white w-[70vw] max-h-[90vh] overflow-y-auto p-6 rounded shadow">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Member Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Personal Info */}
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Name" value={member.name} />
          <Field label="Blood Group" value={member.blood_group} />
          <Field label="Phone number" value={member.phone_number} />
          <Field label="Father/Husband Name" value={member.father_or_husband_name} />
          <Field label="Date of Birth" value={member.dob.substring(0, 10)} />
          <Field label="Permanent Address" value={member.permanent_address} />
          <Field label="Temporary Address" value={member.temporary_address} />
          <Field label="Postal Code" value={member.postal_code} />
          <Field label="Email" value={member.email} />
        </div>

        {/* Professional Info */}
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Professional Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Profession" value={member.profession} />
          <Field label="Position" value={member.position} />
          <Field label="Monthly Income" value={member.monthly_income} />
          <Field label="Interest" value={member.interest} />
          <Field label="Workplace Name" value={member.workplace_name} />
          <Field label="Workplace Postal Code" value={member.workplace_postal_code} />
          <Field label="Education Qualification" value={member.education_qualification} />
          <Field label="Family Members" value={member.number_of_family_members} />
        </div>

        {/* Membership */}
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Membership Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Membership Type" value={member.membership_type} />
          <Field label="Registration Date" value={member.registration_date.substring(0, 10)} />
          <Field label="Reference By" value={member.reference_by} />
        </div>

        {/* Fees */}
        <h3 className="text-lg font-semibold mb-3 border-b pb-1">Fee Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <Field label="Registration Fee" value={member.registration_fee} />
          <Field label="Society Fee" value={member.society_fee} />
          <Field label="Donation" value={member.donation} />
          <Field label="Total" value={member.total} />
        </div>

      </div>
    </div>
  );
};

export default Details;