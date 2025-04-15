import { Button, DataTable, Heading, useDataTable } from "@medusajs/ui";
import { Link } from "react-router-dom";
import { useAdminReviews } from "../../../../admin/hooks/api/reviews"; // Corrected import path
import { ProductReviewFilterParams } from "../../../../types";
import { useReviewsTableColumns } from "./table/columns";

export const ReviewsTable = ({
  filters,
  skipCreate = false,
}: {
  filters?: ProductReviewFilterParams;
  skipCreate?: boolean;
}) => {
  const { reviews, count } = useAdminReviews({
    fields:
      "id,rating,title,content,status,created_at,customer_id,product_id,*customer,*product", // Fetch related customer and product
    order: "-created_at",
    ...filters,
  });

  const columns = useReviewsTableColumns();

  const table = useDataTable({
    data: reviews || [],
    columns,
    getRowId: (review) => review.id,
    rowCount: count,
    isLoading: false,
  });

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Product Reviews</Heading>
          {!skipCreate && (
            <Button variant="secondary" size="small" asChild>
              <Link to="create">Create Review</Link>
            </Button>
          )}
        </DataTable.Toolbar>

        <DataTable.Table
          emptyState={{
            empty: {
              heading: "No reviews found",
              description: "No reviews found for this product",
            },
            filtered: {
              heading: "No reviews found",
              description: "No reviews found for the applied filters",
            },
          }}
        />
      </DataTable>
    </div>
  );
};
