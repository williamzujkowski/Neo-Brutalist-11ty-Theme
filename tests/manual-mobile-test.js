const fs = require('fs');
const path = require('path');

// Since we can't run Playwright directly, let's create a manual testing script
// that inspects the built HTML files for mobile issues

const siteDir = path.join(__dirname, '..', '_site');

function findHtmlFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function analyzeHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(siteDir, filePath);

  const issues = [];
  const checks = {
    hasViewport: false,
    hasResponsiveMeta: false,
    hasSocialLinks: false,
    hasNavigation: false,
    hasBackButton: false,
    suspiciousFixedWidths: [],
    missingAltText: [],
    smallFontSizes: []
  };

  // Check for viewport meta tag
  if (content.includes('name="viewport"')) {
    checks.hasViewport = true;
  } else {
    issues.push('Missing viewport meta tag');
  }

  // Check for responsive meta elements
  if (content.includes('width=device-width')) {
    checks.hasResponsiveMeta = true;
  }

  // Check for social links
  if (content.includes('social') || content.includes('github') || content.includes('twitter')) {
    checks.hasSocialLinks = true;
  }

  // Check for navigation
  if (content.includes('<nav') || content.includes('navigation') || content.includes('menu')) {
    checks.hasNavigation = true;
  }

  // Check for back buttons on non-home pages
  if (!relativePath.includes('index.html') || relativePath !== 'index.html') {
    if (content.includes('back') || content.includes('← ') || content.includes('&larr;')) {
      checks.hasBackButton = true;
    } else {
      issues.push('Missing back navigation on non-home page');
    }
  }

  // Check for suspicious fixed widths (basic regex)
  const widthRegex = /width:\s*(\d+)px/g;
  let match;
  while ((match = widthRegex.exec(content)) !== null) {
    const width = parseInt(match[1]);
    if (width > 400) {
      checks.suspiciousFixedWidths.push(width);
    }
  }

  // Check for images without alt text
  const imgRegex = /<img[^>]*>/g;
  const imgMatches = content.match(imgRegex) || [];
  for (const img of imgMatches) {
    if (!img.includes('alt=')) {
      checks.missingAltText.push(img.substring(0, 50) + '...');
    }
  }

  // Check for potentially small font sizes
  const fontSizeRegex = /font-size:\s*(\d+)px/g;
  while ((match = fontSizeRegex.exec(content)) !== null) {
    const size = parseInt(match[1]);
    if (size < 14) {
      checks.smallFontSizes.push(size);
    }
  }

  if (checks.suspiciousFixedWidths.length > 0) {
    issues.push(`Potentially problematic fixed widths: ${checks.suspiciousFixedWidths.join(', ')}px`);
  }

  if (checks.missingAltText.length > 0) {
    issues.push(`${checks.missingAltText.length} images without alt text`);
  }

  if (checks.smallFontSizes.length > 0) {
    issues.push(`Small font sizes detected: ${checks.smallFontSizes.join(', ')}px`);
  }

  return {
    file: relativePath,
    checks,
    issues
  };
}

function generateMobileTestReport() {
  console.log('🔍 Neo-Brutalist Theme - Mobile Readiness Report');
  console.log('=' .repeat(60));

  try {
    const htmlFiles = findHtmlFiles(siteDir);
    const results = htmlFiles.map(analyzeHtmlFile);

    // Summary statistics
    const totalFiles = results.length;
    const filesWithIssues = results.filter(r => r.issues.length > 0).length;
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);

    console.log(`\n📊 SUMMARY`);
    console.log(`Total HTML files analyzed: ${totalFiles}`);
    console.log(`Files with potential issues: ${filesWithIssues}`);
    console.log(`Total issues found: ${totalIssues}`);
    console.log(`Mobile readiness score: ${Math.round((1 - filesWithIssues / totalFiles) * 100)}%`);

    // Detailed results
    console.log(`\n📋 DETAILED ANALYSIS`);
    console.log('-'.repeat(40));

    for (const result of results) {
      console.log(`\n📄 ${result.file}`);

      // Show positive checks
      const positives = [];
      if (result.checks.hasViewport) positives.push('✅ Has viewport meta');
      if (result.checks.hasResponsiveMeta) positives.push('✅ Responsive meta');
      if (result.checks.hasNavigation) positives.push('✅ Has navigation');
      if (result.checks.hasSocialLinks) positives.push('✅ Has social links');
      if (result.checks.hasBackButton && !result.file.includes('index.html')) {
        positives.push('✅ Has back navigation');
      }

      console.log(`   ${positives.join(', ')}`);

      // Show issues
      if (result.issues.length > 0) {
        for (const issue of result.issues) {
          console.log(`   ⚠️  ${issue}`);
        }
      } else {
        console.log('   🎉 No issues detected!');
      }
    }

    // Mobile-specific recommendations
    console.log(`\n📱 MOBILE OPTIMIZATION RECOMMENDATIONS`);
    console.log('-'.repeat(40));

    console.log(`\n1. Touch Targets:`);
    console.log(`   • Ensure all buttons and links are at least 44x44px`);
    console.log(`   • Add padding to social media icons if needed`);
    console.log(`   • Test tap targets on actual mobile devices`);

    console.log(`\n2. Typography:`);
    console.log(`   • Minimum 16px font size for body text on mobile`);
    console.log(`   • Ensure sufficient line height (1.4 minimum)`);
    console.log(`   • Test readability on small screens`);

    console.log(`\n3. Layout:`);
    console.log(`   • Avoid horizontal scrolling`);
    console.log(`   • Use flexible layouts instead of fixed widths`);
    console.log(`   • Test on iPhone SE (375px) and larger devices`);

    console.log(`\n4. Navigation:`);
    console.log(`   • Implement hamburger menu for mobile`);
    console.log(`   • Ensure "Back to Blog" buttons are prominent`);
    console.log(`   • Test navigation flow on touch devices`);

    console.log(`\n5. Performance:`);
    console.log(`   • Optimize images for mobile viewports`);
    console.log(`   • Minimize CSS and JavaScript`);
    console.log(`   • Test loading times on slower connections`);

    // Critical issues summary
    const criticalFiles = results.filter(r =>
      r.issues.some(issue =>
        issue.includes('viewport') ||
        issue.includes('fixed width') ||
        issue.includes('Missing back')
      )
    );

    if (criticalFiles.length > 0) {
      console.log(`\n🚨 CRITICAL MOBILE ISSUES`);
      console.log('-'.repeat(40));
      for (const file of criticalFiles) {
        console.log(`📄 ${file.file}:`);
        const criticalIssues = file.issues.filter(issue =>
          issue.includes('viewport') ||
          issue.includes('fixed width') ||
          issue.includes('Missing back')
        );
        for (const issue of criticalIssues) {
          console.log(`   🔥 ${issue}`);
        }
      }
    }

    console.log(`\n🎯 NEXT STEPS FOR MOBILE OPTIMIZATION`);
    console.log('-'.repeat(40));
    console.log(`1. Fix critical viewport and layout issues`);
    console.log(`2. Test on real mobile devices (iPhone, Android)`);
    console.log(`3. Use browser dev tools mobile simulation`);
    console.log(`4. Run Lighthouse mobile audits`);
    console.log(`5. Test with actual users on mobile devices`);

    console.log(`\n✨ Mobile optimization analysis complete!`);

  } catch (error) {
    console.error('Error analyzing files:', error.message);
  }
}

// Run the analysis
generateMobileTestReport();