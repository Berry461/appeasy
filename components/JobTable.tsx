'use client';

import { Job } from '@/app/lib/data';
import { useState } from 'react';

type JobTableProps = {
    jobs: Job[];
    onEdit: (job: Job) => void;
    onDelete: (id: string) => Promise<void>;
};

export default function JobTable({ jobs, onEdit, onDelete }: JobTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await onDelete(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Company</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Link</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {job.title}
                            </td>
                            <td className="px-6 py-4">{job.company}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                        job.status === 'Interviewing' ? 'bg-purple-100 text-purple-800' :
                                            job.status === 'Offer' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                    }`}>
                                    {job.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {job.link ? (
                                    <a
                                        href={job.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </a>
                                ) : 'N/A'}
                            </td>
                            <td className="px-6 py-4 space-x-2">
                                <button
                                    onClick={() => onEdit(job)}
                                    className="font-medium text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    disabled={deletingId === job.id}
                                    className={`font-medium text-red-600 hover:underline ${deletingId === job.id ? 'opacity-50' : ''
                                        }`}
                                >
                                    {deletingId === job.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}