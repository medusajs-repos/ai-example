import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAdminCreateReview } from "../../../hooks/api";

export const ReviewCreateSchema = z.object({
  title: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(5),
  product_id: z.string(),
  customer_id: z.string(),
});

export type ReviewCreateSchemaType = z.infer<typeof ReviewCreateSchema>;

const ReviewCreate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const form = useForm<ReviewCreateSchemaType>({
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
      product_id: "",
      customer_id: "",
    },
    resolver: zodResolver(ReviewCreateSchema),
  });

  const { mutateAsync: createReview } = useAdminCreateReview();

  const handleSubmit = form.handleSubmit(async (data) => {
    await createReview(data, {
      onSuccess: () => {
        toast.success("Review created");
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
    <FocusModal
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          navigate("..");
        }

        setOpen(value);
      }}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <Button size="small" type="submit">
            Save
          </Button>
        </FocusModal.Header>

        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-lg flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>Create Product Review</Heading>

              <Text className="text-ui-fg-subtle">
                Create product reviews for a product
              </Text>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col overflow-hidden"
              >
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col space-y-2 m-1">
                        <div className="flex items-center">
                          <Label size="small" weight="plus">
                            Title
                          </Label>
                        </div>

                        <Input {...field} />
                      </div>
                    );
                  }}
                />

                <Controller
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col space-y-2 m-1">
                        <div className="flex items-center">
                          <Label size="small" weight="plus">
                            Content
                          </Label>
                        </div>

                        <Input {...field} />
                      </div>
                    );
                  }}
                />

                <Controller
                  control={form.control}
                  name="rating"
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col space-y-2 m-1">
                        <div className="flex items-center">
                          <Label size="small" weight="plus">
                            Rating
                          </Label>
                        </div>

                        <Input {...field} type="number" />
                      </div>
                    );
                  }}
                />
              </form>
            </FormProvider>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default ReviewCreate;
