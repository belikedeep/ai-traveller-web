import ClientPage from "@/components/shared-trip/ClientPage";

interface PageProps {
  params: Promise<{
    tripId: string;
  }>;
}

// Server Component
export default async function SharedTripPage(props: PageProps) {
  const { tripId } = await props.params;
  return <ClientPage tripId={tripId} />;
}
