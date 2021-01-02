import Link from 'next/link'
import React from 'react'

export const Layout = ({children}) => {
  return (
    <div className="mx-8 my-20 font-serif md:mx-16 lg:mx-40">
      <header className="text-3xl font-medium leading-7 tracking-tight mb-14 small-caps name">
        <Link href="/">
          <a>Jacob Gillespie</a>
        </Link>
      </header>
      <main>{children}</main>

      <footer className="max-w-2xl pt-4 mt-8 text-sm text-gray-700 border-t border-gray-200">
        Copyright &copy; {new Date().getFullYear()} Jacob Gillespie. All Rights Reserved.
      </footer>
    </div>
  )
}
