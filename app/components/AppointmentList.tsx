'use client'

import { useEffect, useState, useMemo } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import type { Appointment, Patient, Category } from '@/app/types/database'
import AppointmentCard from '@/app/components/AppointmentCard'
import { useFilters } from "@/app/context/FilterContext"
import {
  format,
  isSameDay,
  subWeeks,
  subMonths,
  startOfYear,
  startOfToday,
  parseISO,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { CircleAlert } from 'lucide-react'

export function formatZeitraum(from: Date | null, to: Date | null): string {
  if (!from && !to) return ''
  if (from && !to) return `ab ${format(from, 'dd.MM.yyyy')}`
  if (!from && to) return `bis ${format(to, 'dd.MM.yyyy')}`
  return `${format(from!, 'dd.MM.yyyy')} – ${format(to!, 'dd.MM.yyyy')}`
}

// Past filter options
type PastRange = 'none' | 'week' | 'month' | 'year'

export default function TerminePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [selectedRange, setSelectedRange] = useState<PastRange>('none')

  const today = startOfToday()

  useEffect(() => {

    // fetch appoinments from subabase
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, category_data:categories(*), patient_data:patients(*)')
        .order('start', { ascending: true })

      if (error) console.error(error)
      else setAppointments(data ?? [])
    }

    // load patient and category data for filtering
    const fetchMetaData = async () => {
      const { data: patientsData } = await supabase
        .from('patients')
        .select('*')
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')

      setPatients(patientsData ?? [])
      setCategories(categoriesData ?? [])
    }

    fetchAppointments()
    fetchMetaData()
  }, [])

  const { filters } = useFilters()

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const date = new Date(appt.start!)

      const effectiveFrom =
        filters.from ??
        (selectedRange === 'none' && !filters.to ? today : null)

      const matchesRange = (() => {
        if (selectedRange === 'week') return date >= subWeeks(today, 1)
        if (selectedRange === 'month') return date >= subMonths(today, 1)
        if (selectedRange === 'year') return date >= startOfYear(today)
        return true
      })()

      const matchesFrom = effectiveFrom ? date >= effectiveFrom : true
      const matchesTo = filters.to ? date <= filters.to : true
      const matchesPatient = !filters.patientId || appt.patient === filters.patientId
      const matchesCategory = !filters.categoryId || appt.category === filters.categoryId

      return (matchesRange && matchesFrom && matchesTo && matchesPatient && matchesCategory)
    })
  }, [appointments, filters, selectedRange])

  // Group filtered appointments by date string
  const grouped = useMemo(() => {
    const map = new Map<string, Appointment[]>()

    for (const appt of filteredAppointments) {
      const dateKey = format(parseISO(appt.start!), 'yyyy-MM-dd')
      if (!map.has(dateKey)) map.set(dateKey, [])
      map.get(dateKey)!.push(appt)
    }

    return map
  }, [filteredAppointments])

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {/* Load previous appoinments */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-gray-600">
          Termine vor dem {format(today, 'dd. MMMM yyyy', { locale: de })} laden:
        </span>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value as PastRange)}
          className="border border-gray-300 px-2 py-1 rounded text-sm"
        >
          <option value="none">–</option>
          <option value="week">Letzte Woche</option>
          <option value="month">Letzter Monat</option>
          <option value="year">Alle Termine {format(today, 'yyyy')}</option>
        </select>
      </div>
      {(filters.from || filters.to) && (
        <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded w-fit mx-auto">
          Globaler Filter aktiv: {formatZeitraum(filters.from, filters.to)}
        </div>
      )}

      {/* Grouped appointment list */}
      {[...grouped.entries()].map(([dateKey, appts]) => {
        const date = parseISO(dateKey)
        return (
          <div key={dateKey} className="space-y-2">
            <div className="flex items-center justify-between mt-4">
              <h2 className="text-base font-semibold">{format(date, 'EEEE, dd. MMMM', { locale: de })}</h2>
              {isSameDay(date, today) && (
                <span className="text-sm text-green-900 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="text-xs">
                    <CircleAlert size="14" />
                  </span>
                  Heute
                </span>
              )}
            </div>
            {appts.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )
      })}
    </div>
  )
}