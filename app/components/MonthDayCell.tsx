import { format } from 'date-fns'
import type { Appointment } from '@/app/types/database'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/components/ui/hover-card'
import AppointmentHoverCardContent from '@/app/components/AppointmentHoverCardContent'

interface Props {
  date: Date
  isSelected: boolean
  isCurrentMonth: boolean
  isToday: boolean
  appointments: Appointment[]
  onClick: () => void
}

export default function MonthDayCell({
  date,
  isSelected,
  isCurrentMonth,
  isToday,
  appointments,
  onClick,
}: Props) {
  const dayKey = format(date, 'yyyy-MM-dd')

  return (
    <div
      key={dayKey}
      className={`p-1 h-24 cursor-pointer relative
        ${isSelected ? 'bg-gray-100' : 'bg-white'}
        ${!isCurrentMonth ? 'text-gray-400' : ''}`}
      onClick={onClick}
    >
      <div className={`text-xs mb-1 ${isToday ? 'font-bold text-green-600' : ''}`}>
        {format(date, 'dd')}
      </div>

      <div className="space-y-0.5 overflow-hidden">
        {appointments.slice(0, 2).map((appt) => (
          <HoverCard key={appt.id}>
            <HoverCardTrigger asChild>
              <div
                className="truncate text-xs px-1 rounded bg-gray-50 flex items-center gap-1 cursor-pointer"
                style={{
                  borderLeft: `4px solid ${appt.category_data?.color ?? '#ccc'}`,
                }}
              >
                {appt.category_data?.label ?? appt.title}
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-full h-full rounded-md text-base p-5 shadow-sm text-black overflow-hidden relative border-l-[4px] bg-white"
              style={{ borderColor: appt.category_data?.color ?? '#ccc' }}
            >
              <AppointmentHoverCardContent appointment={appt} />
            </HoverCardContent>
          </HoverCard>
        ))}
        {appointments.length > 2 && (
          <div className="text-[10px] text-gray-500 pl-1">
            + {appointments.length - 2} weitere
          </div>
        )}
      </div>
    </div>
  )
}