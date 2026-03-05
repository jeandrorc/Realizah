import { Migration } from '@mikro-orm/migrations';

export class Migration20260304200000 extends Migration {
  async up(): Promise<void> {
    // Create course table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS course (
        id VARCHAR PRIMARY KEY,
        title VARCHAR NOT NULL,
        slug VARCHAR NOT NULL UNIQUE,
        description TEXT NOT NULL,
        thumbnail VARCHAR,
        instructor_id VARCHAR NOT NULL,
        category VARCHAR(50) NOT NULL,
        level VARCHAR(20) NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        language VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
        required_tier VARCHAR(20) NOT NULL,
        feature_id VARCHAR,
        is_published BOOLEAN NOT NULL DEFAULT false,
        published_at TIMESTAMP,
        enrollment_count INTEGER NOT NULL DEFAULT 0,
        rating DECIMAL(3,2),
        rating_count INTEGER NOT NULL DEFAULT 0,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create course_module table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS course_module (
        id VARCHAR PRIMARY KEY,
        course_id VARCHAR NOT NULL REFERENCES course(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        description TEXT,
        "order" INTEGER NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        is_published BOOLEAN NOT NULL DEFAULT false,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create lesson table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS lesson (
        id VARCHAR PRIMARY KEY,
        module_id VARCHAR NOT NULL REFERENCES course_module(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL,
        content JSONB NOT NULL,
        "order" INTEGER NOT NULL,
        duration INTEGER NOT NULL DEFAULT 0,
        is_preview BOOLEAN NOT NULL DEFAULT false,
        is_published BOOLEAN NOT NULL DEFAULT false,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Create enrollment table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS enrollment (
        id VARCHAR PRIMARY KEY,
        customer_id VARCHAR NOT NULL,
        course_id VARCHAR NOT NULL REFERENCES course(id),
        status VARCHAR(20) NOT NULL,
        enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMP,
        progress INTEGER NOT NULL DEFAULT 0,
        last_accessed_at TIMESTAMP,
        certificate_url VARCHAR,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(customer_id, course_id)
      );
    `);

    // Create lesson_progress table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id VARCHAR PRIMARY KEY,
        enrollment_id VARCHAR NOT NULL REFERENCES enrollment(id) ON DELETE CASCADE,
        lesson_id VARCHAR NOT NULL REFERENCES lesson(id),
        status VARCHAR(20) NOT NULL DEFAULT 'not_started',
        watched_duration INTEGER,
        quiz_score INTEGER,
        quiz_attempts INTEGER NOT NULL DEFAULT 0,
        completed_at TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(enrollment_id, lesson_id)
      );
    `);

    // Create course_review table
    this.addSql(`
      CREATE TABLE IF NOT EXISTS course_review (
        id VARCHAR PRIMARY KEY,
        course_id VARCHAR NOT NULL REFERENCES course(id),
        customer_id VARCHAR NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_published BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(course_id, customer_id)
      );
    `);

    // Create indexes for course
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_course_slug 
        ON course(slug);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_course_category 
        ON course(category);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_course_tier 
        ON course(required_tier);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_course_published 
        ON course(is_published);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_course_instructor 
        ON course(instructor_id);
    `);

    // Create indexes for course_module
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_module_course 
        ON course_module(course_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_module_order 
        ON course_module(course_id, "order");
    `);

    // Create indexes for lesson
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_module 
        ON lesson(module_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_order 
        ON lesson(module_id, "order");
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_lesson_preview 
        ON lesson(is_preview);
    `);

    // Create indexes for enrollment
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_enrollment_customer 
        ON enrollment(customer_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_enrollment_course 
        ON enrollment(course_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_enrollment_status 
        ON enrollment(status);
    `);

    // Create indexes for lesson_progress
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_progress_enrollment 
        ON lesson_progress(enrollment_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_progress_lesson 
        ON lesson_progress(lesson_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_progress_status 
        ON lesson_progress(status);
    `);

    // Create indexes for course_review
    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_review_course 
        ON course_review(course_id);
    `);

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_review_customer 
        ON course_review(customer_id);
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS course_review CASCADE;');
    this.addSql('DROP TABLE IF EXISTS lesson_progress CASCADE;');
    this.addSql('DROP TABLE IF EXISTS enrollment CASCADE;');
    this.addSql('DROP TABLE IF EXISTS lesson CASCADE;');
    this.addSql('DROP TABLE IF EXISTS course_module CASCADE;');
    this.addSql('DROP TABLE IF EXISTS course CASCADE;');
  }
}
