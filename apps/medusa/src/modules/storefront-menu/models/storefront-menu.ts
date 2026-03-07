import { model } from '@medusajs/framework/utils';

const StorefrontMenu = model.define('storefront_menu', {
  id: model.id().primaryKey(),
  name: model.text().default('header_main'),
  items: model.json(),
  metadata: model.json().nullable(),
});

export default StorefrontMenu;
