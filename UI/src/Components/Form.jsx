import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

// ─── Word Map 
const wordMap = {
  'name': 'नाम','phone number': 'फोन नम्बर', 'blood group': 'रक्त समूह', 'father or husband name': 'बुबा वा पतिको नाम',
  'date of birth': 'जन्म मिति', 'permanent address': 'स्थायी ठेगाना',
  'temporary address': 'अस्थायी ठेगाना', 'postal code': 'हुलाक कोड', 'email': 'इमेल',
  'interest': 'रुचि', 'profession': 'पेशा', 'position': 'पद', 'monthly income': 'मासिक आय',
  'workplace name': 'कार्यस्थलको नाम', 'workplace postal code': 'कार्यस्थल हुलाक कोड',
  'education qualification': 'शैक्षिक योग्यता', 'number of family members': 'परिवारका सदस्य संख्या',
  'registration date': 'दर्ता मिति', 'registration fee': 'दर्ता शुल्क',
  'society fee': 'समाज शुल्क', 'donation': 'दान', 'total': 'जम्मा',
  'reference by': 'सन्दर्भ व्यक्ति', 'membership type': 'सदस्यता प्रकार',
  'permenant': 'स्थायी', 'temporary': 'अस्थायी',
  'a+': 'ए+', 'a-': 'ए-', 'b+': 'बी+', 'b-': 'बी-',
  'o+': 'ओ+', 'o-': 'ओ-', 'ab+': 'एबी+', 'ab-': 'एबी-',
  'reset': 'रद्द गर्नुहोस्', 'submit': 'पेश गर्नुहोस्',
}

const toNepaliDigits = (s) => String(s).replace(/[0-9]/g, d => '०१२३४५६७८९'[d])
const tr = (key, np) => np ? (wordMap[key.toLowerCase()] || key) : key

const FIELD_ORDER = [
  'name', 'blood_group','phone_number', 'father_or_husband_name', 'dob',
  'permanent_address', 'temporary_address', 'postal_code', 'email',
  'profession', 'position', 'monthly_income', 'interest',
  'workplace_name', 'workplace_postal_code', 'education_qualification',
  'number_of_family_members', 'membership_type', 'registration_date',
  'reference_by', 'registration_fee', 'society_fee', 'donation'
]

const requiredFields = [
  'name', 'blood_group','phone_number', 'father_or_husband_name', 'dob',
  'permanent_address', 'postal_code', 'email', 'profession',
  'membership_type', 'registration_date', 'registration_fee'
]

const emptyForm = {
  name: '', blood_group: '',phone_number: '', father_or_husband_name: '', dob: '',
  permanent_address: '', temporary_address: '', postal_code: '',
  email: '', interest: '', profession: '', position: '',
  monthly_income: 0, workplace_name: '', workplace_postal_code: '',
  education_qualification: '', number_of_family_members: '',
  registration_date: '', registration_fee: 0, society_fee: 0,
  donation: 0, total: 0, reference_by: '', membership_type: ''
}

