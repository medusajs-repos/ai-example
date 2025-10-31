import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { AuthWorkflowEvents } from "@medusajs/framework/utils";

type ResetPasswordData = {
  entity_id: string;
  token: string;
};

export default async function resetPasswordHandler({
  event: { data },
  container,
}: SubscriberArgs<ResetPasswordData>) {
  const { entity_id: email, token } = data;
  const config = container.resolve("configModule");

  const adminPath = config.admin.path;

  const resetPasswordUrl = `/${adminPath}/reset-password?email=${email}&token=${token}`;

  const notificationModule = container.resolve("notification");

  await notificationModule.createNotifications({
    to: email,
    channel: "email",
    template: "medusa-cloud-reset-password",
    data: {
      resetPasswordUrl,
    },
    content: {
      subject: "Reset your password",
    },
  });
}

export const config: SubscriberConfig = {
  event: AuthWorkflowEvents.PASSWORD_RESET,
};
