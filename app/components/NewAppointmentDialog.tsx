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
import { supabase } from '@/app/lib/supabaseClient'
import { Textarea } from '@/app/components/ui/textarea'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { CalendarIcon, Plus } from 'lucide-react'
import { CheckCircle2 } from 'lucide-react'

export default function NewAppointmentDialog() {
  const [open, setOpen] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    title: '',
    patient: '',
    category: '',
    date: new Date(),
    start: '10:00',
    end: '11:00',
    location: '',
    notes: '',
  })

  useEffect(() => {
    const load = async () => {
      const { data: p } = await supabase.from('patients').select('id, firstname, lastname')
      const { data: c } = await supabase.from('categories').select('id, label')
      setPatients(p ?? [])
      setCategories(c ?? [])
    }
    if (open) load()
  }, [open])

  const handleSubmit = async () => {
    const startDateTime = new Date(form.date)
    const [sh, sm] = form.start.split(':')
    startDateTime.setHours(Number(sh), Number(sm))

    const endDateTime = new Date(form.date)
    const [eh, em] = form.end.split(':')
    endDateTime.setHours(Number(eh), Number(em))

    const payload = {
      title: form.title,
      patient: form.patient,
      category: form.category,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      location: form.location,
      notes: form.notes,
    }

    console.log('[Neuer Termin]', payload)
    setSuccess(true)
    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-black text-white">
          <Plus size={16} /> Neuer Termin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white">
        <DialogTitle>Neuen Termin erstellen</DialogTitle>
        <DialogDescription className="text-sm text-gray-500 mb-4">
          Fülle das Formular aus, um einen neuen Termin zu erstellen.
        </DialogDescription>

        <div className="space-y-4">
          {success && (
            <div className="text-green-700 bg-green-100 border border-green-200 px-3 py-2 rounded text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Termin gespeichert (Demo)
            </div>
          )}

          <Input
            placeholder="Titel des Termins"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

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
                <PopoverContent className="w-auto p-0 bg-white">
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

          <div>
            <label className="text-xs text-gray-500">Patient</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
            >
              <option value="">Patient wählen</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstname} {p.lastname}
                </option>
              ))}
            </select>
          </div>

          <Input
            placeholder="Ort"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <Textarea
            placeholder="Notizen"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSubmit}>Erstellen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
