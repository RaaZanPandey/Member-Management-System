import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

// ─── Word Map ───────────────────────────────────────────────────────────────
const wordMap = {
  // Personal
  'name': 'नाम',
  'registration number': 'दर्ता नम्बर',
  'phone number': 'फोन नम्बर',
  'blood group': 'रक्त समूह',
  'father or husband name': 'बुबा वा पतिको नाम',
  'date of birth': 'जन्म मिति',
  'address': 'ठेगाना',
  'area': 'क्षेत्र',
  'Lifetime address': 'स्थायी ठेगाना',
  'temporary address': 'अस्थायी ठेगाना',
  'postal code': 'हुलाक कोड',

  // Professional
  'profession': 'पेशा',
  'position': 'पद',
  'interest': 'रुचि',
  'workplace name': 'कार्यस्थलको नाम',
  'workplace postal code': 'कार्यस्थल हुलाक कोड',
  'education qualification': 'शैक्षिक योग्यता',
  'number of family members': 'परिवारका सदस्य संख्या',

  // Membership
  'membership type': 'सदस्यता प्रकार',
  'registration date': 'दर्ता मिति',
  'reference by': 'सन्दर्भ व्यक्ति',
  'is board members ?': 'बोर्ड सदस्य हो ?',

  // Fees
  'registration fee': 'दर्ता शुल्क',
  'society fee': 'समाज शुल्क',
  'donation': 'दान',
  'total': 'जम्मा',

  // Select options
  'lifetime': 'स्थायी',
  'general': 'साधारण',
  'yes': 'हो',
  'no': 'होइन',

  // Blood groups
  'a+': 'ए+', 'a-': 'ए-',
  'b+': 'बी+', 'b-': 'बी-',
  'o+': 'ओ+', 'o-': 'ओ-',
  'ab+': 'एबी+', 'ab-': 'एबी-',

  // Actions
  'reset': 'रद्द गर्नुहोस्',
  'submit': 'पेश गर्नुहोस्',
  'select': 'छान्नुहोस्',
}

const toNepaliDigits = (s) => String(s).replace(/[0-9]/g, d => '०१२३४५६७८९'[d])
const tr = (key, np) => np ? (wordMap[key.toLowerCase()] ?? key) : key

//  Field Config 
const FIELD_ORDER = [
  'name', 'blood_group', 'phone_number', 'registration_number', 'father_or_husband_name', 'dob',
  'address', 'area', 'postal_code', 'profession', 'position',
  'workplace_name', 'interest', 'education_qualification',
  'number_of_family_members', 'membership_type', 'registration_date',
  'is_board_members', 'reference_by', 'registration_fee', 'society_fee', 'donation',
]

const requiredFields = [
  'name', 'blood_group', 'phone_number', 'father_or_husband_name', 'dob',
  'address', 'area', 'profession',
  'membership_type', 'registration_date', 'registration_fee',
]

const emptyForm = {
  name: '', blood_group: '', phone_number: '', registration_number: '', father_or_husband_name: '',
  dob: '', address: '', area: '', postal_code: '',
  interest: '', profession: '', position: '',
  workplace_name: '', education_qualification: '',
  number_of_family_members: '', registration_date: '', registration_fee: '',
  society_fee: 0, donation: 0, total: 0, reference_by: '',
  membership_type: '', is_board_members: '',
}

