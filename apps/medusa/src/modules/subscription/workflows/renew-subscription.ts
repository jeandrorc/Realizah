// @ts-nocheck
import { createWorkflow, WorkflowResponse, createStep } from '@medusajs/framework/workflows-sdk';

interface RenewSubscriptionWorkflowInput {
  subscriptionId: string;
}

const renewSubscriptionStep = createStep(
  'renew-subscription-step',
  async (data: RenewSubscriptionWorkflowInput, { container }) => {
    const subscriptionService = container.resolve('subscriptionService');
    const subscriptionInvoiceService = container.resolve('subscriptionInvoiceService');

    const subscription = await subscriptionService.retrieveSubscription(data.subscriptionId);
    const plan = await container
      .resolve('subscriptionPlanService')
      .retrievePlan(subscription.planId);

    const invoice = await subscriptionInvoiceService.createInvoice({
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      amount: plan.price,
      currency: plan.currency,
      periodStart: subscription.currentPeriodEnd,
      periodEnd: new Date(
        subscription.currentPeriodEnd.getTime() +
          (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000,
      ),
      dueDate: subscription.currentPeriodEnd,
    });

    const renewedSubscription = await subscriptionService.renewSubscription(data.subscriptionId);

    return { subscription: renewedSubscription, invoice };
  },
);

export const renewSubscriptionWorkflow = createWorkflow(
  'renew-subscription-workflow',
  (input: RenewSubscriptionWorkflowInput) => {
    const result = renewSubscriptionStep(input);
    return new WorkflowResponse(result);
  },
);
