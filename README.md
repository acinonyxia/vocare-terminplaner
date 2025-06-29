# 🗓️ Vocare Terminplaner (Prototyp)

Ein moderner Terminplanungs-Prototyp mit Fokus auf Klarheit, Geschwindigkeit und Benutzerfreundlichkeit.

## ✨ Features

- ✅ Tages-, Wochen- und Monatsansicht
- ✅ Dynamischer DatePicker (global)
- ✅ Filterbar nach:
  - Patient
  - Kategorie
  - Zeitraum
- ✅ Termine erstellen (Demo)
- ✅ Termine bearbeiten (Demo)
- ✅ Visuelles Feedback & HoverCards
- ⚙️ Supabase als Backend (nur Lesemodus im Prototyp)

---

## 🧪 Demo-Modus

- Neue Termine werden **nicht in der Datenbank gespeichert**
- Bearbeitete Termine werden **nicht gespeichert**
- Änderungen werden stattdessen **in der Konsole angezeigt**

---

## 🧑‍💻 Tech Stack

- [Next.js App Router](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Lokalen Dev-Server starten
npm run dev

---

## 📁 Projektstruktur

app/
├── components/       # Wiederverwendbare UI-Komponenten
│   ├── ui/           # UI-Komponenten von shadcn/ui
│   ├── AppointmentCard.tsx
│   ├── AppointmentCardWeek.tsx
│   ├── AppointmentHoverCardContent.tsx
│   ├── AppointmentList.tsx
│   ├── CompactDatePicker.tsx
│   ├── DatePicker.tsx
│   ├── EditAppointmentDialog.tsx
│   ├── FilterDialog.tsx
│   ├── MonthDayCell.tsx
│   ├── MonthSidebar.tsx
│   ├── Navigation.tsx
│   └── NewAppointmentDialog.tsx
├── context/          # Globale States (Filter, Datum)
├── lib/              # Supabase-Client (& Validierung - in work)
├── pages/
│   ├── appointments/ # Terminliste
│   ├── week/         # Wochenansicht
│   └── month/        # Monatsansicht
└── types/            # TypeScript Typisierung

---

## 📌 Nächstes Ziel (optional)

- Echtzeit-Speichern aktivieren (Supabase insert / update)
- Authentifizierung (nur eigene Termine sehen/bearbeiten)
- Mobile Optimierung
- Terminimport / CSV / ICS
- Kalender-Export (PDF)

---

## 📝 Lizenz

Nur zur internen Nutzung / Prototyping. Kein Produktivsystem.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
