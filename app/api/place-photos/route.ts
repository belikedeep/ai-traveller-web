import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoReference = searchParams.get("photo_reference");
    const maxwidth = searchParams.get("maxwidth") || "800";

    if (!photoReference) {
      return NextResponse.json(
        { error: "Photo reference is required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      photoreference: photoReference,
      key: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || "",
      maxwidth: maxwidth,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`
    );

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return NextResponse.json(
      { error: "Failed to fetch place photo" },
      { status: 500 }
    );
  }
}
