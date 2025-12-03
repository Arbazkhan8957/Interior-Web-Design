import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="text-center">
      <h1 className="text-6xl font-extrabold">404</h1>
      <p className="mt-4 text-gray-600">Page not found.</p>
      <Link to="/" className="mt-6 inline-block px-4 py-2 rounded-full border">Back to home</Link>
    </div>
  )
}
