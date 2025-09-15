#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
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

function makeHttpsRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function runDirectMigration() {
  console.log('🚀 Running direct migration via Supabase REST API...');
  
  const envVars = loadEnvFile();
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to:', supabaseUrl);
  
  // Migration SQL commands
  const migrationCommands = [
    'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100);',
    'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_data JSONB;',
    'ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;',
    'CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);'
  ];
  
  console.log('📝 Attempting to execute migration commands...');
  
  for (let i = 0; i < migrationCommands.length; i++) {
    const command = migrationCommands[i];
    const stepName = [
      'Add analysis_score column',
      'Add analysis_data column', 
      'Add last_analyzed column',
      'Create analysis_score index'
    ][i];
    
    console.log(`⏳ ${stepName}...`);
    
    try {
      // Try using the sql endpoint
      const apiUrl = `${supabaseUrl}/rest/v1/rpc/exec_sql`;
      const requestData = JSON.stringify({ sql: command });
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData),
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        }
      };
      
      const response = await makeHttpsRequest(apiUrl, options, requestData);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log(`✅ ${stepName} - completed`);
      } else {
        console.log(`⚠️  ${stepName} - API response: ${response.statusCode}`);
      }
      
    } catch (error) {
      console.log(`⚠️  ${stepName} - error: ${error.message}`);
    }
  }
  
  console.log('');
  console.log('🔍 Testing if migration was successful...');
  
  // Test if the migration worked by trying to query the new columns
  try {
    const testUrl = `${supabaseUrl}/rest/v1/candidates?select=analysis_score,analysis_data,last_analyzed&limit=1`;
    
    const testOptions = {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    };
    
    const testResponse = await makeHttpsRequest(testUrl, testOptions);
    
    if (testResponse.statusCode === 200) {
      console.log('✅ Migration successful! Analysis columns are now available.');
      console.log('🎉 You can now run "npm run build" to test the application!');
    } else {
      console.log('⚠️  Migration verification failed. Please apply manually.');
      showManualInstructions();
    }
    
  } catch (error) {
    console.log('⚠️  Could not verify migration. Please apply manually.');
    showManualInstructions();
  }
}

function showManualInstructions() {
  console.log('');
  console.log('📋 Manual migration instructions:');
  console.log('1. Go to: https://supabase.com/dashboard/project/sswrwfkrdauseeahfjsg');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste this SQL:');
  console.log('');
  console.log('ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100);');
  console.log('ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS analysis_data JSONB;');
  console.log('ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;');
  console.log('CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);');
  console.log('');
  console.log('4. Click "Run" to execute');
}

// Run the migration
runDirectMigration().catch(console.error);
