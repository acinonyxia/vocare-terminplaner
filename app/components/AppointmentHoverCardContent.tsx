import type { Appointment } from '@/app/types/database'
import EditAppointmentDialog from '@/app/components/EditAppointmentDialog'
import {
  User,
  Clock,
  Mail,
  MapPin,
  MessageSquareText,
  PlusCircle,
} from 'lucide-react'

type Props = {
  appointment: Appointment
}

export default function AppointmentHoverCardContent({ appointment }: Props) {
  const start = new Date(appointment.start!)
  const end = new Date(appointment.end!)

  return (
    <div>
      <div className="flex justify-between gap-4 w-full max-w-sm">
        <div className="space-y-1">
          {/* Category + Title */}
          <div className="font-semibold line-clamp-1 mb-2 text-black">
            {appointment.category_data?.label}
            {appointment.title && ` – ${appointment.title}`}
          </div>

          {/* Patient */}
          <div className="flex text-sm text-gray-500">
            <User size={14} className="mt-0.5 mr-2" />
            {appointment.patient_data?.firstname} {appointment.patient_data?.lastname}
          </div>

          {/* Care Level */}
          {appointment.patient_data?.care_level && (
            <div className="flex text-sm text-gray-500">
              <PlusCircle size={14} className="mt-0.5 mr-2" />
              Pflegegrad: {appointment.patient_data.care_level}
            </div>
          )}

          {/* E-Mail */}
          {appointment.patient_data?.email && (
            <div className="flex text-sm text-gray-500">
              <Mail size={14} className="mt-0.5 mr-2" />
              {appointment.patient_data.email}
            </div>
          )}

          {/* Time */}
          <div className="flex text-sm mt-1 text-gray-500">
            <Clock size={14} className="mt-0.5 mr-2" />
            {start.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            –{' '}
            {end.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>

          {/* Location */}
          {appointment.location && (
            <div className="flex text-sm text-gray-500">
              <MapPin size={14} className="mt-0.5 mr-2" /> {appointment.location}
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="flex text-sm whitespace-pre-line text-gray-500 break-words">
              <span><MessageSquareText size={14} className="mt-0.5 mr-2" /></span>
              <span className="break-words">{appointment.notes}</span>
            </div>
          )}

          <div className="mt-5"><EditAppointmentDialog appointment={appointment} /></div>
        </div>
      </div>
    </div>
  )
}