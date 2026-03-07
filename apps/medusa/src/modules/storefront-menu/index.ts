import { Module } from '@medusajs/framework/utils';
import StorefrontMenuService from './service';

export const STOREFRONT_MENU_MODULE = 'storefrontMenuModuleService';

export default Module(STOREFRONT_MENU_MODULE, {
  service: StorefrontMenuService,
});
