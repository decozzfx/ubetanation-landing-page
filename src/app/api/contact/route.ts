import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - simplified for build
    // TODO: Implement proper rate limiting

    const body = await request.json();
    const {
      name,
      email,
      company,
      phone,
      projectType,
      budget,
      timeline,
      message,
      newsletter
    } = body;

    // Basic validation
    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // TODO: Save contact submission to database
    // Need to create Contact model in schema.prisma first
    console.log('Contact submission:', { 
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: company?.trim() || null,
      phone: phone?.trim() || null,
      projectType: projectType.trim(),
      budget: budget?.trim() || null,
      timeline: timeline?.trim() || null,
      message: message.trim(),
      newsletter: newsletter || false
    });

    // In a real application, you would:
    // 1. Send email notification to your team
    // 2. Send confirmation email to the user
    // 3. Add to CRM system
    // 4. Set up automated follow-up sequences

    // For now, just log the contact
    console.log("New contact submission logged successfully");

    // TODO: Send email notifications
    // await sendContactNotification(contact);
    // await sendConfirmationEmail(contact);

    return NextResponse.json(
      { 
        success: true,
        message: "Thank you for your message. We'll get back to you soon!"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form submission error:", error);
    
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again." },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}