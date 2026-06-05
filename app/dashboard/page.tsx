import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getTreks } from "@/lib/treks";
import { getPosts } from "@/lib/posts";
import DashboardApp, {
  type BookingRow,
  type InquiryRow,
} from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [treks, bookings, posts, inquiries] = await Promise.all([
    getTreks({ includeUnpublished: true }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" } }),
    getPosts({ includeUnpublished: true }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const bookingRows: BookingRow[] = bookings.map((b) => ({
    id: b.id,
    trekName: b.trekName,
    name: b.name,
    email: b.email,
    phone: b.phone,
    date: b.date,
    people: b.people,
    message: b.message,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));

  const inquiryRows: InquiryRow[] = inquiries.map((i) => ({
    id: i.id,
    name: i.name,
    email: i.email,
    phone: i.phone,
    subject: i.subject,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <DashboardApp
      initialTreks={treks}
      initialBookings={bookingRows}
      initialPosts={posts}
      initialInquiries={inquiryRows}
    />
  );
}
