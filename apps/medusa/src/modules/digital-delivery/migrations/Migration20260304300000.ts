import { Migration } from '@mikro-orm/migrations';

export class Migration20260304300000 extends Migration {
  async up(): Promise<void> {
    // Create digital_product table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS digital_product (
        id VARCHAR PRIMARY KEY,
        product_id VARCHAR NOT NULL UNIQUE,
        name VARCHAR NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL,
        download_limit INTEGER,
        expiration_days INTEGER,
        file_size BIGINT NOT NULL DEFAULT 0,
        required_tier VARCHAR(20),
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create digital_file table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS digital_file (
        id VARCHAR PRIMARY KEY,
        digital_product_id VARCHAR NOT NULL REFERENCES digital_product(id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        description TEXT,
        storage_key VARCHAR NOT NULL UNIQUE,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create digital_purchase table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS digital_purchase (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR NOT NULL,
        digital_product_id VARCHAR NOT NULL REFERENCES digital_product(id),
        order_id VARCHAR NOT NULL,
        status VARCHAR(20) NOT NULL,
        download_count INTEGER NOT NULL DEFAULT 0,
        last_download_at TIMESTAMP,
        expires_at TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(customer_id, digital_product_id, order_id)
      );
    `);

    // Create download_log table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS download_log (
        id VARCHAR PRIMARY KEY,
        digital_purchase_id VARCHAR NOT NULL REFERENCES digital_purchase(id) ON DELETE CASCADE,
        digital_file_id VARCHAR NOT NULL REFERENCES digital_file(id),
        customer_id VARCHAR NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        downloaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
        metadata JSONB
      );
    `);

    // Create indexes for digital_product
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_digital_product_product 
        ON digital_product(product_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_digital_product_type 
        ON digital_product(type);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_digital_product_tier 
        ON digital_product(required_tier);
    `);

    // Create indexes for digital_file
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_digital_file_product 
        ON digital_file(digital_product_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_digital_file_storage 
        ON digital_file(storage_key);
    `);

    // Create indexes for digital_purchase
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_purchase_customer 
        ON digital_purchase(customer_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_purchase_product 
        ON digital_purchase(digital_product_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_purchase_order 
        ON digital_purchase(order_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_purchase_status 
        ON digital_purchase(status);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_purchase_expires 
        ON digital_purchase(expires_at);
    `);

    // Create indexes for download_log
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_log_purchase 
        ON download_log(digital_purchase_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_log_file 
        ON download_log(digital_file_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_log_customer 
        ON download_log(customer_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_log_downloaded 
        ON download_log(downloaded_at);
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS download_log CASCADE;');
    this.addSql('DROP TABLE IF EXISTS digital_purchase CASCADE;');
    this.addSql('DROP TABLE IF EXISTS digital_file CASCADE;');
    this.addSql('DROP TABLE IF EXISTS digital_product CASCADE;');
  }
}
