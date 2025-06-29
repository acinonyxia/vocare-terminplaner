import type { Appointment } from '@/app/types/database'
import AppointmentHoverCardContent from '@/app/components/AppointmentHoverCardContent'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/components/ui/hover-card"
import { 
    Clock,
    MapPin,
    MessageSquareText,
 } from 'lucide-react';

type Props = {
    appointment: Appointment
}

// Function to calculate a lighter Version of the Category Color
export function lightenHex(hex: string, factor: number = 0.6): string {
    const parsed = hex.replace('#', '')
    const r = parseInt(parsed.substring(0, 2), 16)
    const g = parseInt(parsed.substring(2, 4), 16)
    const b = parseInt(parsed.substring(4, 6), 16)

    const lighten = (c: number) =>
        Math.round(c + (255 - c) * factor)
            .toString(16)
            .padStart(2, '0')

    return `#${lighten(r)}${lighten(g)}${lighten(b)}`
}

export default function AppointmentCardWeek({ appointment }: Props) {
    const start = new Date(appointment.start!)
    const end = new Date(appointment.end!)
    const baseColor = appointment.category_data?.color ?? '#4f46e5'
    const bgColor = lightenHex(baseColor, 0.9)

    return (
        <HoverCard>

            {/* AppointmentCard in Week View*/}
            <HoverCardTrigger>
                <div
                    className="h-full w-full rounded-md text-sm p-2 shadow-sm text-black overflow-hidden relative border-l-[4px]"
                    style={{
                        backgroundColor: bgColor,
                        borderColor: baseColor,
                    }}
                >
                    {/* Category*/}
                    <div className="font-semibold line-clamp-1 text-black">
                        {appointment.category_data?.label ?? 'Kategorie'}
                    </div>

                    {/* Time */}
                    <div className="flex text-xs mt-1 text-gray-500">
                        <Clock size={12} className="mt-0.5 mr-2" />
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
                        <div className="flex text-xs truncate text-gray-500">
                            <MapPin size={12} className="mt-0.5 mr-2" /> {appointment.location}</div>
                    )}

                    {/* Notes */}
                    {appointment.notes && (
                        <div className="flex text-xs truncate text-gray-500">
                            <span><MessageSquareText size={12} className="mt-0.5 mr-2" /></span>  {appointment.notes}
                        </div>
                    )}
                </div>
            </HoverCardTrigger>

            {/* HoverCard Content of Appointment */}
            <HoverCardContent className="w-full h-full rounded-md text-base p-5 shadow-sm text-black overflow-hidden relative border-l-[4px] bg-white"
                style={{
                    borderColor: baseColor,
                }}>
                <AppointmentHoverCardContent appointment={appointment} borderColor={baseColor} />
            </HoverCardContent>
        </HoverCard>
    )
}