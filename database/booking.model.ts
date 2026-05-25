import { Schema, model, models, Document } from "mongoose";
import Event from "./event.model";
export interface IBooking extends Document {
  eventId: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: String,
      required: [true, "Event ID is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["Confirmed", "Cancelled"],
        message: "Status must be either Confirmed or Cancelled",
      },
    },
  },
  { timestamps: true },
);

BookingSchema.pre("save", async function (this: IBooking) {
  // Ahora 'this' es perfectamente reconocido como IBooking sin romper las sobrecargas

  if (this.isModified("eventId") || this.isNew) {
    try {
      const eventExists = await Event.findById(this.eventId).select("_id");
      if (!eventExists) {
        const error = new Error("Event not found for the provided eventId");
        error.name = "ValidationError";
        throw error;
      }
    } catch (err: any) {
      if (err.name === "ValidationError") {
        throw err; // Re-throw validation errors
      }

      const validationError = new Error("Invalid eventId format");
      validationError.name = "ValidationError";
      throw validationError;
    }
  }
  // Ya no necesitas llamar a next(), Mongoose sabe que terminó cuando la función resuelve
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
