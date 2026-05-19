import React from "react"

export default function Header(): React.JSX.Element {
  return (
    <header className="border-b border-gray-800 p-6 bg-gray-900/50 backdrop-blur">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Code Snapshot</h1>
      </div>
    </header>
  )
}
