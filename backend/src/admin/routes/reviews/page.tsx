import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Star } from "@medusajs/icons";
import { Container, Toaster } from "@medusajs/ui";
import { ReviewsTable } from "./components/reviews-table";

const ReviewsPage = () => {
  return (
    <>
      <Container className="flex flex-col p-0 overflow-hidden h-full">
        <ReviewsTable />
      </Container>

      <Toaster />
    </>
  );
};

export const config = defineRouteConfig({
  label: "Product Reviews",
  icon: Star, // Using Star icon for now, replace if a better one exists
});

export default ReviewsPage;
