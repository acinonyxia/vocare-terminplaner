'use client'

import { createContext, useContext, useState } from 'react'

type FilterState = {
  patientId: string | null
  categoryId: string | null
  from: Date | null
  to: Date | null
}

type FilterContextType = {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    patientId: null,
    categoryId: null,
    from: null,
    to: null,
  })

  const resetFilters = () =>
    setFilters({ patientId: null, categoryId: null, from: null, to: null })

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) throw new Error('useFilters must be used within FilterProvider')
  return context
}