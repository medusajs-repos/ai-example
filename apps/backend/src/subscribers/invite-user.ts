import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { InviteWorkflowEvents } from "@medusajs/framework/utils";

type InviteUserData = {
  id: string;
};

export default async function inviteUserHandler({
  event: { data },
  container,
}: SubscriberArgs<InviteUserData>) {
  const query = container.resolve("query");

  const {
    data: [store],
  } = await query.graph({
    entity: "store",
    fields: ["name"],
  });

  const {
    data: [invite],
  } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: {
      id: data.id,
    },
  });

  const config = container.resolve("configModule");

  const adminPath = config.admin.path;

  const inviteUrl = `/${adminPath}/invite?token=${invite.token}`;

  const notificationModule = container.resolve("notification");

  await notificationModule.createNotifications({
    to: "oli@medusajs.com",
    template: "medusa-cloud-invite-user",
    channel: "email",
    data: {
      inviteUrl,
    },
    content: {
      subject: `You've been invited to join ${store.name}`,
    },
  });
}

export const config: SubscriberConfig = {
  event: InviteWorkflowEvents.CREATED,
};
