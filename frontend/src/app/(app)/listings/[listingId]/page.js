import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import ListingDetailsPage from "./ListingDetails";

const ListingPage = async ({ params }) => {
  const { listingId } = await params;

  if (!listingId) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingDetailsPage listingId={listingId} />
    </ClientOnly>
  );
};

export default ListingPage;
