import { serve } from "@upstash/workflow";
import Subscription from "../models/subscription.model";
import dayjs from "dayjs";
export const sendReminder = serve(async (context) => {
  const REMINDERS = [7, 5, 4, 3, 2, 1];
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;
  const renewalDate = dayjs(subscription.renewalDate);
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `renewal date has passed for subscription ${subscriptionId} .stopping workflow`
    );
    return;
  }
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    if (reminderDate.isAfter(dayjs())) {
      //put is to sleep
      await sleepUntilReminder(
        context,
        `reminder ${daysBefore} days before`,
        reminderDate
      );
    }
    await triggerReminder(context,`reminder ${daysBefore} days before`,)
  }
});
const fetchSubscription = async (context, subscriptionId) => {
  context.run("fetch subscription", () => {
    return Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`sleeping until ${label} at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`triggering ${label} reminder`);
  });
};
