// @ts-nocheck
import { createWorkflow, WorkflowResponse, createStep } from '@medusajs/framework/workflows-sdk';
import type { CancelSubscriptionInput } from '@realizah/types';

interface CancelSubscriptionWorkflowInput {
  subscriptionId: string;
  input: CancelSubscriptionInput;
}

const cancelSubscriptionStep = createStep(
  'cancel-subscription-step',
  async (data: CancelSubscriptionWorkflowInput, { container }) => {
    const subscriptionService = container.resolve('subscriptionService');

    const subscription = await subscriptionService.cancelSubscription(
      data.subscriptionId,
      data.input,
    );

    return { subscription };
  },
);

export const cancelSubscriptionWorkflow = createWorkflow(
  'cancel-subscription-workflow',
  (input: CancelSubscriptionWorkflowInput) => {
    const result = cancelSubscriptionStep(input);
    return new WorkflowResponse(result);
  },
);
