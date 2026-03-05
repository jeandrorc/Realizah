import { Migration } from '@mikro-orm/migrations';

export class Migration20260304000000 extends Migration {
  async up(): Promise<void> {
    // Create subscription_plan table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS subscription_plan (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        description TEXT,
        price INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
        interval VARCHAR(20) NOT NULL,
        interval_count INTEGER NOT NULL DEFAULT 1,
        trial_days INTEGER,
        features JSONB NOT NULL DEFAULT '[]',
        tier VARCHAR(20) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create subscription table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS subscription (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR NOT NULL,
        plan_id VARCHAR NOT NULL REFERENCES subscription_plan(id),
        status VARCHAR(20) NOT NULL,
        current_period_start TIMESTAMP NOT NULL,
        current_period_end TIMESTAMP NOT NULL,
        cancel_at TIMESTAMP,
        canceled_at TIMESTAMP,
        trial_start TIMESTAMP,
        trial_end TIMESTAMP,
        payment_method_id VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create subscription_invoice table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS subscription_invoice (
        id VARCHAR PRIMARY KEY,
        subscription_id VARCHAR NOT NULL REFERENCES subscription(id),
        customer_id VARCHAR NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
        status VARCHAR(20) NOT NULL,
        period_start TIMESTAMP NOT NULL,
        period_end TIMESTAMP NOT NULL,
        due_date TIMESTAMP NOT NULL,
        paid_at TIMESTAMP,
        payment_intent_id VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create indexes
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_subscription_customer 
        ON subscription(customer_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_subscription_status 
        ON subscription(status);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_subscription_period_end 
        ON subscription(current_period_end);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_invoice_subscription 
        ON subscription_invoice(subscription_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_invoice_status 
        ON subscription_invoice(status);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_invoice_customer 
        ON subscription_invoice(customer_id);
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS subscription_invoice CASCADE;');
    this.addSql('DROP TABLE IF EXISTS subscription CASCADE;');
    this.addSql('DROP TABLE IF EXISTS subscription_plan CASCADE;');
  }
}
