#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Migration Helper for Supabase');
console.log('================================');

// Load environment variables
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

const envVars = loadEnvFile();
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env file');
  process.exit(1);
}

// Extract project ID from URL
const projectId = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

console.log('📍 Your Supabase Project:', projectId);
console.log('🔗 Dashboard URL: https://supabase.com/dashboard/project/' + projectId);
console.log('');

// Create the migration SQL
const migrationSQL = `-- Add analysis columns to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS analysis_score INTEGER CHECK (analysis_score >= 0 AND analysis_score <= 100),
ADD COLUMN IF NOT EXISTS analysis_data JSONB,
ADD COLUMN IF NOT EXISTS last_analyzed TIMESTAMPTZ;

-- Add index for faster sorting by score
CREATE INDEX IF NOT EXISTS idx_candidates_analysis_score ON public.candidates(analysis_score DESC);

-- Add comments for clarity
COMMENT ON COLUMN public.candidates.analysis_score IS 'Overall candidate analysis score (0-100)';
COMMENT ON COLUMN public.candidates.analysis_data IS 'Detailed analysis results including strengths, weaknesses, and recommendations';
COMMENT ON COLUMN public.candidates.last_analyzed IS 'Timestamp of last analysis performed';`;

// Save the SQL to a file for easy copying
fs.writeFileSync('migration-ready.sql', migrationSQL);

console.log('📝 Migration SQL saved to: migration-ready.sql');
console.log('');
console.log('🎯 NEXT STEPS:');
console.log('1. Open your Supabase dashboard: https://supabase.com/dashboard/project/' + projectId);
console.log('2. Navigate to "SQL Editor" in the left sidebar');
console.log('3. Copy the SQL below and paste it into the editor:');
console.log('');
console.log('📋 MIGRATION SQL (copy this):');
console.log('=====================================');
console.log(migrationSQL);
console.log('=====================================');
console.log('');
console.log('4. Click "Run" to execute the migration');
console.log('5. After successful execution, run: npm run build');
console.log('');
console.log('✨ This will add the missing analysis columns to your candidates table!');

// Try to open the browser automatically
const { exec } = require('child_process');
const dashboardUrl = `https://supabase.com/dashboard/project/${projectId}`;

console.log('');
console.log('🌐 Attempting to open Supabase dashboard in browser...');

// Try different browser commands based on the system
const browserCommands = [
  `xdg-open "${dashboardUrl}"`,  // Linux
  `open "${dashboardUrl}"`,      // macOS
  `start "${dashboardUrl}"`      // Windows
];

let browserOpened = false;

for (const command of browserCommands) {
  try {
    exec(command, (error) => {
      if (!error && !browserOpened) {
        console.log('✅ Browser opened successfully!');
        browserOpened = true;
      }
    });
    break;
  } catch (err) {
    // Try next command
  }
}

if (!browserOpened) {
  console.log('⚠️  Could not open browser automatically.');
  console.log('📋 Please manually open: ' + dashboardUrl);
}
