import { Migration } from '@mikro-orm/migrations';

export class Migration20260304100000 extends Migration {
  async up(): Promise<void> {
    // Create feature table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS feature (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        required_tier VARCHAR(20) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create access_rule table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS access_rule (
        id VARCHAR PRIMARY KEY,
        feature_id VARCHAR NOT NULL REFERENCES feature(id) ON DELETE CASCADE,
        customer_id VARCHAR,
        tier VARCHAR(20),
        action VARCHAR(10) NOT NULL CHECK (action IN ('allow', 'deny')),
        priority INTEGER NOT NULL DEFAULT 0,
        expires_at TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create customer_access table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS customer_access (
        customer_id VARCHAR PRIMARY KEY,
        current_tier VARCHAR(20) NOT NULL,
        subscription_id VARCHAR,
        subscription_status VARCHAR(20),
        features JSONB NOT NULL DEFAULT '[]',
        last_synced_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP
      );
    `);

    // Create indexes for feature
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_feature_tier 
        ON feature(required_tier);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_feature_category 
        ON feature(category);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_feature_active 
        ON feature(is_active);
    `);

    // Create indexes for access_rule
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_rule_feature 
        ON access_rule(feature_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_rule_customer 
        ON access_rule(customer_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_rule_priority 
        ON access_rule(priority DESC);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_rule_expires 
        ON access_rule(expires_at);
    `);

    // Create indexes for customer_access
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_customer_access_tier 
        ON customer_access(current_tier);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_customer_access_subscription 
        ON customer_access(subscription_id);
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS access_rule CASCADE;');
    this.addSql('DROP TABLE IF EXISTS customer_access CASCADE;');
    this.addSql('DROP TABLE IF EXISTS feature CASCADE;');
  }
}
