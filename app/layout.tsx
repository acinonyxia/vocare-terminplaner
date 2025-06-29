import "./globals.css";
import { Navigation } from "./components/Navigation";
import { DatePicker } from "@/app/components/DatePicker";
import { DateProvider } from "@/app/context/DateContext";
import { FilterDialog } from '@/app/components/FilterDialog'
import { FilterProvider } from '@/app/context/FilterContext'
import NewAppointmentDialog from "@/app/components/NewAppointmentDialog"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <FilterProvider>
          <DateProvider>
            <div className="bg-gray-100 min-h-screen">
              <div className="flex justify-between items-center p-3 bg-white rounded border-b border-gray-200">
                {/* Left: DatePicker + Navigation */}
                <div className="flex gap-4">
                  <DatePicker />
                  <Navigation />
                </div>

                {/* Right: FilterDialog */}
                <div className="flex gap-4">
                  <FilterDialog />
                  <NewAppointmentDialog />
                </div>
              </div>

              <div>{children}</div>
            </div>
          </DateProvider>
        </FilterProvider>
      </body>
    </html>
  );
}
