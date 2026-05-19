import React, { useState, type ChangeEvent } from "react"
import { createRoot } from "react-dom/client"
import html2canvas from "html2canvas-pro"
import JSZip from "jszip"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs"

import Header from "./components/Header"
import Controls from "./components/Controls"
import ProgressBar from "./components/ProgressBar"
import Gallery from "./components/Gallery"
import { EXT_MAP } from "./constants/extensions"

import type { ProgressState, GalleryItem } from "./types"

export default function App(): React.JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [progress, setProgress] = useState<ProgressState>({
    current: 0,
    total: 0,
    status: "",
  })
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)

  const processFiles = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const filesList = event.target.files ? Array.from(event.target.files) : []
    if (filesList.length === 0) return

    const validFiles = filesList.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase()
      return ext && EXT_MAP[ext]
    })

    if (validFiles.length === 0) {
      alert(
        "None of the selected files match supported extensions (.cpp, .js, .py, etc.).",
      )
      return
    }

    setIsProcessing(true)
    setGalleryItems([])
    setZipBlob(null)
    setProgress({
      current: 0,
      total: validFiles.length,
      status: "Initializing engines...",
    })

    const zip = new JSZip()

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      setProgress((prev) => ({
        ...prev,
        current: i + 1,
        status: `Rendering asset: ${file.name}`,
      }))

      const text = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve((e.target?.result as string) || "")
        reader.readAsText(file)
      })

      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      const lang = EXT_MAP[ext] || "plaintext"

      // Execute programmatic React render to snapshot pipeline
      const base64Png = await renderCodeToPngData(text, lang)
      const rawData = base64Png.split(",")[1]

      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name
      zip.file(`${baseName}.png`, rawData, { base64: true })

      setGalleryItems((prev) => [
        ...prev,
        { id: i, name: `${baseName}.png`, src: base64Png },
      ])
    }

    setProgress((prev) => ({
      ...prev,
      status: "Packing asset array into zip container...",
    }))
    const generatedBlob = await zip.generateAsync({ type: "blob" })
    setZipBlob(generatedBlob)
    setProgress((prev) => ({
      ...prev,
      status: "Batch processing executed successfully!",
    }))
  }

  const downloadZip = (): void => {
    if (!zipBlob) return
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "code-snapshots.zip"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Pure programmatic background engine generator
  const renderCodeToPngData = (
    rawCode: string,
    language: string,
  ): Promise<string> => {
    return new Promise<string>((resolve) => {
      // 1. Setup a hidden, structural mounting node offscreen
      const scratchContainer = document.createElement("div")
      scratchContainer.style.position = "absolute"
      scratchContainer.style.left = "-9999px"
      scratchContainer.style.top = "-9999px"
      document.body.appendChild(scratchContainer)

      // 2. Setup the exact wrapper dimensions html2canvas-pro requires
      const wrapper = document.createElement("div")
      wrapper.className = "p-4 flex items-center justify-center bg-gray-50"
      scratchContainer.appendChild(wrapper)

      const reactRoot = createRoot(wrapper)

      // 3. Render the standard component natively with predictable layout handles
      reactRoot.render(
        <div>
          <SyntaxHighlighter
            language={language}
            style={nightOwl}
            showLineNumbers={true}
            // showInlineLineNumbers={true}
            wrapLongLines={true}
            startingLineNumber={1}
          >
            {rawCode.trim()}
          </SyntaxHighlighter>
        </div>,
      )

      // 4. Give React a moment to build and append the DOM node tree to wrapper
      setTimeout(() => {
        html2canvas(wrapper, {
          logging: false,
          useCORS: true,
          scale: 2,
          backgroundColor: null,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png")

          // Clean up DOM and memory scopes completely
          reactRoot.unmount()
          document.body.removeChild(scratchContainer)

          resolve(imgData)
        })
      }, 150)
    })
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col gap-6">
        <Controls
          onFilesSelected={processFiles}
          onDownloadZip={downloadZip}
          canDownload={!!zipBlob}
        />

        {isProcessing && <ProgressBar progress={progress} />}

        <Gallery items={galleryItems} isProcessing={isProcessing} />
      </main>
    </div>
  )
}
