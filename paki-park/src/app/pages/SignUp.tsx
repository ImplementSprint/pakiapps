import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Phone, Mail, Eye, EyeOff, Shield, Zap, Clock,
  User, UserCog, AlertCircle, CheckCircle, FileText,
  Upload, Camera, MapPin, Building2, Calendar, ChevronLeft,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import logo from 'figma:asset/430f6b7df4e30a8a6fddb7fbea491ba629555e7c.png';
import pakiShipLogo from "figma:asset/d0a94c34a139434e20f5cb9888d8909dd214b9e7.png";
import { authService } from '../services/authService';

/* ─────────────────────────────────────────
   Business Partner — Reminders Modal
───────────────────────────────────────── */
function BPRemindersModal({ onProceed }: { onProceed: () => void }) {
  const reminders = [
    {
      icon: <Building2 className="size-5" />,
      color: 'text-[#ee6b20]',
      bg: 'bg-orange-50',
      title: 'Business Registration Required',
      desc: 'Make sure your parking facility is officially registered with the LGU or relevant government agency before signing up.',
    },
    {
      icon: <FileText className="size-5" />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      title: 'Document Requirements',
      desc: 'Prepare your Business Permit, DTI/SEC Registration, and proof of ownership or lease of the parking facility.',
    },
    {
      icon: <Shield className="size-5" />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      title: 'Compliance & Safety',
      desc: 'Your parking facility must comply with DPWH and local safety standards. Inspections may be required before approval.',
    },
    {
      icon: <AlertCircle className="size-5" />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      title: 'Review Process',
      desc: 'Applications are reviewed within 3–5 business days. You will be notified via email once your account is approved.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-2xl bg-[#e8eff5] flex items-center justify-center">
            <AlertCircle className="size-6 text-[#1e3d5a]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1e3d5a]">Reminders for Business Partners</h2>
        </div>

        {/* Reminder items */}
        <div className="space-y-3 mb-8">
          {reminders.map((r, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-[#f1f5f9]">
              <div className={`size-9 rounded-xl ${r.bg} flex items-center justify-center flex-shrink-0 ${r.color}`}>
                {r.icon}
              </div>
              <div>
                <p className="font-bold text-[#1e3d5a] text-sm">{r.title}</p>
                <p className="text-[#8492a6] text-xs mt-0.5 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onProceed}
          className="w-full h-13 bg-[#1e3d5a] hover:bg-[#2a5373] text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg"
        >
          Proceed to Sign Up
        </Button>
        <p className="text-center text-[#8492a6] text-xs mt-3">
          By proceeding, you confirm that you have read and understood these reminders.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Business Partner — Step 1: Personal Info
───────────────────────────────────────── */
function BPStep1({
  formData, setFormData, onNext,
}: {
  formData: any; setFormData: (d: any) => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<any>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e: any = {};
    if (!formData.fullName) e.fullName = 'Required.';
    if (!formData.dob) e.dob = 'Required.';
    if (!formData.phone || formData.phone.length !== 10) e.phone = 'Must be exactly 10 digits.';
    if (!formData.email) e.email = 'Required.';
    if (!formData.street) e.street = 'Required.';
    if (!formData.city) e.city = 'Required.';
    if (!formData.province) e.province = 'Required.';
    if (formData.password.length < 8 || !/\d/.test(formData.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      e.password = '8+ chars, 1 number, and 1 special char required.';
    }
    if (formData.password !== formData.confirm) e.confirm = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const field = (label: string, key: string, placeholder: string, icon: React.ReactNode, type = 'text', extra?: any) => (
    <div>
      <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">{label}</Label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8492a6]">{icon}</div>
        <Input
          type={type}
          placeholder={placeholder}
          className="h-12 pl-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
          value={formData[key] || ''}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          {...extra}
        />
      </div>
      {errors[key] && <p className="text-[11px] text-red-500 font-semibold mt-1 px-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-2 rounded-2xl overflow-hidden border border-[#e2e8f0]">
        <div className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-widest bg-[#1e3d5a] text-white">
          1. Personal Information
        </div>
        <div className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-[#8492a6]">
          2. Documents
        </div>
      </div>

      {/* Section label */}
      <div>
        <p className="text-[10px] font-bold text-[#ee6b20] tracking-widest uppercase flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#ee6b20] inline-block" /> Business Partner Application Form
        </p>
        <h3 className="text-2xl font-extrabold text-[#1e3d5a] mt-1">Personal Details</h3>
        <p className="text-[#8492a6] text-sm">Please provide your legal information and current location.</p>
      </div>

      {/* Personal details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Full Name', 'fullName', 'Juan dela Cruz', <User className="size-5" />)}
        {field('Date of Birth', 'dob', '', <Calendar className="size-5" />, 'date')}
      </div>

      {/* Phone */}
      <div>
        <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Phone Number</Label>
        <div className="flex gap-2">
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-4 flex items-center font-bold text-[#1e3d5a] text-sm flex-shrink-0">
            +63
          </div>
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
            <Input
              type="text"
              placeholder="9123456789"
              className="h-12 pl-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
              value={formData.phone || ''}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: v });
                setErrors((prev: any) => ({ ...prev, phone: v.length > 0 && v.length < 10 ? 'Must be exactly 10 digits.' : '' }));
              }}
            />
          </div>
        </div>
        {errors.phone && <p className="text-[11px] text-red-500 font-semibold mt-1 px-1">{errors.phone}</p>}
      </div>

      {field('Email Address', 'email', 'juan@example.com', <Mail className="size-5" />, 'email')}

      {/* Address section */}
      <div>
        <p className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase flex items-center gap-1.5 mb-3 opacity-70">
          <MapPin className="size-3.5" /> Address Details
        </p>
        <div className="space-y-3">
          {field('Street Address / House No.', 'street', 'Block 1, Lot 2, Sample St.', <MapPin className="size-5" />)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field('City / Municipality', 'city', 'Manila', <Building2 className="size-5" />)}
            {field('Province', 'province', 'Metro Manila', <MapPin className="size-5" />)}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Password</Label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
            <Input
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              className="h-12 pl-12 pr-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
              value={formData.password || ''}
              onChange={(e) => {
                const pwd = e.target.value;
                setFormData({ ...formData, password: pwd });
                if (pwd.length < 8 || !/\d/.test(pwd) || !/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
                  setErrors((p: any) => ({ ...p, password: '8+ chars, 1 number, and 1 special char required.' }));
                } else {
                  setErrors((p: any) => ({ ...p, password: '' }));
                }
              }}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8492a6]">
              {showPwd ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 font-semibold mt-1 px-1">{errors.password}</p>}
        </div>
        <div>
          <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Confirm Password</Label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="h-12 pl-12 pr-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
              value={formData.confirm || ''}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, confirm: val });
                setErrors((p: any) => ({ ...p, confirm: val && val !== formData.password ? "Passwords don't match." : '' }));
              }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8492a6]">
              {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {errors.confirm && <p className="text-[11px] text-red-500 font-semibold mt-1 px-1">{errors.confirm}</p>}
        </div>
      </div>

      <Button
        type="button"
        onClick={() => { if (validate()) onNext(); }}
        className="w-full h-13 bg-[#1e3d5a] hover:bg-[#2a5373] text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg mt-2"
      >
        Proceed to Documents
      </Button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Business Partner — Step 2: Documents
───────────────────────────────────────── */
function BPStep2({ onSubmit }: { onSubmit: () => void }) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    businessPermit: null,
    dtiSec: null,
    proofOfOwnership: null,
  });

  const uploads = [
    {
      key: 'businessPermit',
      label: "Business Permit",
      title: 'Upload Business Permit',
      desc: 'LGU-issued business permit (current year)',
      icon: <Upload className="size-6" />,
    },
    {
      key: 'dtiSec',
      label: 'DTI / SEC Registration',
      title: 'Upload DTI or SEC Certificate',
      desc: 'Business name or corporation registration',
      icon: <FileText className="size-6" />,
    },
    {
      key: 'proofOfOwnership',
      label: 'Proof of Facility Ownership / Lease',
      title: 'Upload Ownership or Lease Agreement',
      desc: 'Title, deed of sale, or signed lease contract',
      icon: <Camera className="size-6" />,
    },
  ];

  const handleFile = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-2 rounded-2xl overflow-hidden border border-[#e2e8f0]">
        <div className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-[#8492a6] bg-[#f8fafc]">
          1. Personal Information
        </div>
        <div className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-widest bg-[#1e3d5a] text-white">
          2. Documents
        </div>
      </div>

      {/* Requirements banner */}
      <div className="bg-[#f0fdf8] border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="size-5 text-emerald-500" />
          <p className="font-bold text-emerald-700 text-sm">Verification Requirements</p>
          <span className="ml-auto text-[10px] text-[#8492a6] font-bold uppercase tracking-widest">Business Partner Application</span>
        </div>
        <p className="text-xs text-emerald-600 font-medium mb-2">Accepted formats: JPEG, PNG, or PDF (Max 5MB).</p>
        <ul className="text-xs text-emerald-700 space-y-0.5 list-disc list-inside">
          <li>Valid Business Permit (current year)</li>
          <li>DTI or SEC Registration Certificate</li>
          <li>Proof of ownership or lease of parking facility</li>
        </ul>
      </div>

      {/* Upload zones */}
      {uploads.map((u) => (
        <div key={u.key}>
          <p className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-2 opacity-70">{u.label}</p>
          <label className="block cursor-pointer">
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => handleFile(u.key, e)} />
            <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 ${
              files[u.key]
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-[#e2e8f0] bg-[#f8fafc] hover:border-[#1e3d5a] hover:bg-[#f0f4f8]'
            }`}>
              {files[u.key] ? (
                <>
                  <CheckCircle className="size-8 text-emerald-500 mb-2" />
                  <p className="font-bold text-emerald-700 text-sm">{files[u.key]!.name}</p>
                  <p className="text-xs text-emerald-500 mt-0.5">Click to replace</p>
                </>
              ) : (
                <>
                  <div className="size-12 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center text-[#8492a6] mb-3">
                    {u.icon}
                  </div>
                  <p className="font-bold text-[#1e3d5a] text-sm">{u.title}</p>
                  <p className="text-xs text-[#8492a6] mt-0.5">{u.desc}</p>
                </>
              )}
            </div>
          </label>
        </div>
      ))}

      <Button
        type="button"
        onClick={onSubmit}
        className="w-full h-13 bg-[#1e3d5a] hover:bg-[#2a5373] text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg mt-2"
      >
        Submit Application
      </Button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main SignUp Component
───────────────────────────────────────── */
export function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [showReminders, setShowReminders] = useState(false);
  const [bpStep, setBpStep] = useState<null | 1 | 2>(null);
  const [bpForm, setBpForm] = useState({
    fullName: '', dob: '', phone: '', email: '',
    street: '', city: '', province: '',
    password: '', confirm: '',
  });

  // Customer form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [formData, setFormData] = useState({ name: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({ identifier: '', password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);

  const isPhone = /^\d/.test(identifier);

  const validatePassword = (pwd: string) => {
    if (pwd.length === 0) return '';
    if (pwd.length < 8 || !/\d/.test(pwd) || !/[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      return '8+ chars, 1 number, and 1 special char required.';
    return '';
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d+$/.test(val)) {
      if (val.length <= 10) {
        setIdentifier(val);
        setErrors((prev) => ({
          ...prev,
          identifier: val.length > 0 && val.length < 10 ? 'Mobile number must be exactly 10 digits.' : '',
        }));
      }
    } else {
      setIdentifier(val);
      setErrors((prev) => ({ ...prev, identifier: '' }));
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { identifier: '', password: '', confirm: '' };
    let hasError = false;
    if (isPhone && identifier.length !== 10) { newErrors.identifier = 'Mobile number must be exactly 10 digits.'; hasError = true; }
    const pwdError = validatePassword(formData.password);
    if (pwdError) { newErrors.password = pwdError; hasError = true; }
    if (formData.password !== formData.confirm) { newErrors.confirm = "Passwords don't match."; hasError = true; }
    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);
    try {
      const email = isPhone ? `+63${identifier}` : identifier;
      await authService.registerCustomer({
        name: formData.name,
        email,
        password: formData.password,
      });
      navigate('/customer/home');
    } catch (error: any) {
      // Fallback to localStorage if backend is unreachable
      if (error.message?.includes('Backend server is not running') || error.message?.includes('fetch')) {
        localStorage.setItem('userRole', 'customer');
        localStorage.setItem('userName', formData.name);
        localStorage.setItem('userEmail', identifier);
        navigate('/customer/home');
      } else {
        setErrors(prev => ({ ...prev, identifier: error.message || 'Registration failed.' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (r: 'customer' | 'admin') => {
    setRole(r);
    if (r === 'admin') setShowReminders(true);
  };

  const handleSocialSignup = (provider: string) => {
    if (provider === 'PakiShip') { alert('PakiShip Integration\n\nConnecting to your PakiShip account...'); return; }
    alert(`OAuth Integration Required for ${provider}.`);
  };

  const handleBPSubmit = async () => {
    setIsLoading(true);
    try {
      await authService.registerAdmin({
        name: bpForm.fullName,
        email: bpForm.email,
        phone: `+63${bpForm.phone}`,
        password: bpForm.password,
        accessCode: 'PAKIPARK_ADMIN_2026',
        address: { street: bpForm.street, city: bpForm.city, province: bpForm.province },
        dateOfBirth: bpForm.dob,
      });
      navigate('/admin/home');
    } catch (error: any) {
      // Fallback to localStorage if backend is unreachable
      if (error.message?.includes('Backend server is not running') || error.message?.includes('fetch')) {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', bpForm.fullName);
        localStorage.setItem('userEmail', bpForm.email);
        navigate('/admin/home');
      } else {
        alert(error.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f7fa] overflow-hidden">

      {/* Fixed header with back button — same as Login */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <ChevronLeft className="w-5 h-5 text-[#1e3d5a] group-hover:-translate-x-1 transition-transform" />
            <img src={logo} alt="PakiPark" className="h-9 object-contain" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
      {showReminders && (
        <BPRemindersModal onProceed={() => { setShowReminders(false); setBpStep(1); }} />
      )}

      {/* Left Info Sidebar */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-16 xl:px-20 pr-4 xl:pr-6 relative overflow-hidden bg-[#f4f7fa]">
        <div className="absolute top-[-10%] left-[-10%] size-96 bg-[#1e3d5a]/5 rounded-full blur-3xl" />
        <div className="mb-4 relative z-10">
          <span className="bg-[#e8eff5] text-[#1e3d5a] text-[10px] font-bold tracking-widest px-4 py-2 rounded-full uppercase border border-[#d0deeb]">
            Philippines' #1 Smart Parking Platform
          </span>
        </div>
        <div className="space-y-2 mb-6 relative z-10">
          <h1 className="text-5xl font-extrabold text-[#1e3d5a] leading-[1.1]">
            Tap. Reserve.<br />
            <span className="text-[#ee6b20]">Convenience</span> in Every Spot!
          </h1>
          <p className="text-base text-[#5a7184] font-medium">
            Create your account and start parking smarter today.
          </p>
        </div>
        <div className="space-y-2 max-w-lg relative z-10">
          {[
            { icon: <Zap className="size-5" />, title: "Instant Booking", desc: "Reserve your parking spot in under 30 seconds" },
            { icon: <Clock className="size-5" />, title: "Real-time Availability", desc: "Check live occupancy of city parking lots" },
            { icon: <Shield className="size-5" />, title: "Secure & Insured", desc: "Your vehicle is monitored and protected" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-white">
              <div className="size-11 bg-[#1e3d5a] rounded-xl flex items-center justify-center text-white flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="text-base font-bold text-[#1e3d5a]">{item.title}</h3>
                <p className="text-[#5a7184] text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-[55%] flex justify-center overflow-y-auto px-6 sm:px-8">
        <div className="w-full max-w-[680px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(30,61,90,0.1)] p-7 sm:p-10 mt-8 mb-8 border border-white self-start">

          {/* Heading */}
          <div className="mb-4 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[#1e3d5a] mb-1">Create Account</h2>
            <p className="text-[#8492a6] font-medium text-sm">Sign up to get started with PakiPark.</p>
          </div>

          {/* Role toggle */}
          <div className="flex gap-1 mb-5 bg-[#f0f4f8] p-1.5 rounded-2xl border border-[#e2e8f0]">
            {(['customer', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2.5 px-1 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === r ? 'bg-[#1e3d5a] text-white shadow-lg' : 'text-[#8492a6] hover:text-[#1e3d5a]'
                }`}
              >
                {r === 'customer' ? <User className="size-4" /> : <UserCog className="size-4" />}
                {r === 'customer' ? 'Customer' : 'Business Partner'}
              </button>
            ))}
          </div>

          {/* Business Partner multi-step form */}
          {role === 'admin' && bpStep === 1 && (
            <BPStep1 formData={bpForm} setFormData={setBpForm} onNext={() => setBpStep(2)} />
          )}
          {role === 'admin' && bpStep === 2 && (
            <BPStep2 onSubmit={handleBPSubmit} />
          )}

          {/* Customer form */}
          {role === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
                  <Input type="text" placeholder="Juan dela Cruz" className="h-12 pl-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
              </div>

              {/* Email/Phone */}
              <div>
                <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Email or Phone Number</Label>
                <div className="flex gap-2">
                  {isPhone && (
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-4 flex items-center font-bold text-[#1e3d5a] text-sm flex-shrink-0">+63</div>
                  )}
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8492a6]">
                      {isPhone ? <Phone className="size-5" /> : <Mail className="size-5" />}
                    </div>
                    <Input type="text" placeholder="name@email.com or 9123456789"
                      className="h-12 pl-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
                      value={identifier} onChange={handleIdentifierChange} required />
                  </div>
                </div>
                {errors.identifier && <p className="text-[11px] text-red-500 font-semibold mt-1.5 px-1">{errors.identifier}</p>}
              </div>

              {/* Password */}
              <div>
                <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Password</Label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    className="h-12 pl-12 pr-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
                    value={formData.password}
                    onChange={(e) => { const pwd = e.target.value; setFormData({ ...formData, password: pwd }); setErrors((prev) => ({ ...prev, password: validatePassword(pwd) })); }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8492a6]">
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-500 font-semibold mt-1.5 px-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="text-[10px] font-bold text-[#1e3d5a] tracking-widest uppercase mb-1.5 block opacity-70">Confirm Password</Label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#8492a6]" />
                  <Input type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                    className="h-12 pl-12 pr-12 bg-[#f8fafc] border-[#e2e8f0] rounded-2xl focus:ring-[#1e3d5a] focus:border-[#1e3d5a] font-medium"
                    value={formData.confirm}
                    onChange={(e) => { const val = e.target.value; setFormData({ ...formData, confirm: val }); setErrors((prev) => ({ ...prev, confirm: val && val !== formData.password ? "Passwords don't match." : '' })); }} required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8492a6]">
                    {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-[11px] text-red-500 font-semibold mt-1.5 px-1">{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full h-14 bg-[#1e3d5a] hover:bg-[#2a5373] text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg mt-2">
                Create Account
              </Button>
            </form>
          )}

          {/* Social signup — only for customers */}
          {role === 'customer' && (
            <>
              <div className="mt-5 mb-4 relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#e2e8f0]" /></div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-[#8492a6]">
                  <span className="bg-white px-4">Or Sign Up With</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <Button variant="outline" onClick={() => handleSocialSignup('Google')} className="h-12 rounded-2xl border-[#e2e8f0] hover:bg-[#f8fafc] text-[#1e3d5a] font-bold text-xs gap-2">
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialSignup('Facebook')} className="h-12 rounded-2xl border-[#e2e8f0] hover:bg-[#f8fafc] text-[#1e3d5a] font-bold text-xs gap-2">
                  <svg className="size-4" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => handleSocialSignup('PakiShip')} className="h-12 rounded-2xl border-[#e2e8f0] hover:bg-[#f8fafc] text-[#1e3d5a] font-bold text-xs gap-2">
                  <img src={pakiShipLogo} alt="PakiShip" className="h-5 object-contain" />
                  PakiShip
                </Button>
              </div>
            </>
          )}

          <p className="text-center text-[#8492a6] font-bold text-sm mt-2">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#ee6b20] hover:underline">Log In</button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}