'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import type { Appointment } from '@/app/types/database'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameDay,
  isSameMonth,
  format,
  endOfDay,
} from 'date-fns'
import { de } from 'date-fns/locale'
import {
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import MonthDayCell from '@/app/components/MonthDayCell'
import MonthSidebar from '@/app/components/MonthSidebar'
import { useDate } from '@/app/context/DateContext'
import { useFilters } from '@/app/context/FilterContext'

// Generate weekday labels (Monday to Sunday, localized)
const weekdayLabels = Array.from({ length: 7 }).map((_, i) =>
  format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'EEEE', { locale: de })
)

export default function MonthPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const today = new Date()
  const isToday = (date: Date) => isSameDay(date, today)

  const { selectedDate, setSelectedDate } = useDate()
  const { filters } = useFilters()

  // Calculate current month boundaries and calendar start
  const currentMonth = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(currentMonth, { weekStartsOn: 1 })
  const totalDays = 42    // 6 weeks × 7 days

  // Fetch appointments from Supabase for the visible calendar range
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, category_data:categories(id, color, label), patient_data:patients(pronoun, firstname, lastname, care_level, email)')
        .gte('start', calendarStart.toISOString())
        .lte('start', monthEnd.toISOString())

      if (error) console.error(error)
      else setAppointments(data ?? [])
    }

    fetchAppointments()
  }, [calendarStart, monthEnd])

  // Apply global filters (from FilterContext)
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

  // Group appointments by day for grid display
  const appointmentsByDate = useMemo(() => {
    const grouped: Record<string, Appointment[]> = {}
    for (const appt of filteredAppointments) {
      const key = format(new Date(appt.start!), 'yyyy-MM-dd')
      grouped[key] ||= []
      grouped[key].push(appt)
    }
    return grouped
  }, [filteredAppointments])

  return (
    <div className="flex h-[100vh]  bg-white min-h-screen">
      {/* Left section: calendar grid and controls */}
      <div className="flex-1 p-4 overflow-auto">

        {/* Heading with current month */}
        <h1 className="text-2xl font-bold mb-4">
          {format(currentMonth, 'MMMM yyyy', { locale: de })}
        </h1>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center mb-3 text-base font-medium text-gray-600">
          {weekdayLabels.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar grid with 6 weeks of days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden text-sm border border-gray-300">
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = addDays(calendarStart, i)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = isSameDay(day, selectedDate)
            const dateKey = format(day, 'yyyy-MM-dd')

            return (
              <MonthDayCell
                key={dateKey}
                date={day}
                isSelected={isSelected}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday(day)}
                appointments={appointmentsByDate[dateKey] ?? []}
                onClick={() => setSelectedDate(day)}
              />
            )
          })}
        </div>

        {/* Navigation buttons below the calendar */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
            className="flex px-4 py-1 rounded bg-gray-200 items-center gap-2"
          >
            <ChevronLeft /> Vorheriger Monat
          </button>
          <button
            onClick={() => setSelectedDate(startOfMonth(new Date()))}
            className="px-4 py-1 rounded bg-gray-200"
          >
            Aktueller Monat
          </button>
          <button
            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
            className="flex px-4 py-1 rounded bg-gray-200 items-center gap-2"
          >
            Nächster Monat <ChevronRight />
          </button>
        </div>
      </div>

      {/* Right sidebar with details for the selected day */}
      <MonthSidebar date={selectedDate} appointments={filteredAppointments} />
    </div>
  )
}
