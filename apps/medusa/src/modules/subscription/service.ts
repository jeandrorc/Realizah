// @ts-nocheck - MedusaService
import { MedusaService } from '@medusajs/framework/utils';
import SubscriptionPlan from './models/subscription-plan';
import Subscription from './models/subscription';
import SubscriptionInvoice from './models/subscription-invoice';

class SubscriptionModuleService extends MedusaService({
  SubscriptionPlan,
  Subscription,
  SubscriptionInvoice,
}) {}

export default SubscriptionModuleService;
