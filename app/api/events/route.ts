import connectDB from "@/lib/mongodb";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event, { IEvent } from "@/database/event.model";
import { log } from "console";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "invalid json data format " },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }
    // const buffer = Buffer.from(arrayBuffer);
    // const uploadResult = await new Promise((resolve, reject) => {
    //   cloudinary.config();
    //   cloudinary.uploader
    //     .upload_stream(
    //       { resource_type: "image", folder: "Event" },
    //       (error, result) => {
    //         if (error) return reject(error);
    //         resolve(result);
    //       },
    //     )
    //     .end(buffer);
    // });

    //event.imageUrl = (uploadResult as { secure_url: string }).secure_url;


    let tags = formData.getAll("tags") as string[];
    let agenda = formData.getAll("agenda") as string[];

    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating event:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === "object" && "message" in error
          ? (error as any).message
          : typeof error === "string"
            ? error
            : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to create event",
        error: errorMessage, // Aquí ya irá "Server returned unexpected status code - 403"
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : error && typeof error === "object" && "message" in error
          ? (error as any).message
          : typeof error === "string"
            ? error
            : "Unknown error";
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
