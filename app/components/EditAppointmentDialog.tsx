'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Calendar } from '@/app/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Textarea } from '@/app/components/ui/textarea'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CalendarIcon, Pencil, CheckCircle2 } from 'lucide-react'
import type { Appointment } from '@/app/types/database'
import { supabase } from '@/app/lib/supabaseClient'

interface Props {
  appointment: Appointment
}

type CategoryOption = {
  id: string
  label: string
}

export default function EditAppointmentDialog({ appointment }: Props) {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  const [form, setForm] = useState({
    title: appointment.title ?? '',
    date: new Date(appointment.start!),
    start: format(new Date(appointment.start!), 'HH:mm'),
    end: format(new Date(appointment.end!), 'HH:mm'),
    category: appointment.category ?? '',
    location: appointment.location ?? '',
    notes: appointment.notes ?? '',
  })

  useEffect(() => {
    const loadCategories = async () => {
      const { data: c } = await supabase.from('categories').select('id, label')
      setCategories(c ?? [])
    }
    if (open) loadCategories()
  }, [open])

  const handleSubmit = () => {
    const startDateTime = new Date(form.date)
    const [sh, sm] = form.start.split(':')
    startDateTime.setHours(Number(sh), Number(sm))

    const endDateTime = new Date(form.date)
    const [eh, em] = form.end.split(':')
    endDateTime.setHours(Number(eh), Number(em))

    const payload = {
      id: appointment.id,
      title: form.title,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      category: form.category,
      location: form.location,
      notes: form.notes,
    }

    console.log('[Termin bearbeiten]', payload)
    setSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full bg-white border-gray-300 text-gray-500">
          <Pencil size={14} className="mr-2" /> Termin bearbeiten
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogTitle>Termin bearbeiten</DialogTitle>
        <DialogDescription className="text-sm text-gray-500 mb-4">
          Änderungen vornehmen – wird nicht gespeichert (Demo).
        </DialogDescription>

        <div className="space-y-4">
          {success && (
            <div className="text-green-700 bg-green-100 border border-green-200 px-3 py-2 rounded text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Termin geändert (Demo)
            </div>
          )}

          <label className="text-xs text-gray-500">Titel</label>
          <Input
            placeholder="Titel des Termins"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Row: Datum + Start + Ende */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Datum</label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {form.date ? format(form.date, 'dd.MM.yyyy') : <span className="text-gray-400">Datum wählen</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(d) => d && setForm({ ...form, date: d })}
                    locale={de}
                    weekStartsOn={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Start</label>
              <Input
                type="time"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Ende</label>
              <Input
                type="time"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
            </div>
          </div>

          {/* Patient info (not editable) */}
          <label className="text-xs text-gray-500">Patient</label>
          <Input
            disabled
            value={`Patient: ${appointment.patient_data?.firstname ?? ''} ${appointment.patient_data?.lastname ?? ''}`.trim()}
          />

          <div>
            <label className="text-xs text-gray-500">Kategorie</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Kategorie wählen</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <label className="text-xs text-gray-500">Ort</label>
          <Input
            placeholder="Ort"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <label className="text-xs text-gray-500">Notiz</label>
          <Textarea
            placeholder="Notizen"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit}>Speichern</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
