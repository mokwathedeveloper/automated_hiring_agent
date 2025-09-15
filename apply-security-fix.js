#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 CRITICAL SECURITY FIX: User Data Isolation');
console.log('='.repeat(50));

// Read the .env file to get Supabase project URL
let supabaseUrl = '';
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    if (urlMatch) {
      supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
    }
  }
} catch (error) {
  console.error('Error reading .env file:', error.message);
}

// Extract project ID from URL
let projectId = '';
if (supabaseUrl) {
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match) {
    projectId = match[1];
  }
}

console.log('🚨 SECURITY ISSUE DETECTED:');
console.log('   Users can currently see other users\' candidates!');
console.log('');
console.log('📋 WHAT THIS FIX DOES:');
console.log('   ✅ Adds user_id column to candidates table');
console.log('   ✅ Creates secure Row Level Security (RLS) policies');
console.log('   ✅ Ensures each user only sees their own data');
console.log('   ✅ Updates API to use proper authentication');
console.log('');

if (projectId) {
  console.log('🎯 APPLY THE FIX:');
  console.log('   1. Opening Supabase Dashboard...');
  console.log('   2. Go to SQL Editor');
  console.log('   3. Copy and paste the migration SQL');
  console.log('   4. Click "Run" to apply the fix');
  console.log('');
  
  const dashboardUrl = `https://supabase.com/dashboard/project/${projectId}`;
  console.log(`🌐 Dashboard URL: ${dashboardUrl}`);
  
  // Try to open the browser
  const command = process.platform === 'darwin' ? 'open' : 
                 process.platform === 'win32' ? 'start' : 'xdg-open';
  
  exec(`${command} "${dashboardUrl}"`, (error) => {
    if (error) {
      console.log('   (Could not auto-open browser - please open manually)');
    } else {
      console.log('   ✅ Browser opened automatically');
    }
  });
} else {
  console.log('⚠️  Could not detect Supabase project ID from .env file');
  console.log('   Please open your Supabase dashboard manually');
}

console.log('');
console.log('📄 MIGRATION SQL TO COPY:');
console.log('-'.repeat(50));

// Read and display the migration SQL
try {
  const sqlContent = fs.readFileSync(path.join(__dirname, 'fix-user-isolation.sql'), 'utf8');
  console.log(sqlContent);
} catch (error) {
  console.error('Error reading migration file:', error.message);
}

console.log('-'.repeat(50));
console.log('');
console.log('⚡ AFTER APPLYING THE MIGRATION:');
console.log('   Run: npm run build');
console.log('   Then: npm run dev');
console.log('');
console.log('🔐 RESULT: Each user will only see their own candidates!');
