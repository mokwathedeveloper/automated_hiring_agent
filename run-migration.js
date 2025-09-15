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

async function runMigration() {
  console.log('🚀 Running database migration...');
  
  // Load environment variables
  const envVars = loadEnvFile();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to Supabase...');
  console.log(`📍 URL: ${supabaseUrl}`);
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test connection first
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
    
    // Check if columns already exist by trying to select them
    console.log('🔍 Checking if migration is needed...');
    const { data: existingData, error: existingError } = await supabase
      .from('candidates')
      .select('analysis_score, analysis_data, last_analyzed')
      .limit(1);
    
    if (!existingError) {
      console.log('✅ Analysis columns already exist!');
      console.log('🎉 Migration not needed. You can run "npm run build" now!');
      return;
    }
    
    console.log('📝 Analysis columns not found. Applying migration...');
    
    // Since we can't execute DDL directly, let's create a simple workaround
    // We'll insert a test record to trigger the migration need
    console.log('');
    console.log('⚠️  Direct DDL execution is not available through the Supabase client.');
    console.log('📋 Please apply the migration manually via Supabase Dashboard:');
    console.log('');
    console.log('1. Go to: https://supabase.com/dashboard/project/sswrwfkrdauseeahfjsg');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the following SQL:');
    console.log('');
    console.log('-- Add analysis columns to candidates table');
    console.log('ALTER TABLE public.candidates');
    console.log('ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100),');
    console.log('ADD COLUMN IF NOT EXISTS analysis_data JSONB,');
    console.log('ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;');
    console.log('');
    console.log('-- Add index for faster sorting by score');
    console.log('CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);');
    console.log('');
    console.log('4. Click "Run" to execute the migration');
    console.log('5. Then run "npm run build" to test the application');
    console.log('');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

// Run the migration
runMigration();
