export type UUID = string

export type Timestamp = string // ISO-String

export type Appointment = {
  id: UUID
  created_at: Timestamp
  updated_at: Timestamp | null
  start: Timestamp | null
  end: Timestamp | null
  location: string | null
  patient: UUID | null
  attachements: string | null
  category: UUID | null
  notes: string | null
  title: string | null

  // Optional: eingebettete Objekte (wenn per `select(..., patient:patients(*), category:categories(*))`)
  patient_data?: Patient
  category_data?: Category
}

export type Patient = {
  id: UUID
  firstname: string | null
  lastname: string | null
  care_level: number | null
  pronoun: string | null
  email: string | null
  active: boolean | null
  active_since: Timestamp | null
}

export type Category = {
  id: UUID
  created_at: Timestamp
  updated_at: Timestamp | null
  label: string | null
  description: string | null
  color: string | null
  icon: string | null
}