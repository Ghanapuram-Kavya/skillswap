import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ScheduleSessionModal({ isOpen, onClose, swap, currentUser, onSuccess }) {
  const [date, setDate] = useState('2026-08-29');
  const [time, setTime] = useState('18:00 IST');
  const [mode, setMode] = useState('Google Meet / Online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/skillswap-room');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !swap) return null;

  const otherUser = swap.senderId === currentUser.userId ? swap.receiver : swap.sender;
  const skillToTeach = swap.senderId === currentUser.userId ? swap.offeredSkill : swap.wantedSkill;

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.scheduleSession(
        swap.swapId,
        currentUser.userId,
        otherUser.userId,
        skillToTeach?.skillId || 'skl-python',
        date,
        time,
        mode,
        meetingLink
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess && onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Schedule Learning Session</h3>
              <p className="text-xs text-slate-400">Session with {otherUser?.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Session Confirmed!</h4>
            <p className="text-xs text-slate-400">
              Added to your active learning sessions calendar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSchedule} className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              Covering: <strong className="text-white">{skillToTeach?.name}</strong> with {otherUser?.name}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Time (with Timezone)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 18:00 IST or 6:00 PM"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Video Meeting Link
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Google Meet or Zoom URL"
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/25 transition-all"
              >
                {submitting ? 'Scheduling...' : 'Confirm Session'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