//  Keyboard Nav Hook 
const useKeyboardNav = () => {
  useEffect(() => {
    const handle = (e) => {
      const active = document.activeElement
      if (!active?.dataset?.field) return
      const currentIndex = FIELD_ORDER.indexOf(active.dataset.field)
      if (currentIndex === -1) return

      let nextIndex = null
      if (['ArrowDown', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault()
        nextIndex = (currentIndex + 1) % FIELD_ORDER.length
      } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        nextIndex = (currentIndex - 1 + FIELD_ORDER.length) % FIELD_ORDER.length
      }

      if (nextIndex !== null) {
        const nextEl = document.querySelector(`[data-field="${FIELD_ORDER[nextIndex]}"]`)
        nextEl?.focus()
        nextEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])
}

//  Shared Sub-components 
const FieldLabel = ({ label, required, isNepali }) => (
  <label className="block text-xs text-gray-500 mb-1">
    {tr(label, isNepali)}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

const TextInput = ({ name, type = 'text', value, onChange, error, isNepali }) => (
  <div>
    <input
      data-field={name}
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      className={`w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-gray-500 bg-white
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
    />
  </div>
)

const SelectInput = ({ name, options, value, onChange, error, isNepali }) => (
  <div>
    <select
      data-field={name}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      className={`w-full border rounded px-2 py-1.5 text-sm outline-none focus:border-gray-500 bg-white
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
    >
      <option value="">-- {tr('select', isNepali)} --</option>
      {options.map(o => (
        <option key={o} value={o}>
          {isNepali ? (wordMap[o.toLowerCase()] ?? o) : o}
        </option>
      ))}
    </select>
  </div>
)

const Row = ({ children }) => (
  <div className="grid grid-cols-2 gap-3 mb-3">{children}</div>
)

const Section = ({ en, np, isNepali }) => (
  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 border-b border-gray-200 pb-1 mt-4 mb-3">
    {isNepali ? np : en}
  </p>
)

//  Main Component 
const MemberForm = ({ member, onClose }) => {
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isNepali, setIsNepali] = useState(false)
  const [formData, setFormData] = useState(
    member ? {
      name: member.name || '',
      blood_group: member.blood_group || '',
      phone_number: member.phone_number || '',
      registration_number: member.registration_number || '',
      father_or_husband_name: member.father_or_husband_name || '',
      dob: member.dob || '',
      address: member.address || '',
      area: member.area || '',
      postal_code: member.postal_code || '',
      interest: member.interest || '',
      profession: member.profession || '',
      position: member.position || '',
      workplace_name: member.workplace_name || '',
      education_qualification: member.education_qualification || '',
      number_of_family_members: member.number_of_family_members || '',
      registration_date: member.registration_date || '',
      registration_fee: member.registration_fee || '',
      society_fee: member.society_fee || 0,
      donation: member.donation || 0,
      total: member.total || 0,
      reference_by: member.reference_by || '',
      membership_type: member.membership_type || '',
      is_board_members: member.is_board_members || '',
    } : emptyForm
  )

  const isEditMode = member !== null;
  useKeyboardNav()

  const validate = (data) => {
    const errs = {}
    requiredFields.forEach(f => {
      if (!data[f] || String(data[f]).trim() === '') {
        console.log(f)
        errs[f] = 'required'
      }
    })
    console.log(errs)
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
    if (errors[name]) setErrors(prev => { const next = { ...prev }; delete next[name]; return next })
  }

  const handleReset = () => {
    setFormData(emptyForm)
    setErrors({})
    setSubmitted(false)
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    const errs = validate(formData)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error(isNepali ? 'कृपया सबै आवश्यक फिल्डहरू सही तरिकाले भर्नुहोस्' : 'Please fill all required fields correctly')
      return
    }


    //To add the member
    const cleanData = {
      ...formData,
      dob: formData.dob || null,
      registration_number: formData.registration_number || null,
      registration_date: formData.registration_date || null,
      father_or_husband_name: formData.father_or_husband_name || null,
      profession: formData.profession || null,
      position: formData.position || null,
      interest: formData.interest || null,
      workplace_name: formData.workplace_name || null,
      education_qualification: formData.education_qualification || null,
      reference_by: formData.reference_by || null,
      address: formData.address || null,
      is_board_members: formData.is_board_members || "No",
      number_of_family_members: formData.number_of_family_members ? Number(formData.number_of_family_members) : null,
      registration_fee: Number(formData.registration_fee) || 0,
      society_fee: Number(formData.society_fee) || 0,
      donation: Number(formData.donation) || 0,
      total: Number(formData.total) || 0,
    }


    const token = localStorage.getItem('authToken')
    try {
      if (isEditMode) {
        const response = await axios.put(`http://127.0.0.1:8000/api/update_member/${member.id}`, cleanData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
        if (response.status === 200) {
          toast.success(isNepali ? 'सदस्य जानकारी अपडेट भयो!' : 'Member updated successfully!')
          onClose()
        }
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/registration', cleanData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        })
        if (response.status === 201) {
          toast.success(isNepali ? 'दर्ता सफलतापूर्वक सम्पन्न भयो!' : 'Registration done successfully!')
          handleReset()
          onClose()
        }
      }
    } catch (error) {
      if (error.response && error.response.status == 401) {
        toast.error(isNepali ? 'तपाईं प्रमाणित हुनुहुन्न। कृपया पहिले लग इन गर्नुहोस्।' : 'You are not authenticated. Please log in first.')
      } else {
        console.error(error.response?.data || error)
        toast.error(isNepali ? 'केही समस्या भयो, पुनः प्रयास गर्नुहोस्' : 'Something went wrong, please try again')
      }
    }
  }

  // Shorthand helpers
  const inp = (name, type = 'text') => (
    <TextInput name={name} type={type} value={formData[name]} onChange={handle} error={errors[name]} isNepali={isNepali} />
  )
  const sel = (name, options) => (
    <SelectInput name={name} options={options} value={formData[name]} onChange={handle} error={errors[name]} isNepali={isNepali} />
  )
  const lbl = (label, req = false) => <FieldLabel label={label} required={req} isNepali={isNepali} />
  const sec = (en, np) => <Section en={en} np={np} isNepali={isNepali} />

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
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
            <button
              onClick={() => setIsNepali(!isNepali)}
              className="border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded"
            >
              {isNepali ? 'Switch to English' : 'नेपालीमा रूपान्तरण'}
            </button>
          </div>
          <button className="text-red-800 hover:text-red-600" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 flex-1">

          {sec('Personal Information', 'व्यक्तिगत जानकारी')}
          <Row>
            <div>{lbl('Name', true)}{inp('name')}</div>
            <div>{lbl('Blood Group', true)}{sel('blood_group', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}</div>
            <div>{lbl('Phone Number', true)}{inp('phone_number')}</div>
            <div>{lbl('Registration number', true)}{inp('registration_number')}</div>
          </Row>
          <Row>
            <div>{lbl('Father or Husband Name', true)}{inp('father_or_husband_name')}</div>
            <div>{lbl('Date of Birth', true)}{inp('dob', 'date')}</div>
          </Row>
          <Row>
            <div>{lbl('Address', true)}{inp('address')}</div>
            <div>{lbl('Area', true)}{sel('area', [
              'Govindpura',
              'Siddipura',
              'Shivaji Nagar',
              'Bharat Nagar',
              'Kolar Colony',
              'Arera Colony',
              'TT Nagar',
              'Vallabh Nagar',
              'Jahangirabad',
              'Purani Bhopal',
              'Audyogik Kshetra'
            ])}</div>          </Row>
          <Row>
            <div>{lbl('Postal Code', true)}{inp('postal_code')}</div>
          </Row>

          {sec('Professional Information', 'व्यावसायिक जानकारी')}
          <Row>
            <div>{lbl('Profession', true)}{inp('profession')}</div>
            <div>{lbl('Position')}{inp('position')}</div>
            <div>{lbl('Workplace Name')}{inp('workplace_name')}</div>
          </Row>
          <Row>
            <div>{lbl('Interest')}{inp('interest')}</div>
          </Row>
          <Row>
            <div>{lbl('Education Qualification')}{inp('education_qualification')}</div>
            <div>{lbl('Number of Family Members')}{inp('number_of_family_members', 'number')}</div>
          </Row>

          {sec('Membership Details', 'सदस्यता विवरण')}
          <Row>
            <div>{lbl('Membership Type', true)}{sel('membership_type', ['Lifetime', 'General'])}</div>
            <div>{lbl('Registration Date', true)}{inp('registration_date', 'date')}</div>
            <div>{lbl('Is Board Members ?', true)}{sel('is_board_members', ['Yes', 'No'])}</div>
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
                  value={formData[f] ?? ''}
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
              <input
                type="text"
                readOnly
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
            <button
              onClick={handleReset}
              className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm px-4 py-1.5 rounded"
            >
              {tr('reset', isNepali)}
            </button>
            <button
              onClick={handleSubmit}
              className="border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-5 py-1.5 rounded"
            >
              {tr('submit', isNepali)}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MemberForm