export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2025",
    slug: "React-Summit-US-2025",
    location: "San Francisco, CA, USA",
    date: "2024-06-30",
    time: "18:00",
  },
  {
    image: "/images/event2.png",
    title: "Next.js Conf 2025",
    slug: "Next-js-Conf-2025",
    location: "New York, NY, USA",
    date: "2025-10-24",
    time: "10:00",
  },
  {
    image: "/images/event3.png",
    title: "Tailwind Connect",
    slug: "Tailwind-Connect",
    location: "Austin, TX, USA",
    date: "2025-07-15",
    time: "09:30",
  },
  {
    image: "/images/event4.png",
    title: "Laracon US 2025",
    slug: "Laracon-US-2025",
    location: "Dallas, TX, USA",
    date: "2025-08-04",
    time: "09:00",
  },
  {
    image: "/images/event5.png",
    title: "GitHub Universe",
    slug: "GitHub-Universe",
    location: "San Francisco, CA, USA",
    date: "2025-11-12",
    time: "13:00",
  },
  {
    image: "/images/event6.png",
    title: "JS World Conference",
    slug: "JS-World-Conference",
    location: "Amsterdam, Netherlands",
    date: "2026-02-18",
    time: "08:45",
  },
];
