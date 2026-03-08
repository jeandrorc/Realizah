// @ts-nocheck
import { createWorkflow, WorkflowResponse, createStep } from '@medusajs/framework/workflows-sdk';
import type { CreateSubscriptionInput } from '@realizah/types';

const createSubscriptionStep = createStep(
  'create-subscription-step',
  async (input: CreateSubscriptionInput, { container }) => {
    const subscriptionService = container.resolve('subscriptionService');
    const subscriptionInvoiceService = container.resolve('subscriptionInvoiceService');

    const subscription = await subscriptionService.createSubscription(input);

    const invoice = await subscriptionInvoiceService.createInvoice({
      subscriptionId: subscription.id,
      customerId: subscription.customerId,
      amount: 0,
      currency: 'BRL',
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      dueDate: subscription.currentPeriodEnd,
    });

    return { subscription, invoice };
  },
);

export const createSubscriptionWorkflow = createWorkflow(
  'create-subscription-workflow',
  (input: CreateSubscriptionInput) => {
    const result = createSubscriptionStep(input);
    return new WorkflowResponse(result);
  },
);
