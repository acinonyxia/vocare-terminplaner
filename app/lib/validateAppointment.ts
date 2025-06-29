export type AppointmentInput = {
  title: string
  date: string // format: YYYY-MM-DD
  startTime: string // format: HH:mm
  endTime: string // format: HH:mm
  patientId?: string | null
  categoryId?: string | null
  location?: string
  notes?: string
}

export type ValidatedAppointment = {
  start: Date
  end: Date
  error?: string
}

/**
 * Validates and combines date + time fields to Date objects.
 * Returns error message if invalid.
 */
export function validateAppointment(input: AppointmentInput): ValidatedAppointment {
  const { date, startTime, endTime } = input

  if (!date || !startTime || !endTime) {
    return { start: new Date(), end: new Date(), error: 'Datum oder Uhrzeiten fehlen.' }
  }

  const start = new Date(`${date}T${startTime}`)
  const end = new Date(`${date}T${endTime}`)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { start, end, error: 'Ungültiges Datumsformat.' }
  }

  if (end <= start) {
    return { start, end, error: 'Endzeitpunkt muss nach dem Startzeitpunkt liegen.' }
  }

  return { start, end }
}