import { NextRequest, NextResponse } from "next/server";
import { fetchAirQualityData } from "@/lib/api/open-meteo";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lonStr = searchParams.get("lon");
    const name = searchParams.get("name") || "Selected City";
    const admin = searchParams.get("admin") || undefined;
    const country = searchParams.get("country") || undefined;

    if (!latStr || !lonStr) {
      return NextResponse.json(
        { error: "Query parameters 'lat' and 'lon' are required." },
        { status: 400 }
      );
    }

    const latitude = parseFloat(latStr);
    const longitude = parseFloat(lonStr);

    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        { error: "Coordinates must be valid numbers: lat [-90, 90], lon [-180, 180]." },
        { status: 400 }
      );
    }

    const data = await fetchAirQualityData(
      latitude,
      longitude,
      name.slice(0, 100),
      admin?.slice(0, 100),
      country?.slice(0, 100)
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("[Air Quality API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve air quality data.",
      },
      { status: 500 }
    );
  }
}
