import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { jobTitle, firstName, lastName, email, phone, resumeUrl, coverLetter } = body;

        if (!jobTitle || !firstName || !lastName || !email) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const application = await prisma.jobApplication.create({
            data: {
                jobTitle,
                firstName,
                lastName,
                email,
                phone,
                resumeUrl,
                coverLetter,
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
