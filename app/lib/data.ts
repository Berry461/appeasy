import fs from 'fs/promises';
import path from 'path';

type Job = {
    id: string;
    title: string;
    company: string;
    link?: string;
    status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
};

export type { Job };

const DB_PATH = path.join(process.cwd(), 'jobs.json');
let jobs: Job[] = [];

async function loadJobs() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        jobs = JSON.parse(data);
    } catch (err) {
        console.log('Initializing new database');
        jobs = [];
        await saveJobs();
    }
}

async function saveJobs() {
    await fs.writeFile(DB_PATH, JSON.stringify(jobs, null, 2));
}

// Initialize on import
loadJobs();

export function getJobs(): Job[] {
    return [...jobs];
}

export function addJob(job: Omit<Job, 'id'>): Job {
    const newJob = { ...job, id: Date.now().toString() };
    jobs.push(newJob);
    saveJobs();
    return newJob;
}

export function updateJob(id: string, updates: Partial<Job>): Job | null {
    const index = jobs.findIndex(job => job.id === id);
    if (index === -1) return null;

    jobs[index] = { ...jobs[index], ...updates };
    saveJobs();
    return jobs[index];
}

export function deleteJob(id: string): boolean {
    const initialLength = jobs.length;
    jobs = jobs.filter(job => job.id !== id);
    if (jobs.length !== initialLength) {
        saveJobs();
        return true;
    }
    return false;
}