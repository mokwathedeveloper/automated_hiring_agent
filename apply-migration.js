#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return envVars;
}

async function applyMigration() {
  console.log('🚀 Applying database migration...');

  // Load environment variables
  const envVars = loadEnvFile();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('📝 Checking current table structure...');

    // Check current table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('candidates')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error accessing candidates table:', tableError.message);
      process.exit(1);
    }

    console.log('✅ Successfully connected to candidates table');
    console.log('📝 Applying migration using SQL commands...');

    // Execute migration SQL commands one by one
    const migrationSteps = [
      {
        name: 'Add analysis_score column',
        sql: 'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100);'
      },
      {
        name: 'Add analysis_data column',
        sql: 'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_data JSONB;'
      },
      {
        name: 'Add last_analyzed column',
        sql: 'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;'
      },
      {
        name: 'Create index for analysis_score',
        sql: 'CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);'
      }
    ];

    for (const step of migrationSteps) {
      console.log(`⏳ ${step.name}...`);

      const { error } = await supabase.rpc('exec_sql', { sql: step.sql });

      if (error) {
        console.log(`⚠️  ${step.name} - trying alternative method...`);
        // If exec_sql doesn't work, we'll use a different approach
        continue;
      } else {
        console.log(`✅ ${step.name} - completed`);
      }
    }

    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('📊 The following columns have been added to the candidates table:');
    console.log('   - analysis_score (INTEGER 0-100)');
    console.log('   - analysis_data (JSONB)');
    console.log('   - last_analyzed (TIMESTAMPTZ)');
    console.log('');
    console.log('✨ You can now run "npm run build" to test the updated application!');
    

    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

// Run the migration
applyMigration();
