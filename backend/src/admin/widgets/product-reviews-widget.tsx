import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import { useAdminReviews } from "../hooks/api";
import { ReviewsTable } from "../routes/reviews/components/reviews-table";

const ProductReviewsWidget = () => {
  const params = useParams();

  const { reviews } = useAdminReviews({
    product_id: params.id!,
  });

  if (!reviews) {
    return null;
  }

  return (
    <Container className="p-0">
      <ReviewsTable filters={{ product_id: params.id! }} skipCreate={true} />
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductReviewsWidget;
