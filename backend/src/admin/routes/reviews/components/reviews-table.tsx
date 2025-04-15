import { DataTable, Heading, useDataTable } from "@medusajs/ui";
import { useAdminReviews } from "../../../../admin/hooks/api/reviews"; // Corrected import path
import { useReviewsTableColumns } from "./table/columns";

export const ReviewsTable = () => {
  const { reviews, count } = useAdminReviews({
    fields:
      "id,rating,title,content,status,created_at,customer_id,product_id,*customer,*product", // Fetch related customer and product
    order: "-created_at",
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
        </DataTable.Toolbar>

        <DataTable.Table />
      </DataTable>
    </div>
  );
};
