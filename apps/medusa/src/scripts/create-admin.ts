import { MedusaModule } from '@medusajs/framework/modules-sdk';

async function createAdmin() {
  const userModule = MedusaModule.resolve('@medusajs/user');

  const user = await userModule.createUsers({
    email: 'admin@realizah.com',
    first_name: 'Admin',
    last_name: 'User',
  });

  console.log('Admin user created:', user);
}

createAdmin()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
