import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  dbName: process.env.DB_NAME || 'Ebook',
  
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  
  metadataProvider: TsMorphMetadataProvider,
  
  // Enable debug mode in development
  debug: process.env.NODE_ENV !== 'production',
  
  // Migration settings
  extensions: [Migrator],
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    emit: 'ts',
  },
  
  // Allow global context in development
  allowGlobalContext: process.env.NODE_ENV !== 'production',
});
