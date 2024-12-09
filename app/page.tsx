'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateProject() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [status, setStatus] = useState<'idle' | 'creating' | 'created' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])

  const handleCreate = async () => {
    setStatus('creating')
    setLogs([])
    try {
      const response = await fetch('/api/createWebsite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName })
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error('Failed to create website')
      
      // Add logs from the backend
      setLogs(data.logs)
      setStatus('created')
      
      // Redirect to first page after successful creation
      setTimeout(() => {
        router.push('/first')
      }, 1000) // Small delay to show success state
      
    } catch (error) {
      setStatus('error')
      setLogs(prev => [...prev, '❌ Error: ' + (error as Error).message])
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleCreate}
        disabled={status === 'creating' || !projectName}
        className={`px-6 py-3 rounded-lg text-white ${
          status === 'creating' ? 'bg-gray-400' :
          status === 'created' ? 'bg-green-500' :
          status === 'error' ? 'bg-red-500' :
          'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {status === 'creating' ? 'Creating...' :
         status === 'created' ? 'Created!' :
         status === 'error' ? 'Error!' :
         'Create New Website'}
      </button>

      {/* Logs Display */}
      {logs.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="py-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
