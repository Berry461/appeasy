import { NextResponse } from 'next/server';
import { getJobs, addJob, updateJob, deleteJob } from '@/app/lib/data';

export async function GET() {
    try {
        const jobs = getJobs();
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const newJob = await req.json();

        if (!newJob.title || !newJob.company) {
            return NextResponse.json(
                { error: 'Title and company are required' },
                { status: 400 }
            );
        }

        const createdJob = addJob(newJob);
        return NextResponse.json(createdJob, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...updates } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            );
        }

        const updatedJob = updateJob(id, updates);
        if (!updatedJob) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedJob);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            );
        }

        const deleted = deleteJob(id);
        if (!deleted) {
            return NextResponse.json(
                { error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}