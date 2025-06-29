'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import type { Appointment } from '@/app/types/database'
import AppointmentCardWeek from '@/app/components/AppointmentCardWeek'
import { format, startOfWeek, endOfWeek, endOfDay } from 'date-fns'
import { useDate } from '@/app/context/DateContext'
import { useFilters } from '@/app/context/FilterContext'

// Define displayed hours from 06:00 to 22:00
const hours = Array.from({ length: 16 }, (_, i) => 6 + i) // 06–22 h

// Define displayed hours for red horizontal line visibility
const earliestHour = 6
const latestHour = 22

// Convert a time to vertical offset in the grid (1 hour = 80px)
const timeToOffset = (date: Date) =>
  ((date.getHours() - 6) + date.getMinutes() / 60) * 80 // 80px per hour, start at 6:00

export default function WeekPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const today = new Date()
  const { selectedDate } = useDate()
  const { filters } = useFilters()

  // Calculate start and end of the visible week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })

  // Fetch appointments from Supabase for current week
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, category_data:categories(id, color, label), patient_data:patients(pronoun, firstname, lastname, care_level, email)')
        .gte('start', weekStart.toISOString())
        .lte('start', weekEnd.toISOString())

      if (error) console.error(error)
      else setAppointments(data ?? [])
    }

    fetchAppointments()
  }, [weekStart, weekEnd])

  // Apply global filters to the loaded appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const date = new Date(appt.start!)

      const matchesFrom = filters.from ? date >= filters.from : true
      const matchesTo = filters.to ? date <= endOfDay(filters.to) : true
      const matchesPatient = !filters.patientId || appt.patient === filters.patientId
      const matchesCategory = !filters.categoryId || appt.category === filters.categoryId

      return matchesFrom && matchesTo && matchesPatient && matchesCategory
    })
  }, [appointments, filters])

  // Check if a given date is today
  const isToday = (date: Date) => {
    return new Date().toDateString() === date.toDateString()
  }

  // Return date for a specific weekday offset (0 = Monday, 6 = Sunday)
  const getDayByOffset = (offset: number) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + offset)
    return date
  }

  // Format date label for week header
  const formatDate = (date: Date) =>
    date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })

  return (
    <div className=" bg-white min-h-screen">

      {/* Layout: time column on the left + calendar grid */}
      <div className="flex">

        {/* Left time column (hour markers) */}
        <div className="w-[64px] flex flex-col">
          <div className="h-12" />
          {hours.map((h) => (
            <div
              key={h}
              className="h-[80px] text-xs text-right pr-2 text-gray-500 border-t border-gray-200 bg-white"
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Calendar Grid: 7 Days */}
        <div className="flex-1">

          {/* Weekday headers (Mon–Sun) */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = getDayByOffset(i)
              return (
                <div
                  key={i}
                  className={`h-12 px-2 text-sm font-semibold flex items-center justify-between border-l border-gray-200 ${isToday(d) ? 'bg-green-50' : 'bg-white'}`}
                >
                  {formatDate(d)}
                  {isToday(d) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Heute
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid body: hour blocks × 7 days */}
          <div className="grid grid-cols-7 relative bg-gray-50 overflow-visible">
            {Array.from({ length: 7 * hours.length }).map((_, i) => {
              const col = i % 7
              const date = getDayByOffset(col)
              const isTodayCol = isToday(date)

              return (
                <div
                  key={i}
                  className={`h-[80px] border-b border-l border-dashed border-gray-200 ${isTodayCol ? 'bg-green-50' : 'bg-gray-50'}`}
                />
              )
            })}

            {/* Red horizontal line showing current time */}
            {isToday(today) && today.getHours() >= earliestHour && today.getHours() < latestHour && (
              <div
                className="absolute left-0 right-0 pointer-events-none z-10"
                style={{ top: `${timeToOffset(today)}px` }}
              >
                <div className="absolute w-full border-t border-1 border-red-500" />
                <div className="absolute -left-11 -top-4 text-xs text-white font-bold bg-red-500 p-2 rounded-full">
                  {format(today, 'HH:mm')}
                </div>
              </div>
            )}

            {/* Appointment blocks (positioned by time + day) */}
            {filteredAppointments.map((appt) => {
              const start = new Date(appt.start!)
              const end = new Date(appt.end!)
              const dayIdx = (start.getDay() + 6) % 7
              const top = timeToOffset(start)
              const height = timeToOffset(end) - top || 64

              return (
                <div
                  key={appt.id}
                  className="absolute z-20 px-1"
                  style={{
                    left: `calc(100% / 7 * ${dayIdx})`,
                    width: `calc(100% / 7 - 2px)`,
                    top: `${top}px`,
                    height: `${height}px`,
                  }}
                >
                  <AppointmentCardWeek appointment={appt} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
