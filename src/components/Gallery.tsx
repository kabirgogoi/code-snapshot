import React from "react"
import type { GalleryItem } from "@/types"

interface GalleryProps {
  items: GalleryItem[]
  isProcessing: boolean
}

export default function Gallery({
  items,
  isProcessing,
}: GalleryProps): React.JSX.Element {
  if (items.length === 0 && !isProcessing) {
    return (
      <div className="flex-1 border-2 border-dashed border-gray-700 rounded flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-gray-800 rounded-full text-gray-500 mb-4 text-2xl">
          📄
        </div>
        <h3 className="text-base font-medium">No files selected</h3>
        <p className="text-gray-500 text-sm max-w-xs mt-1">
          Click "Select Files" above and highlight multiple code files to run
          the conversion pipeline.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 border border-gray-700 p-3 rounded flex flex-col gap-2"
        >
          <div className="text-xs text-gray-400 font-mono truncate font-semibold">
            {item.name}
          </div>
          <div className="rounded overflow-hidden border border-gray-900 bg-gray-900/40">
            <img
              src={item.src}
              alt={item.name}
              className="w-full h-auto object-contain object-top"
              style={{ maxHeight: "240px" }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
