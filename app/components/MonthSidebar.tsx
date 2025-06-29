import type { Appointment } from '@/app/types/database'
import { format, isSameDay, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  Clock,
  MapPin,
  MessageSquareText,
} from 'lucide-react'

interface Props {
  date: Date
  appointments: Appointment[]
}

export default function MonthSidebar({ date, appointments }: Props) {
  const isToday = isSameDay(date, new Date())

  const appointmentsForDay = appointments.filter((appt) =>
    isSameDay(new Date(appt.start!), date)
  )

  return (
    <div className="w-[320px] border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">
        {format(date, 'EEEE, dd. MMMM', { locale: de })} {isToday && '(Heute)'}
      </h2>

      <hr className="border-1 border-gray-300 mb-5" />

      {appointmentsForDay.length === 0 ? (
        <p className="text-sm text-gray-500">Keine Termine</p>
      ) : (
        <div className="space-y-2">
          {appointmentsForDay.map((appt) => (
            <div
              key={appt.id}
              className="p-2 rounded text-sm"
              style={{
                borderLeft: `4px solid ${appt.category_data?.color ?? '#ccc'}`,
                backgroundColor: '#f9f9f9',
              }}
            >
              <div className="font-semibold truncate mb-1">
                {appt.category_data?.label ?? appt.title}
              </div>
              <div className="flex text-xs text-gray-600 gap-3">
                <Clock size="12" className="mt-0.5" />
                {format(new Date(appt.start!), 'HH:mm')} –{' '}
                {format(new Date(appt.end!), 'HH:mm')}
              </div>
              {appt.location && (
                <div className="flex text-xs text-gray-600 gap-3">
                  <MapPin size="12" className="mt-0.5" /> {appt.location}
                </div>
              )}
              {appt.notes && (
                <div className="flex text-xs text-gray-600 whitespace-pre-line gap-3">
                  <span>
                    <MessageSquareText size="12" className="mt-0.5" />
                  </span>{' '}
                  {appt.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}