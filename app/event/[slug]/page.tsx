import BookEvent from "@/components/BookEvent";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

// Sub-componente: Agenda
const EventAgendaItem = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      {agendaItems.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
};

// Sub-componente: Etiquetas (Tags)
const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    // Corregido: "felx-row" cambiado por "flex-row"
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

// COMPONENTE PRINCIPAL
const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  let event;

  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
      { next: { revalidate: 60 } },
    );

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
    }
    const response = await request.json();
    event = response.event;

    if (!event) return notFound();
  } catch (error) {
    console.log("Error fetching event details:", error);
    return notFound();
  }

  const {
    title,
    description,
    overview,
    image,
    date,
    time,
    location,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = event;

  if (!title) return notFound();
  const booking = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);


  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>{" "}
        {/* Corregido: Usar la variable estática title en vez de texto plano fijo */}
        <p className="mt-2"> {description} </p>
      </div>

      <div className="details">
        <div className="content">
          {/* <Image src={image} alt={title} width={800} height={800} className="banner"/> */}

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgendaItem agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2> About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2> Book Your Spot</h2>
            {booking > 0 ? (
              <p className="text-sm">
                Join {booking} people who have already book their spot! seats
                left!
              </p>
            ) : (
              <p>Be the firts to book your spot</p>
            )}
            <BookEvent></BookEvent>
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events You Might Like</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
      </div>
    </section>
  ); // Cierre del return
}; // Cierre de la función EventDetailsPage

export default EventDetailsPage;
