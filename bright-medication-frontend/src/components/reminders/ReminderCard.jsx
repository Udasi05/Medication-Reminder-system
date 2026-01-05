// ============================================
// FILE: src/components/reminders/ReminderCard.jsx
// ============================================
import { CheckCircle, XCircle, Clock, User, Pill, Calendar, Phone } from 'lucide-react';

const ReminderCard = ({ reminder, onConfirm }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'taken':
                return 'green';
            case 'missed':
                return 'red';
            case 'sent':
                return 'orange';
            default:
                return 'gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'taken':
                return CheckCircle;
            case 'missed':
                return XCircle;
            case 'sent':
                return Clock;
            default:
                return Clock;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'taken':
                return 'Taken';
            case 'missed':
                return 'Missed';
            case 'sent':
                return 'Pending';
            default:
                return status;
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const color = getStatusColor(reminder.status);
    const StatusIcon = getStatusIcon(reminder.status);

    return (
        <div className={`card border-l-4 border-${color}-500 hover:shadow-xl transition-all`}>
            <div className="flex items-start justify-between mb-4">
                {/* Elder Info */}
                <div className="flex items-start space-x-4 flex-1">
                    <div className={`bg-${color}-100 rounded-full p-3`}>
                        <User className={`w-6 h-6 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {reminder.elderId?.name || 'Unknown Elder'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{reminder.elderId?.phoneNumber}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatTime(reminder.scheduledTime)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center space-x-2 bg-${color}-100 text-${color}-700 px-4 py-2 rounded-full`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-semibold">{getStatusText(reminder.status)}</span>
                </div>
            </div>

            {/* Medication Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <div>
                        <p className="font-semibold text-gray-800">
                            {reminder.medicationId?.name || 'Unknown Medication'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {reminder.medicationId?.dosage}
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2 mb-4">
                {reminder.voiceCallSent && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>Voice call sent at {formatTime(reminder.voiceCallTime)}</span>
                    </div>
                )}
                {reminder.smsSent && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span>SMS sent at {formatTime(reminder.smsTime)}</span>
                    </div>
                )}
                {reminder.confirmationTime && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirmed at {formatTime(reminder.confirmationTime)} via {reminder.confirmationMethod}</span>
                    </div>
                )}
                {reminder.alertSentToCaregiver && (
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>Alert sent to caregiver at {formatTime(reminder.caregiverAlertTime)}</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {reminder.status === 'sent' && (
                <button
                    onClick={() => onConfirm(reminder._id)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark as Taken</span>
                </button>
            )}

            {reminder.status === 'taken' && (
                <div className="text-center py-2 text-green-600 font-medium">
                    ✓ Medication taken successfully
                </div>
            )}

            {reminder.status === 'missed' && (
                <div className="text-center py-2 text-red-600 font-medium">
                    ⚠ Medication was missed - Caregiver has been notified
                </div>
            )}
        </div>
    );
};

export default ReminderCard;