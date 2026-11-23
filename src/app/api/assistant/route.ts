import { NextRequest, NextResponse } from "next/server";
import {
  AssistantRequestSchema,
  checkRateLimit,
  queryGroqAssistant,
} from "@/lib/assistant/groq-client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. IP extraction for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many questions submitted. Please wait a minute before asking again.",
        },
        { status: 429 }
      );
    }

    // 2. Body size check
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 15000) {
      return NextResponse.json(
        { success: false, error: "Request payload too large." },
        { status: 413 }
      );
    }

    // 3. Parse JSON & Validate with Zod
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const parseResult = AssistantRequestSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: " + parseResult.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    // 4. Query assistant
    const response = await queryGroqAssistant(parseResult.data);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[Assistant Route Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your question at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}
