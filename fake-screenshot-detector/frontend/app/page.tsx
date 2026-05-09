'use client'

import { useState } from 'react'

export default function Home() {

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const analyzeImage = async () => {

    if (!file) {
      alert('Please upload image')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      setResult(data)

    } catch (error) {
      alert('Error analyzing screenshot')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">

      <div className="w-full max-w-3xl bg-zinc-900 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-6xl font-bold text-center mb-6">
          Fake Screenshot Detector
        </h1>

        <p className="text-zinc-400 text-center mb-10">
          AI-powered screenshot authenticity analyzer
        </p>

        <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-10 text-center hover:border-blue-500 transition">

          <label className="cursor-pointer block">

            <div className="text-6xl mb-4">📸</div>

            <h2 className="text-2xl font-semibold mb-2">
              Drag & Drop Screenshot
            </h2>

            <p className="text-zinc-400 mb-6">
              or click to upload image
            </p>

            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const selectedFile = e.target.files[0]
                  setFile(selectedFile)
                  setPreview(URL.createObjectURL(selectedFile))
                }
              }}
            />

            {preview && (
              <div className="mb-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-2xl max-h-96 mx-auto border border-zinc-700"
                />
              </div>
            )}

          </label>

          <button
            onClick={analyzeImage}
            className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition text-lg"
          >
            {loading ? 'Analyzing...' : 'Analyze Screenshot'}
          </button>
        </div>

        {result && (
          <div className="mt-10 bg-black rounded-2xl p-8">

            <div className="flex items-center justify-between mb-8">

  <h2 className="text-4xl font-bold">
    Analysis Result
  </h2>

  <div
    className={`px-5 py-2 rounded-full font-bold text-sm shadow-lg ${
      result.fake_score > 70
        ? 'bg-red-500/20 text-red-400 border border-red-500'
        : result.fake_score > 40
        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500'
        : 'bg-green-500/20 text-green-400 border border-green-500'
    }`}
  >
    {result.fake_score > 70
      ? 'HIGH RISK'
      : result.fake_score > 40
      ? 'SUSPICIOUS'
      : 'SAFE'}
  </div>

</div>

            <div className="mb-8">

              <div className="flex justify-between mb-2">
                <span className="font-semibold">Fake Score</span>
                <span>{result.fake_score}%</span>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">

                <div
                  className={`h-4 rounded-full ${
                    result.fake_score > 70
                      ? 'bg-red-500'
                      : result.fake_score > 40
                      ? 'bg-yellow-400'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${result.fake_score}%`,
                    transition: 'width 1s ease'
                  }}
                />
              </div>

            </div>

            <div className="space-y-4 text-lg">

              <div>
                <span className="font-semibold">Suspicious:</span>{' '}
                {result.metadata.suspicious ? 'Yes' : 'No'}
              </div>

              <div>
                <span className="font-semibold">Editing Software:</span>{' '}
                {result.metadata.editing_software}
              </div>

              <div>
                <span className="font-semibold">Possible Edit:</span>{' '}
                {result.pixel_analysis.possible_edit ? 'Detected' : 'Not Detected'}
              </div>
              <div>

  <span className="font-semibold block mb-3">
    AI Heatmap Detection:
  </span>

  <img
    src={result.pixel_analysis.heatmap_url}
    alt="Heatmap"
    className="rounded-2xl border border-zinc-700"
  />

</div>

              <div>
                <span className="font-semibold">Extracted Text:</span>

                <div className="bg-zinc-900 mt-3 p-4 rounded-xl text-sm overflow-auto max-h-64">
                  {result.text}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </main>
  )
}