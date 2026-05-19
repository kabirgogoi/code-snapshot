import React from "react"
import type { ProgressState } from "@/types"

interface ProgressBarProps {
  progress: ProgressState
}

export default function ProgressBar({
  progress,
}: ProgressBarProps): React.JSX.Element {
  const percentage =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0

  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300 font-medium">{progress.status}</span>
        <span className="text-gray-400">
          {progress.current} / {progress.total}
        </span>
      </div>
      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
        <div
          className="bg-linear-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
