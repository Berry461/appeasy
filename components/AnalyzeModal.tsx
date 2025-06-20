'use client';
import { useState } from 'react';

export default function AnalyzeModal({ onClose }: { onClose: () => void }) {
    const [description, setDescription] = useState('');
    const [result, setResult] = useState<{
        summary?: string[];
        skills?: string[];
        error?: string;
        isMock?: boolean;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!description.trim()) {
            setResult({ error: 'Please enter a job description' });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/jobs/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Analysis failed');

            setResult(data);
        } catch (err) {
            setResult({
                error: err instanceof Error ? err.message : 'Analysis failed',
                ...generateMockAnalysis(description) // Fallback UI
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Analyze Job Description</h2>

                    <textarea
                        className="w-full border p-3 mb-4 rounded min-h-[200px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                    />

                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze'}
                        </button>
                        <button
                            onClick={onClose}
                            className="border px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>

                    {result?.error && (
                        <div className="text-red-500 mb-4">{result.error}</div>
                    )}

                    {result && (
                        <div className="space-y-4">
                            {result.isMock && (
                                <div className="bg-yellow-100 p-3 rounded text-yellow-800">
                                    Showing mock data (no API key configured)
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold mb-2">Summary:</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {result.summary?.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Skills to Highlight:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.skills?.map((skill, i) => (
                                        <span key={i} className="bg-gray-100 px-3 py-1 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Local fallback generator
function generateMockAnalysis(desc: string) {
    return {
        summary: [
            desc.includes('senior') ? 'Senior-level position' : 'Mid-level position',
            'Focus on ' + (desc.includes('React') ? 'frontend' : 'backend') + ' development',
            'Looking for experience with key technologies mentioned'
        ],
        skills: ['React', 'TypeScript', 'Node.js'].sort(() => 0.5 - Math.random()),
        isMock: true
    };
}