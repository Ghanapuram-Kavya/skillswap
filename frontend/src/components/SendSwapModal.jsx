import React, { useState } from 'react';
import { X, Send, Sparkles, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function SendSwapModal({ isOpen, onClose, match, onSuccess }) {
  const { currentUser } = useAuth();
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [wantedSkillId, setWantedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !match) return null;

  const { partner, skillsTheyTeach = [], skillsYouTeach = [] } = match;

  // Initialize defaults
  React.useEffect(() => {
    if (skillsYouTeach.length > 0) setOfferedSkillId(skillsYouTeach[0].skillId);
    if (skillsTheyTeach.length > 0) setWantedSkillId(skillsTheyTeach[0].skillId);
    setMessage(`Hi ${partner.name}! I noticed you want to learn ${skillsYouTeach[0]?.name || 'a skill'} and can teach ${skillsTheyTeach[0]?.name || 'a skill'}. Let's do a 1-on-1 skill exchange session!`);
  }, [match]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId || !wantedSkillId) return;

    try {
      setSubmitting(true);
      await api.sendSwapRequest(
        currentUser.userId,
        partner.userId,
        offeredSkillId,
        wantedSkillId,
        message
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
      <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Propose Skill Swap</h3>
              <p className="text-xs text-slate-400">Exchange knowledge with {partner.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Skill Swap Request Sent!</h4>
            <p className="text-xs text-slate-400">
              {partner.name} will be notified and can accept to schedule a learning session.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Skill Selector Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* You Teach */}
              <div>
                <label className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1.5">
                  You Will Teach
                </label>
                <select
                  value={offeredSkillId}
                  onChange={(e) => setOfferedSkillId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {skillsYouTeach.map((s) => (
                    <option key={s.skillId} value={s.skillId}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* They Teach */}
              <div>
                <label className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                  You Will Learn
                </label>
                <select
                  value={wantedSkillId}
                  onChange={(e) => setWantedSkillId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {skillsTheyTeach.map((s) => (
                    <option key={s.skillId} value={s.skillId}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Introductory Message
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="Share your goals and preferred availability..."
              ></textarea>
            </div>

            {/* Submit Action */}
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
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Swap Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
