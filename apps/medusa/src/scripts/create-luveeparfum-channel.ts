import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';

export default async function createLuveeparfumChannel({ container }: ExecArgs) {
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
  const apiKeyModule = container.resolve(Modules.API_KEY);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = await (salesChannelModule as any).listSalesChannels({ name: 'Luvée Parfum' });
  let channelId: string;
  if (existing.length > 0) {
    channelId = existing[0].id as string;
    console.log(`Sales channel already exists: ${channelId} — ${existing[0].name}`);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [created] = await (salesChannelModule as any).createSalesChannels([
      { name: 'Luvée Parfum' },
    ]);
    channelId = created.id as string;
    console.log(`Sales channel created: ${channelId} — Luvée Parfum`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingKeys = await (apiKeyModule as any).listApiKeys({ title: 'luveeparfum-storefront' });
  if (existingKeys.length > 0) {
    console.log(
      `Publishable key already exists — id: ${existingKeys[0].id}, redacted: ${existingKeys[0].redacted}`,
    );
    console.log('NOTE: Token shown only at creation. Revoke and recreate to get a new one.');
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = await (apiKeyModule as any).createApiKeys({
      title: 'luveeparfum-storefront',
      type: 'publishable',
      created_by: 'admin',
    });
    console.log(`Publishable key created — id: ${key.id}`);
    console.log(`TOKEN (save this now): ${key.token}`);
  }
}
