#!/usr/bin/env node

/**
 * Vortex Protocol Lighthouse Audit Script
 * Checks performance, accessibility, best practices, SEO
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const FRONTEND_URL = 'http://localhost:3000';
const OUTPUT_DIR = join(__dirname, '..', 'lighthouse-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Run Lighthouse audit
function runLighthouse() {
  console.log('🚀 Running Lighthouse audit...');
  
  const lighthouse = spawn('bunx', [
    'lighthouse',
    FRONTEND_URL,
    '--output=json',
    '--output=html',
    '--output-path=' + join(OUTPUT_DIR, 'report'),
    '--chrome-flags="--headless --window-size=1920,1080"',
    '--quiet',
    '--view'
  ], {
    stdio: 'inherit'
  });

  lighthouse.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Lighthouse audit completed!');
      
      // Read and display results
      try {
        const reportPath = join(OUTPUT_DIR, 'report.json');
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          
          console.log('\n📊 Lighthouse Scores:');
          console.log(`Performance: ${report.lhr.categories.performance.score * 100 | 0}`);
          console.log(`Accessibility: ${report.lhr.categories.accessibility.score * 100 | 0}`);
          console.log(`Best Practices: ${report.lhr.categories['best-practices'].score * 100 | 0}`);
          console.log(`SEO: ${report.lhr.categories.seo.score * 100 | 0}`);
          console.log(`PWA: ${report.lhr.categories.pwa.score * 100 | 0}`);
          
          // Check if scores meet targets
          const performanceScore = report.lhr.categories.performance.score * 100;
          const accessibilityScore = report.lhr.categories.accessibility.score * 100;
          const bestPracticesScore = report.lhr.categories['best-practices'].score * 100;
          const seoScore = report.lhr.categories.seo.score * 100;
          
          console.log('\n🎯 Target Scores (95+):');
          console.log(`Performance: ${performanceScore >= 95 ? '✅' : '❌'} ${performanceScore}`);
          console.log(`Accessibility: ${accessibilityScore >= 95 ? '✅' : '❌'} ${accessibilityScore}`);
          console.log(`Best Practices: ${bestPracticesScore >= 95 ? '✅' : '❌'} ${bestPracticesScore}`);
          console.log(`SEO: ${seoScore >= 95 ? '✅' : '❌'} ${seoScore}`);
          
          const allPassed = performanceScore >= 95 && 
                           accessibilityScore >= 95 && 
                           bestPracticesScore >= 95 && 
                           seoScore >= 95;
          
          if (allPassed) {
            console.log('\n🎉 All Lighthouse scores meet target (95+)!');
          } else {
            console.log('\n⚠️  Some scores below target (95+)');
          }
          
          console.log(`\n📁 Full report: ${join(OUTPUT_DIR, 'report.html')}`);
        }
      } catch (error) {
        console.error('Error reading report:', error);
      }
    } else {
      console.log('❌ Lighthouse audit failed');
    }
  });
}

// Check if frontend is running
function checkFrontend() {
  return new Promise((resolve, reject) => {
    const req = http.request(FRONTEND_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🔍 Checking if frontend is running...');
  
  const isRunning = await checkFrontend();
  
  if (!isRunning) {
    console.log('❌ Frontend not running. Please start it with:');
    console.log('   cd packages/frontend && bun run dev');
    process.exit(1);
  }
  
  console.log('✅ Frontend is running');
  runLighthouse();
}

// Run if called directly
main().catch(console.error);
