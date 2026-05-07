import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from '../src/mikro-orm.config';

async function run() {
  const orm = await MikroORM.init(mikroOrmConfig as any);
  const migrator = orm.getMigrator();
  console.log('Running migrations...');
  await migrator.up();
  console.log('Migrations applied.');
  await orm.close(true);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
