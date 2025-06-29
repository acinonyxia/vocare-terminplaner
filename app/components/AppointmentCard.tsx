import React, { useState } from 'react'
import type { Appointment } from '../types/database'
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

export default function AppointmentCard({ appointment }: Props) {

    const [checked, setChecked] = useState(false)

    const start = appointment.start ? new Date(appointment.start) : null
    const end = appointment.end ? new Date(appointment.end) : null

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    return (
        <div>
            <HoverCard>

                {/* AppointmentCard in Week View*/}
                <HoverCardTrigger>
                    <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">

                        {/* Checkbox within AppontmentCard*/}
                        <div className="absolute top-3 right-3">
                            <input
                                type="checkbox"
                                className="w-5 h-5 cursor-pointer accent-black"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                            />
                        </div>


                        <div className="flex items-start gap-2">
                            {/* Colored Dot in Category Color */}
                            <div
                                className="mt-1 h-4 w-4 rounded"
                                style={{ backgroundColor: appointment.category_data?.color ?? '#ccc' }}
                            />

                            <div className="flex flex-col gap-1">

                                {/* Header: Category and Appointment Title */}
                                <div
                                    className={`font-semibold mb-2 text-base text-gray-900 ${checked ? 'line-through text-gray-400' : ''
                                        }`}
                                >
                                    {appointment.category_data?.label}
                                    {appointment.title && ` – ${appointment.title}`}
                                </div>

                                {/* Time */}
                                <div className="flex text-sm text-gray-700 gap-3">
                                    <Clock size={14} className="mt-0.5" />
                                    {start && end
                                        ? `${formatTime(start)} bis ${formatTime(end)} Uhr`
                                        : 'Zeit nicht bekannt'}
                                </div>

                                {/* Location */}
                                <div className="flex text-sm text-gray-700 gap-3">
                                    <MapPin size={14} className="mt-0.5" /> {appointment.location ?? 'Kein Ort angegeben'}
                                </div>

                                {/* Notes */}
                                {appointment.notes && (
                                    <div className="flex text-sm whitespace-pre-line text-gray-700 gap-3 break-words">
                                        <span><MessageSquareText size={14} className="mt-0.5" /></span>
                                        <span className="break-words">{appointment.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </HoverCardTrigger>
                {/* HoverCard Content of Appointment */}
                <HoverCardContent className="w-full h-full rounded-md text-base p-5 shadow-sm text-black overflow-hidden relative border-l-[4px] bg-white"
                    style={{
                        borderColor: appointment.category_data?.color ?? '#ccc'
                    }}>
                    <AppointmentHoverCardContent appointment={appointment} borderColor={appointment.category_data?.color ?? '#ccc'} />
                </HoverCardContent>
            </HoverCard>
        </div>
    )
}