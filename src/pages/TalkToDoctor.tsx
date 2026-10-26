import React, { useState } from 'react';
import { Stethoscope, Search, Star, Clock, MapPin, Calendar, Video, Phone } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  location: string;
  fee: string;
  availability: string;
  image: string;
  languages: string[];
}

const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Meera Kapoor', specialty: 'General Physician', experience: '12 years', rating: 4.8, reviews: 234, location: 'Mumbai', fee: '₹500', availability: 'Today, 3:00 PM', image: '👩‍⚕️', languages: ['English', 'Hindi'] },
  { id: '2', name: 'Dr. Ananya Iyer', specialty: 'Gynecologist', experience: '15 years', rating: 4.9, reviews: 412, location: 'Bangalore', fee: '₹800', availability: 'Tomorrow, 10:00 AM', image: '👩‍⚕️', languages: ['English', 'Hindi', 'Tamil'] },
  { id: '3', name: 'Dr. Priya Nair', specialty: 'Dermatologist', experience: '8 years', rating: 4.7, reviews: 189, location: 'Delhi', fee: '₹600', availability: 'Today, 5:30 PM', image: '👩‍⚕️', languages: ['English', 'Hindi', 'Malayalam'] },
  { id: '4', name: 'Dr. Sneha Reddy', specialty: 'Nutritionist', experience: '6 years', rating: 4.6, reviews: 156, location: 'Hyderabad', fee: '₹400', availability: 'Tomorrow, 2:00 PM', image: '👩‍⚕️', languages: ['English', 'Hindi', 'Telugu'] },
  { id: '5', name: 'Dr. Kavita Singh', specialty: 'Psychologist', experience: '10 years', rating: 4.9, reviews: 298, location: 'Pune', fee: '₹700', availability: 'Today, 6:00 PM', image: '👩‍⚕️', languages: ['English', 'Hindi'] },
  { id: '6', name: 'Dr. Riya Patel', specialty: 'Endocrinologist', experience: '14 years', rating: 4.8, reviews: 267, location: 'Ahmedabad', fee: '₹900', availability: 'Wed, 11:00 AM', image: '👩‍⚕️', languages: ['English', 'Hindi', 'Gujarati'] },
];

const specialties = ['All', 'General Physician', 'Gynecologist', 'Dermatologist', 'Nutritionist', 'Psychologist', 'Endocrinologist'];

const TalkToDoctor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingType, setBookingType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [booked, setBooked] = useState(false);

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || d.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBook = () => {
    if (bookingDate && bookingTime) {
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setShowBooking(false);
        setSelectedDoctor(null);
        setBookingDate('');
        setBookingTime('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="card p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
          <Stethoscope className="w-6 h-6 text-blush-500" /> Talk to a Doctor
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Connect with verified healthcare professionals for consultation</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search doctors or specialties..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {specialties.map(s => (
            <button key={s} onClick={() => setSelectedSpecialty(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${selectedSpecialty === s ? 'gradient-blush text-white' : ''}`}
              style={selectedSpecialty !== s ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Doctor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl gradient-blush flex items-center justify-center text-2xl flex-shrink-0">
                {doctor.image}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{doctor.name}</h4>
                <p className="text-sm" style={{ color: 'var(--accent)' }}>{doctor.specialty}</p>
                <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {doctor.rating} ({doctor.reviews})</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doctor.experience}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doctor.location}</span>
                  <span>{doctor.fee}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{doctor.availability}</span>
                </div>
              </div>
            </div>
            <button onClick={() => { setSelectedDoctor(doctor); setShowBooking(true); }}
              className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-md space-y-4">
            {booked ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Appointment Booked! 🎉</h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Your appointment with {selectedDoctor.name} is confirmed for {bookingDate} at {bookingTime}.
                </p>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  ⚠️ This is a demo booking. In production, this would connect to a real scheduling service.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Book Appointment</h3>
                  <button onClick={() => setShowBooking(false)} className="text-sm" style={{ color: 'var(--text-muted)' }}>✕</button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-2xl">{selectedDoctor.image}</span>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{selectedDoctor.name}</p>
                    <p className="text-xs" style={{ color: 'var(--accent)' }}>{selectedDoctor.specialty} • {selectedDoctor.fee}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Consultation Type</label>
                  <div className="flex gap-2">
                    {[
                      { key: 'video' as const, icon: Video, label: 'Video' },
                      { key: 'phone' as const, icon: Phone, label: 'Phone' },
                      { key: 'in-person' as const, icon: MapPin, label: 'In-Person' },
                    ].map(t => (
                      <button key={t.key} onClick={() => setBookingType(t.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${bookingType === t.key ? 'gradient-blush text-white' : ''}`}
                        style={bookingType !== t.key ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
                      >
                        <t.icon className="w-3.5 h-3.5" /> {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Date</label>
                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Time</label>
                    <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} className="input-field" />
                  </div>
                </div>
                <button onClick={handleBook} className="btn-primary w-full">Confirm Booking</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Stethoscope className="w-5 h-5 text-blush-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> Doctor profiles shown are for demonstration. In production, this would integrate with a verified doctor directory service (e.g., Practo, Apollo). All appointments would be confirmed through the respective healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default TalkToDoctor;
