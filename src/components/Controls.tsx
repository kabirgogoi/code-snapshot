import React, { useRef, type ChangeEvent } from "react"

interface ControlsProps {
  onFilesSelected: (event: ChangeEvent<HTMLInputElement>) => void
  onDownloadZip: () => void
  canDownload: boolean
}

export default function Controls({
  onFilesSelected,
  onDownloadZip,
  canDownload,
}: ControlsProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded flex flex-wrap gap-4 items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">
          Generate Images from Code Files
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Select multiple files together to batch-convert them into beautifully
          styled PNGs.
        </p>
      </div>
      <div className="flex gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFilesSelected}
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded transition shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
        >
          Select Files
        </button>
        <button
          onClick={onDownloadZip}
          disabled={!canDownload}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium px-5 py-2.5 rounded transition disabled:opacity-50 disabled:pointer-events-none shadow-lg active:scale-95 cursor-pointer"
        >
          Download ZIP
        </button>
      </div>
    </div>
  )
}
