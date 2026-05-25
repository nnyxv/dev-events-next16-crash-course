import { Schema, model, models, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: { type: String, required: [true, "Image is required"], trim: true },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: { type: String, required: [true, "Date is required"], trim: true },
    time: { type: String, required: [true, "Time is required"], trim: true },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["Online", "Offline", "Hybrid"],
        message: "Mode must be either Online, Offline, or Hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: [
      {
        type: String,
        required: [true, "Agenda item is required"],
        validate: {
          validator: (v: string[]) => v.length > 0,
          message: "Agenda must have at least one item",
        },
      },
    ],
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: [
      {
        type: String,
        required: [true, "Tag is required"],
        validate: {
          validator: (v: string[]) => v.length > 0,
          message: "Tags must have at least one item",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Eliminamos 'next' y usamos una función asíncrona (Mongoose lo maneja automáticamente)
EventSchema.pre("save", async function (this: IEvent) {
  // Ahora 'this' es perfectamente reconocido como IEvent sin romper las sobrecargas
  
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
  
  // Ya no necesitas llamar a next(), Mongoose sabe que terminó cuando la función resuelve
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error("Invalid date format");
  }
  return d.toISOString();
}

function normalizeTime(dateTime: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
  const match = dateTime.trim().match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format");
  }

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[4]?.toUpperCase();

  if (period) {
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time value");
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.index({date:1, mode:1});


const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;