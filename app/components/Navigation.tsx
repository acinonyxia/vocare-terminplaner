'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
  
export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav>
      <ul className='inline-flex rounded-md bg-gray-200 font-bold text-xs'>
        <li className='px-1 py-1'>
          <Link className={`inline-flex rounded-md px-3 py-1.5 text-gray-500 [&.active]:bg-gray-50 [&.active]:text-black ${pathname === '/pages/appointments' ? 'active' : ''}`} href="/pages/appointments">
            Liste
          </Link>
        </li>
        <li className='px-1 py-1'>
          <Link
            className={`inline-flex rounded-md px-3 py-1.5 text-gray-500 [&.active]:bg-gray-50 [&.active]:text-black ${pathname === '/pages/week' ? 'active' : ''}`} href="/pages/week">
            Woche
          </Link>
        </li>
        <li className='px-1 py-1'>
          <Link
            className={`inline-flex rounded-md px-3 py-1.5 text-gray-500 [&.active]:bg-gray-50 [&.active]:text-black ${pathname === '/pages/month' ? 'active' : ''}`} href="/pages/month">
            Monat
          </Link>
        </li>
      </ul>
    </nav>
  )
}