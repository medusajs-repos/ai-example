import { Star, StarSolid } from "@medusajs/icons";
import {
  Button,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  Heading,
  useDataTable,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminReviews } from "../../../../admin/hooks/api/reviews"; // Corrected import path
import {
  AdminProductReviewResponse,
  ProductReviewFilterParams,
} from "../../../../types";
import { ReviewActions } from "./review-actions";

const PAGE_SIZE = 10;

const columnHelper =
  createDataTableColumnHelper<AdminProductReviewResponse["review"]>();

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-x-1 items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <StarSolid className="text-ui-tag-orange-icon" />
          ) : (
            <Star className="text-ui-fg-muted" />
          )}
        </span>
      ))}
      <span className="text-ui-fg-subtle text-sm">({rating})</span>
    </div>
  );
};

export const useReviewsTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
      }),
      columnHelper.accessor("product.title", {
        header: "Product",
      }),
      columnHelper.accessor("customer.email", {
        header: "Customer",
      }),
      columnHelper.accessor("rating", {
        header: "Rating",
        cell: ({ getValue }) => <StarRating rating={getValue()} />,
      }),
      columnHelper.accessor("title", {
        header: "Title",
      }),
      columnHelper.accessor("content", {
        header: "Content",
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <ReviewActions review={row.original} />,
      }),
    ],
    []
  );
};

export const ReviewsTable = ({
  filters,
  skipCreate = false,
}: {
  filters?: ProductReviewFilterParams;
  skipCreate?: boolean;
}) => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: PAGE_SIZE, // number of items per page
    pageIndex: 0, // current page (zero-based index)
  });

  const offset = useMemo(() => {
    return pagination.pageIndex * pagination.pageSize;
  }, [pagination]);

  const { reviews, count } = useAdminReviews({
    fields:
      "id,rating,title,content,status,created_at,customer_id,product_id,*customer,*product", // Fetch related customer and product
    order: "-created_at",
    limit: pagination.pageSize,
    offset,
    ...filters,
  });

  const columns = useReviewsTableColumns();

  const table = useDataTable({
    data: reviews || [],
    columns,
    getRowId: (review) => review.id,
    rowCount: count,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
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

        <DataTable.Pagination />
      </DataTable>
    </div>
  );
};
