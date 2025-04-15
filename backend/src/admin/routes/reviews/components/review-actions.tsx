import { EllipsisVertical } from "@medusajs/icons";
import { DropdownMenu, Prompt, toast } from "@medusajs/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminProductReviewResponse } from "../../../../types";
import { useAdminDeleteReview } from "../../../hooks/api/reviews";

export const ReviewActions = ({
  review,
}: {
  review: AdminProductReviewResponse["review"];
}) => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: mutateDelete } = useAdminDeleteReview(review.id);

  const handleDelete = async () => {
    await mutateDelete(undefined, {
      onSuccess: () => {
        toast.success(`Review deleted successfully`);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <EllipsisVertical className="w-4 h-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            onClick={() => navigate(`/reviews/${review.id}/edit`)}
          >
            Edit
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <Prompt open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Delete Review</Prompt.Title>
            <Prompt.Description>
              Are you sure you want to delete this review?
            </Prompt.Description>
          </Prompt.Header>

          <Prompt.Footer>
            <Prompt.Cancel>Cancel</Prompt.Cancel>
            <Prompt.Action onClick={handleDelete}>Delete</Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
};
