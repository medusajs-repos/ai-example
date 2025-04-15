import { useParams } from "react-router-dom";
import { useAdminReview } from "../../../../hooks/api/reviews";
import { ReviewEditForm } from "./components/review-edit-form";

const ReviewEditPage = () => {
  const { id } = useParams();
  const { review, isLoading, isError } = useAdminReview(id!, {
    fields:
      "id,rating,title,content,status,customer_id,product_id,*customer,*product",
  });

  if (isError || !review || isLoading) {
    return;
  }

  return <ReviewEditForm review={review} />;
};

export default ReviewEditPage;
