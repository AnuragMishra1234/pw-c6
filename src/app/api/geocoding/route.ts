import { NextRequest, NextResponse } from "next/server";
import { searchLocations } from "@/lib/api/open-meteo";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query parameter 'q' must be at least 2 characters long." },
        { status: 400 }
      );
    }

    // Restrict query length for security
    const sanitizedQuery = query.trim().slice(0, 100);
    const results = await searchLocations(sanitizedQuery);

    return NextResponse.json({
      success: true,
      query: sanitizedQuery,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("[Geocoding API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to search location.",
      },
      { status: 500 }
    );
  }
}