//  Keyboard Nav Hook 
const useKeyboardNav = () => {
  useEffect(() => {
    const handle = (e) => {
      const active = document.activeElement
      if (!active || !active.dataset.field) return
      const currentIndex = FIELD_ORDER.indexOf(active.dataset.field)
      if (currentIndex === -1) return

      let nextIndex = null
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        nextIndex = (currentIndex + 1) % FIELD_ORDER.length
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        nextIndex = (currentIndex - 1 + FIELD_ORDER.length) % FIELD_ORDER.length
      }

      if (nextIndex !== null) {
        const nextEl = document.querySelector(`[data-field="${FIELD_ORDER[nextIndex]}"]`)
        if (nextEl) {
          nextEl.focus()
          nextEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])
}


const FieldLabel = ({ label, required, isNepali }) => (
  <label className="block text-xs text-gray-500 mb-1">
    {tr(label, isNepali)}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

const FieldError = ({ error, isNepali }) => error ? (
  <p className="text-xs text-red-500 mt-0.5">
    {error === 'invalid_email'
      ? (isNepali ? 'अमान्य इमेल ठेगाना' : 'Invalid email address')
      : (isNepali ? 'यो फिल्ड आवश्यक छ' : 'This field is required')}
  </p>
) : null

const TextInput = ({ name, type = 'text', value, onChange, error, isNepali }) => (
  <div>
    <input
      data-field={name}
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-gray-500 bg-white
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
    />
    <FieldError error={error} isNepali={isNepali} />
  </div>
)

const SelectInput = ({ name, options, value, onChange, error, isNepali }) => (
  <div>
    <select
      data-field={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-gray-500 bg-white
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
    >
      <option value="">-- {isNepali ? 'छान्नुहोस्' : 'Select'} --</option>
      {options.map(o => (
        <option key={o} value={o}>{isNepali ? (wordMap[o.toLowerCase()] || o) : o}</option>
      ))}
    </select>
    <FieldError error={error} isNepali={isNepali} />
  </div>
)

const Row = ({ children }) => <div className="grid grid-cols-2 gap-3 mb-3">{children}</div>

const Section = ({ en, np, isNepali }) => (
  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-200 pb-1 mt-4 mb-3">
    {isNepali ? np : en}
  </p>
)

const MemberForm = ({ onClose }) => {
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isNepali, setIsNepali] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  useKeyboardNav()

  const validate = (data) => {
    const errs = {}
    requiredFields.forEach(f => {
      if (!data[f] || String(data[f]).trim() === '') errs[f] = 'required'
    })
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs['email'] = 'invalid_email'
    return errs
  }

  const handle = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      if (['registration_fee', 'society_fee', 'donation'].includes(name)) {
        const rf = parseFloat(updated.registration_fee) || 0
        const sf = parseFloat(updated.society_fee) || 0
        const dn = parseFloat(updated.donation) || 0
        updated.total = (rf + sf + dn).toFixed(2)
      }
      return updated
    })
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next })
    }
  }

  async function handleSubmit() {
  setSubmitted(true)

  const errs = validate(formData)
  setErrors(errs)

  if (Object.keys(errs).length > 0) {
    toast.error("Please fill all required fields correctly")
    return
  }

  const token = localStorage.getItem('authToken');

  const cleanData = {
    ...formData,

    dob: formData.dob || null,
    registration_date: formData.registration_date || null,

    father_or_husband_name: formData.father_or_husband_name || null,
    profession: formData.profession || null,
    position: formData.position || null,
    interest: formData.interest || null,
    workplace_name: formData.workplace_name || null,
    workplace_postal_code: formData.workplace_postal_code || null,
    education_qualification: formData.education_qualification || null,
    reference_by: formData.reference_by || null,
    temporary_address: formData.temporary_address || null,

    monthly_income: formData.monthly_income ? Number(formData.monthly_income) : null,
    number_of_family_members: formData.number_of_family_members
      ? Number(formData.number_of_family_members)
      : null,

    registration_fee: Number(formData.registration_fee) || 0,
    society_fee: Number(formData.society_fee) || 0,
    donation: Number(formData.donation) || 0,
    total: Number(formData.total) || 0,
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/registration',
      cleanData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (response.status === 201) {
      toast.success("Registration done successfully!")
      handleReset()
      onClose()
    }

  } catch (error) {
    console.log(error.response?.data || error)
    toast.error("Something went wrong")
  }
}
  
  const handleReset = () => {
    setFormData(emptyForm)
    setErrors({})
    setSubmitted(false)
    setSuccessMsg(false)
  }

  const inp = (name, type = 'text') => (
    <TextInput name={name} type={type} value={formData[name]}
      onChange={handle} error={errors[name]} isNepali={isNepali} />
  )

  const sel = (name, options) => (
    <SelectInput name={name} options={options} value={formData[name]}
      onChange={handle} error={errors[name]} isNepali={isNepali} />
  )

  const lbl = (label, req = false) => (
    <FieldLabel label={label} required={req} isNepali={isNepali} />
  )

  const sec = (en, np) => <Section en={en} np={np} isNepali={isNepali} />

  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white border border-gray-300 rounded-lg w-full flex flex-col"
        style={{ maxHeight: '92vh', maxWidth: '60vw' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-800">
            {isNepali ? 'सदस्य दर्ता फारम' : 'Member Registration Form'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              {isNepali ? 'नेभिगेसन: ↑↓←→ वा Enter' : 'Navigate: ↑↓←→ or Enter'}
            </span>
            <button onClick={() => setIsNepali(!isNepali)}
              className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded">
              {isNepali ? 'Switch to English' : 'नेपालीमा रूपान्तरण'}
            </button>
          </div>
          <button className='flex justify-end text-red-800' onClick={onClose}>✕</button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mx-5 mt-3 px-3 py-2 bg-green-50 border border-green-300 rounded text-xs text-green-700">
            {isNepali
              ? '✓ फारम सफलतापूर्वक पेश गरियो!'
              : '✓ Form submitted successfully! Check console for data.'}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 flex-1">

          {sec('Personal Information', 'व्यक्तिगत जानकारी')}
          <Row>
            <div>{lbl('Name', true)}{inp('name')}</div>
            <div>{lbl('Blood Group', true)}{sel('blood_group', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}</div>
             <div>{lbl('Phone Number', true)}{inp('phone_number')}</div>
          </Row>
          <Row>
            <div>{lbl('Father or Husband Name', true)}{inp('father_or_husband_name')}</div>
            <div>{lbl('Date of Birth', true)}{inp('dob', 'date')}</div>
          </Row>
          <Row>
            <div>{lbl('Permanent Address', true)}{inp('permanent_address')}</div>
            <div>{lbl('Temporary Address')}{inp('temporary_address')}</div>
          </Row>
          <Row>
            <div>{lbl('Postal Code', true)}{inp('postal_code')}</div>
            <div>{lbl('Email', true)}{inp('email', 'email')}</div>
          </Row>

          {sec('Professional Information', 'व्यावसायिक जानकारी')}
          <Row>
            <div>{lbl('Profession', true)}{inp('profession')}</div>
            <div>{lbl('Position')}{inp('position')}</div>
          </Row>
          <Row>
            <div>{lbl('Monthly Income')}{inp('monthly_income', 'number')}</div>
            <div>{lbl('Interest')}{inp('interest')}</div>
          </Row>
          <Row>
            <div>{lbl('Workplace Name')}{inp('workplace_name')}</div>
            <div>{lbl('Workplace Postal Code')}{inp('workplace_postal_code')}</div>
          </Row>
          <Row>
            <div>{lbl('Education Qualification')}{inp('education_qualification')}</div>
            <div>{lbl('Number of Family Members')}{inp('number_of_family_members', 'number')}</div>
          </Row>

          {sec('Membership Details', 'सदस्यता विवरण')}
          <Row>
            <div>{lbl('Membership Type', true)}{sel('membership_type', ['Permanent', 'Temporary'])}</div>
            <div>{lbl('Registration Date', true)}{inp('registration_date', 'date')}</div>
          </Row>
          <Row>
            <div>{lbl('Reference By')}{inp('reference_by')}</div>
          </Row>

          {sec('Fee Details', 'शुल्क विवरण')}
          <div className="grid grid-cols-4 gap-3 mb-2">
            {['registration_fee', 'society_fee', 'donation'].map(f => (
              <div key={f}>
                <label className="block text-xs text-gray-500 mb-1">
                  {tr(f.replace(/_/g, ' '), isNepali)}
                  {f === 'registration_fee' && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <input
                  data-field={f}
                  type="number"
                  name={f}
                  value={formData[f] || ''}
                  onChange={handle}
                  className={`w-full border rounded px-2 py-1.5 text-sm outline-none bg-white
                    ${errors[f] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                />
                {errors[f] && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {isNepali ? 'यो फिल्ड आवश्यक छ' : 'This field is required'}
                  </p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1">{tr('total', isNepali)}</label>
              <input type="text" readOnly
                value={isNepali ? toNepaliDigits(formData.total || '0') : (formData.total || '0')}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-100 text-gray-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 flex-shrink-0">
          <div>
            {submitted && Object.keys(errors).length > 0 && (
              <p className="text-xs text-red-500">
                {isNepali ? 'कृपया आवश्यक फिल्डहरू भर्नुहोस्' : 'Please fill all required fields'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={handleReset}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm px-4 py-1.5 rounded">
              {tr('reset', isNepali)}
            </button>
            <button onClick={handleSubmit}
              className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-5 py-1.5 rounded">
              {tr('submit', isNepali)}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MemberForm