import { Star, StarSolid } from "@medusajs/icons";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { AdminProductReviewResponse } from "../../../../../types";
import { ReviewActions } from "../review-actions";

const columnHelper = createColumnHelper<AdminProductReviewResponse["review"]>();

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
