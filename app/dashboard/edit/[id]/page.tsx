'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import JobForm from '../../../../components/JobForm';

export default function EditJobPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs`);
                if (!response.ok) throw new Error('Failed to fetch job');
                const jobs = await response.json();
                const foundJob = jobs.find((j: any) => j.id === id);
                if (foundJob) {
                    setJob(foundJob);
                } else {
                    throw new Error('Job not found');
                }
            } catch (error) {
                console.error('Error:', error);
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id, router]);

    const handleSubmit = async (jobData: any) => {
        try {
            const response = await fetch('/api/jobs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...jobData }),
            });

            if (!response.ok) throw new Error('Failed to update job');

            // Refresh both views
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (!job) return <div>Job not found</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Edit Job Application</h1>
            <JobForm
                initialData={job}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/dashboard')}
            />
        </div>
    );
}