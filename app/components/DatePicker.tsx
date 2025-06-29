"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { de } from "date-fns/locale"
import { Button } from "@/app/components/ui/button"
import { Calendar } from "@/app/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover"
import { useDate } from "@/app/context/DateContext"

function formatDate(date: Date | undefined) {
    if (!date) return ""
    return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export function DatePicker() {
    const { selectedDate, setSelectedDate } = useDate()
    const [open, setOpen] = React.useState(false)
    const [month, setMonth] = React.useState<Date>(selectedDate)

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date-picker"
                        variant="outline"
                        className="w-[240px] flex text-left justify-baseline text-gray-400 border-gray-300"
                    >
                        <CalendarIcon className="size-3.5" /> <span className="text-black">{formatDate(selectedDate)}</span>
                        <span className="sr-only">Select date</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0 bg-white border-gray-300 text-gray-700"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                >
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        month={month}
                        onMonthChange={setMonth}
                        onSelect={(date) => {
                            if (date) {
                                setSelectedDate(date)
                                setMonth(date)
                                setOpen(false)
                            }
                        }}
                        locale={de}
                        weekStartsOn={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
