import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Drawer, Heading, Input, Label, toast } from "@medusajs/ui";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AdminProductReviewResponse } from "../../../../../../types";
import { useAdminUpdateReview } from "../../../../../hooks/api/reviews";

export const ReviewEditSchema = z.object({
  title: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

export type ReviewEditSchemaType = z.infer<typeof ReviewEditSchema>;

type ReviewEditFormProps = {
  review: AdminProductReviewResponse["review"];
};

export const ReviewEditForm = ({ review }: ReviewEditFormProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const form = useForm<ReviewEditSchemaType>({
    defaultValues: {
      title: review.title,
      content: review.content,
    },
    resolver: zodResolver(ReviewEditSchema),
  });

  const { mutateAsync: updateReview } = useAdminUpdateReview(review.id);

  const handleSubmit = form.handleSubmit(async (data) => {
    await updateReview(data, {
      onSuccess: () => {
        toast.success("Review updated");
        setOpen(false);
        form.reset();
        navigate("../..");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  });

  return (
    <Drawer
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setOpen(false);
          form.reset();
          navigate("../..");
        }

        setOpen(value);
      }}
    >
      <Drawer.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <Drawer.Header>
              <Heading className="capitalize">Edit Item</Heading>
            </Drawer.Header>
            <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
              <Controller
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-x-1">
                        <Label size="small" weight="plus">
                          Title
                        </Label>
                      </div>

                      <Input {...field} />
                    </div>
                  );
                }}
              />
            </Drawer.Body>
            <Drawer.Footer>
              <div className="flex items-center justify-end gap-x-2">
                <Drawer.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </Drawer.Close>
                <Button size="small" type="submit">
                  Save
                </Button>
              </div>
            </Drawer.Footer>
          </form>
        </FormProvider>
      </Drawer.Content>
    </Drawer>
  );
};
