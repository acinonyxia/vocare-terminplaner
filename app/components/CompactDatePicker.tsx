'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { Calendar } from '@/app/components/ui/calendar'
import { Button } from '@/app/components/ui/button'

type Props = {
  label: string
  date: Date | null
  onChange: (date: Date | null) => void
}

export function CompactDatePicker({ label, date, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-gray-600">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {date ? format(date, 'dd.MM.yyyy') : <span className="text-gray-400">Datum wählen</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={(d) => {
              onChange(d ?? null)
              setOpen(false)
            }}
            locale={de}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}