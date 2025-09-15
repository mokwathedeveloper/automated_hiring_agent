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

async function executeMigration() {
  console.log('🚀 Executing database migration...');
  
  // Load environment variables
  const envVars = loadEnvFile();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to Supabase...');
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test connection
    console.log('🔍 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('candidates')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      process.exit(1);
    }
    
    console.log('✅ Database connection successful');
    
    // Try to execute each migration step individually using raw SQL
    console.log('📝 Applying migration steps...');
    
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
        name: 'Create analysis_score index',
        sql: 'CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);'
      }
    ];
    
    // Try using the sql method if available
    for (const step of migrationSteps) {
      console.log(`⏳ ${step.name}...`);
      
      try {
        // Try using the sql method
        const { data, error } = await supabase.sql`${step.sql}`;
        
        if (error) {
          console.log(`⚠️  ${step.name} failed with sql method: ${error.message}`);
          continue;
        }
        
        console.log(`✅ ${step.name} completed successfully`);
      } catch (err) {
        console.log(`⚠️  ${step.name} - sql method not available`);
        continue;
      }
    }
    
    // Verify the migration by checking if columns exist
    console.log('🔍 Verifying migration...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('candidates')
      .select('analysis_score, analysis_data, last_analyzed')
      .limit(1);
    
    if (verifyError) {
      console.log('⚠️  Migration verification failed - columns may not exist yet');
      console.log('📋 Please apply the migration manually via Supabase Dashboard:');
      console.log('');
      console.log('1. Go to: https://supabase.com/dashboard/project/sswrwfkrdauseeahfjsg');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the following SQL:');
      console.log('');
      migrationSteps.forEach(step => {
        console.log(step.sql);
      });
      console.log('');
      console.log('4. Click "Run" to execute the migration');
    } else {
      console.log('✅ Migration completed successfully!');
      console.log('📊 Analysis columns are now available in the candidates table');
      console.log('🎉 You can now run "npm run build" to test the application!');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.log('');
    console.log('📋 Please apply the migration manually via Supabase Dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/sswrwfkrdauseeahfjsg');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the migration SQL from migration.sql file');
    console.log('4. Click "Run" to execute the migration');
  }
}

// Run the migration
executeMigration();
