// ============================================
// FILE: src/components/reminders/ReminderCard.jsx (MEDICAL MODERN)
// ============================================
import { CheckCircle, XCircle, Clock, User, Pill, Calendar, Phone, Activity, Bell, AlertCircle } from 'lucide-react';

const ReminderCard = ({ reminder, onConfirm }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'taken':
                return { color: 'emerald', icon: CheckCircle, label: 'Taken', gradient: 'from-emerald-400 to-teal-500' };
            case 'missed':
                return { color: 'red', icon: XCircle, label: 'Missed', gradient: 'from-red-400 to-rose-500' };
            case 'sent':
                return { color: 'amber', icon: Clock, label: 'Pending', gradient: 'from-amber-400 to-orange-500' };
            default:
                return { color: 'slate', icon: Clock, label: status, gradient: 'from-slate-400 to-gray-500' };
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const statusConfig = getStatusStyles(reminder.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className={`glass-card rounded-2xl p-5 border border-white/60 hover:shadow-xl hover:shadow-${statusConfig.color}-100/50 transition-all duration-300 transform`}>
            {/* Header / Main Info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                {/* Elder Info */}
                <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg shadow-${statusConfig.color}-200/50`}>
                        <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                            {reminder.elderId?.name || 'Unknown Elder'}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500 mt-1">
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                <Phone className="w-3 h-3" />
                                {reminder.elderId?.phoneNumber}
                            </span>
                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                <Clock className="w-3 h-3" />
                                {formatTime(reminder.scheduledTime)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`self-start bg-${statusConfig.color}-100 text-${statusConfig.color}-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-${statusConfig.color}-200`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">{statusConfig.label}</span>
                </div>
            </div>

            {/* Medication Info Block */}
            <div className="bg-slate-50/80 rounded-xl p-4 mb-5 flex items-center gap-3 border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Pill className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medication</span>
                    <div className="flex items-baseline gap-2">
                        <p className="font-bold text-slate-800 text-lg leading-none">
                            {reminder.medicationId?.name || 'Unknown Medication'}
                        </p>
                        <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {reminder.medicationId?.dosage}
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline Events */}
            <div className="space-y-2 mb-5">
                {reminder.voiceCallSent && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span>Voice call sent at <span className="font-bold text-slate-700">{formatTime(reminder.voiceCallTime)}</span></span>
                    </div>
                )}
                {reminder.smsSent && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span>SMS sent at <span className="font-bold text-slate-700">{formatTime(reminder.smsTime)}</span></span>
                    </div>
                )}
                {reminder.confirmationTime && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Confirmed at {formatTime(reminder.confirmationTime)} via {reminder.confirmationMethod}</span>
                    </div>
                )}
                {reminder.alertSentToCaregiver && (
                    <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
                        <Bell className="w-3 h-3" />
                        <span>Alert sent to caregiver at {formatTime(reminder.caregiverAlertTime)}</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {reminder.status === 'sent' && (
                <button
                    onClick={() => onConfirm(reminder._id)}
                    className="w-full btn-primary shadow-lg shadow-amber-500/20 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 flex items-center justify-center gap-2 py-3"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm as Taken</span>
                </button>
            )}

            {reminder.status === 'taken' && (
                <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl py-3 text-emerald-700 font-bold text-center text-sm flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Medication taken successfully
                </div>
            )}

            {reminder.status === 'missed' && (
                <div className="w-full bg-red-50 border border-red-100 rounded-xl py-3 text-red-700 font-bold text-center text-sm flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Medication missed - Caregiver notified
                </div>
            )}
        </div>
    );
};

export default ReminderCard;