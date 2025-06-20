'use client';

import { useState, useEffect } from 'react';
import JobTable from '../../components/JobTable';
import JobForm from '../../components/JobForm';

export default function DashboardPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [editingJob, setEditingJob] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/jobs');
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch('/api/jobs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            await fetchJobs();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleEditSubmit = async (jobData: any) => {
        try {
            const response = await fetch('/api/jobs', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingJob.id,
                    ...jobData
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update job');
            }

            setEditingJob(null);
            await fetchJobs();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Job Applications Dashboard</h1>

            {editingJob ? (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Edit Job Application</h2>
                    <JobForm
                        initialData={editingJob}
                        onSubmit={handleEditSubmit}
                        onCancel={() => setEditingJob(null)}
                    />
                </div>
            ) : null}

            <div className="bg-white p-6 rounded-lg shadow">
                <JobTable
                    jobs={jobs}
                    onEdit={setEditingJob}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}