'use client'

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from '@/app/components/ui/dialog'
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/app/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useFilters } from '@/app/context/FilterContext'
import { endOfDay } from 'date-fns'
import { CompactDatePicker } from '@/app/components/CompactDatePicker'
import { CategoryOption, PatientOption } from '@/app/types/database'

export function FilterDialog() {
    const { filters, setFilters, resetFilters } = useFilters()
    const [patients, setPatients] = useState<PatientOption[]>([])
    const [categories, setCategories] = useState<CategoryOption[]>([])
    const [open, setOpen] = useState(false)

    const [local, setLocal] = useState(filters)

    useEffect(() => {
        const load = async () => {
            const { data: patientsData } = await supabase.from('patients').select('id, firstname, lastname')
            const { data: categoriesData } = await supabase.from('categories').select('id, label')
            setPatients(patientsData ?? [])
            setCategories(categoriesData ?? [])
        }
        if (open) load()
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex">
                    <Button variant="outline" className="border-gray-300"><SlidersHorizontal />Termine filtern</Button></div>
            </DialogTrigger>
            <DialogContent className="w-[600px] bg-white">
                <DialogTitle className="sr-only">Filter</DialogTitle>
                <h2 className="text-lg font-semibold">Filter</h2>

                <div className="space-y-4">

                    <div>
                        <label className="text-sm text-gray-600">Kategorie</label>
                        <select
                            className="w-full border px-2 py-1 rounded"
                            value={local.categoryId ?? ''}
                            onChange={(e) => setLocal((p) => ({ ...p, categoryId: e.target.value || null }))}
                        >
                            <option value="">Alle</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Patient</label>
                        <select
                            className="w-full border px-2 py-1 rounded"
                            value={local.patientId ?? ''}
                            onChange={(e) => setLocal((p) => ({ ...p, patientId: e.target.value || null }))}
                        >
                            <option value="">Alle</option>
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.firstname} {p.lastname}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <CompactDatePicker
                            label="Von"
                            date={local.from}
                            onChange={(d) => setLocal((p) => ({ ...p, from: d }))}
                        />
                        <CompactDatePicker
                            label="Bis"
                            date={local.to}
                            onChange={(d) => setLocal((p) => ({ ...p, to: d }))}
                        />
                    </div>

                    <div className="flex justify-between pt-2">
                        <Button variant="outline" onClick={() => { resetFilters(); setOpen(false) }}>
                            Zurücksetzen
                        </Button>
                        <Button
                            onClick={() => {
                                setFilters({
                                    ...local,
                                    to: local.to ? endOfDay(local.to) : null,
                                })
                                setOpen(false)
                            }}
                        >
                            Anwenden
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}