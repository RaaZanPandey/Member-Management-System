import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Details = () => {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMember()
  }, [])

  const fetchMember = async () => {
    setLoading(true)
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get_by_id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200) setMember(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Unable to fetch member data!")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Loading member details...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return <div className="p-5 text-gray-500">Member not found</div>
  }

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-base">{value || "-"}</span>
    </div>
  )

  const Section = ({ title }) => (
    <h3 className="text-lg font-semibold mb-3 border-b pb-1">{title}</h3>
  )

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white w-[70vw] max-h-[90vh] overflow-y-auto p-6 rounded shadow">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Member Details</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
            ← Back
          </button>
        </div>

        {/* Personal Information */}
        <Section title="Personal Information" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Name" value={member.name} />
          <Field label="Blood Group" value={member.blood_group} />
          <Field label="Phone Number" value={member.phone_number} />
          <Field label="Registration No." value={member.registration_number} />
          <Field label="Father / Husband Name" value={member.father_or_husband_name} />
          <Field label="Date of Birth" value={member.dob?.substring(0, 10)} />
          <Field label="Address" value={member.permanent_address} />
          <Field label="Area" value={member.area} />
          <Field label="Postal Code" value={member.postal_code} />
        </div>

        {/* Professional Information */}
        <Section title="Professional Information" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Profession" value={member.profession} />
          <Field label="Position" value={member.position} />
          <Field label="Workplace Name" value={member.workplace_name} />
          <Field label="Interest" value={member.interest} />
          <Field label="Education Qualification" value={member.education_qualification} />
          <Field label="Family Members" value={member.number_of_family_members} />
        </div>

        {/* Membership Details */}
        <Section title="Membership Details" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Membership Type" value={member.membership_type} />
          <Field label="Registration Date" value={member.registration_date?.substring(0, 10)} />
          <Field label="Is Board Member" value={member.is_board_members} />
          <Field label="Reference By" value={member.reference_by} />
        </div>

        {/* Fee Details */}
        <Section title="Fee Details" />
        <div className="grid grid-cols-4 gap-4">
          <Field label="Registration Fee" value={member.registration_fee} />
          <Field label="Society Fee" value={member.society_fee} />
          <Field label="Donation" value={member.donation} />
          <Field label="Total" value={member.total} />
        </div>

      </div>
    </div>
  )
}

export default Details