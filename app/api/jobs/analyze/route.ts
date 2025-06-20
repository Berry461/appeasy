import { NextResponse } from 'next/server';

// Simple mock analysis generator
function generateMockAnalysis(description: string) {
    const skills = ['React', 'TypeScript', 'Node.js', 'Communication', 'Problem Solving'];
    const shuffledSkills = skills.sort(() => 0.5 - Math.random());

    return {
        summary: [
            `Role requires ${description.length > 100 ? 'senior' : 'junior/mid'} level experience`,
            'Focus on ' + (description.includes('React') ? 'frontend' : 'backend') + ' development',
            'Looking for ' + (description.length > 200 ? '5+ years' : '2-3 years') + ' of experience'
        ],
        skills: shuffledSkills.slice(0, 3),
        isMock: true
    };
}

export async function POST(req: Request) {
    try {
        const { description } = await req.json();

        if (!description?.trim()) {
            return NextResponse.json(
                { error: "Please paste a job description" },
                { status: 400 }
            );
        }

        // Try Gemini API if available
        if (process.env.GEMINI_API_KEY) {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

            const prompt = `Analyze this job description and return STRICTLY as JSON:
      {
        "summary": ["bullet 1", "bullet 2", "bullet 3"],
        "skills": ["skill1", "skill2", "skill3"]
      }
      
      Job Description: ${description.substring(0, 2000)}`; // Limit input size

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // Clean JSON response
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.substring(jsonStart, jsonEnd);

            return NextResponse.json(JSON.parse(jsonString));
        }

        // Fallback to mock data
        return NextResponse.json(generateMockAnalysis(description));

    } catch (error) {
        console.error('Analysis error:', error);
        // Return mock data even on errors
        return NextResponse.json(
            generateMockAnalysis("Error occurred, showing sample analysis"),
            { status: 500 }
        );
    }
}