import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event, { IEvent } from "@/database/event.model";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    await connectDB();

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Slug parameter is required" },
        { status: 400 },
      );
    }
    const sanitizedSlug = slug.trim().toLowerCase();
    const event: IEvent | null = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event not found slug: ${sanitizedSlug} not found` },
        { status: 404 },
      );
    }
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "An unknown error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
