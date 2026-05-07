import { Migration } from '@mikro-orm/migrations';

export class Migration20240101000000_CreateUsersTable extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "first_name" VARCHAR(255) NOT NULL,
        "last_name" VARCHAR(255) NOT NULL,
        "age" INTEGER NOT NULL,
        "height" DECIMAL(5,2) NOT NULL,
        "weight" DECIMAL(5,2) NOT NULL,
        "gender" VARCHAR(50) NOT NULL,
        "activity_level" VARCHAR(50) NOT NULL,
        "activity_type" VARCHAR(50) NOT NULL,
        "email" VARCHAR(255),
        "has_purchased_report" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for common queries
    this.addSql(`
      CREATE INDEX "idx_users_gender_age" ON "users" ("gender", "age");
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "users";`);
  }
}
