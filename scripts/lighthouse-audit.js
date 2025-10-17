const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: ['uses-http2'],
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  }
}

const urls = [
  { name: 'Homepage', url: 'http://localhost:3002/' },
  { name: 'About', url: 'http://localhost:3002/about' },
  { name: 'Services', url: 'http://localhost:3002/services' },
  { name: 'Contact', url: 'http://localhost:3002/contact' },
  { name: 'Blog', url: 'http://localhost:3002/blog' },
]

const thresholds = {
  performance: 85,
  accessibility: 95,
  'best-practices': 90,
  seo: 95
}

async function runLighthouseAudit(url, name) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port
  }

  try {
    const runnerResult = await lighthouse(url, options, config)
    await chrome.kill()

    if (!runnerResult) {
      throw new Error('Lighthouse audit failed')
    }

    const { lhr } = runnerResult
    const categories = lhr.categories

    const results = {
      url,
      name,
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        'best-practices': Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100)
      },
      metrics: {
        'first-contentful-paint': lhr.audits['first-contentful-paint']?.displayValue,
        'largest-contentful-paint': lhr.audits['largest-contentful-paint']?.displayValue,
        'cumulative-layout-shift': lhr.audits['cumulative-layout-shift']?.displayValue,
        'total-blocking-time': lhr.audits['total-blocking-time']?.displayValue,
        'speed-index': lhr.audits['speed-index']?.displayValue
      },
      opportunities: lhr.audits['opportunities'] ? Object.keys(lhr.audits)
        .filter(key => lhr.audits[key].details?.type === 'opportunity' && lhr.audits[key].score < 1)
        .map(key => ({
          id: key,
          title: lhr.audits[key].title,
          description: lhr.audits[key].description,
          displayValue: lhr.audits[key].displayValue
        })) : []
    }

    // Save individual report
    const reportDir = path.join(__dirname, '../lighthouse-reports')
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }

    const reportPath = path.join(reportDir, `${name.toLowerCase().replace(/\s+/g, '-')}-report.json`)
    fs.writeFileSync(reportPath, JSON.stringify(runnerResult, null, 2))

    return results
  } catch (error) {
    await chrome.kill()
    throw error
  }
}

async function runAllAudits() {
  console.log('🚀 Starting Lighthouse audits...\n')
  
  const allResults = []
  let passed = true

  for (const { name, url } of urls) {
    try {
      console.log(`🔍 Auditing ${name} (${url})...`)
      const result = await runLighthouseAudit(url, name)
      allResults.push(result)

      // Check thresholds
      const failedCategories = []
      for (const [category, threshold] of Object.entries(thresholds)) {
        const score = result.scores[category]
        if (score < threshold) {
          failedCategories.push(`${category}: ${score} < ${threshold}`)
          passed = false
        }
      }

      // Display results
      console.log(`  📊 Scores:`)
      console.log(`    Performance: ${result.scores.performance}`)
      console.log(`    Accessibility: ${result.scores.accessibility}`)
      console.log(`    Best Practices: ${result.scores['best-practices']}`)
      console.log(`    SEO: ${result.scores.seo}`)

      if (failedCategories.length > 0) {
        console.log(`  ❌ Failed thresholds: ${failedCategories.join(', ')}`)
      } else {
        console.log(`  ✅ All thresholds passed`)
      }

      if (result.opportunities.length > 0) {
        console.log(`  💡 Top opportunities:`)
        result.opportunities.slice(0, 3).forEach(opp => {
          console.log(`    - ${opp.title} (${opp.displayValue || 'N/A'})`)
        })
      }

      console.log()
    } catch (error) {
      console.error(`❌ Failed to audit ${name}: ${error.message}`)
      passed = false
    }
  }

  // Generate summary report
  const summaryPath = path.join(__dirname, '../lighthouse-reports/summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    passed,
    thresholds,
    results: allResults
  }, null, 2))

  // Display summary
  console.log('📋 Summary:')
  console.log(`  Total pages audited: ${allResults.length}`)
  console.log(`  All thresholds passed: ${passed ? '✅ Yes' : '❌ No'}`)
  
  if (allResults.length > 0) {
    const avgScores = {
      performance: Math.round(allResults.reduce((sum, r) => sum + r.scores.performance, 0) / allResults.length),
      accessibility: Math.round(allResults.reduce((sum, r) => sum + r.scores.accessibility, 0) / allResults.length),
      'best-practices': Math.round(allResults.reduce((sum, r) => sum + r.scores['best-practices'], 0) / allResults.length),
      seo: Math.round(allResults.reduce((sum, r) => sum + r.scores.seo, 0) / allResults.length)
    }
    
    console.log(`  Average scores:`)
    console.log(`    Performance: ${avgScores.performance}`)
    console.log(`    Accessibility: ${avgScores.accessibility}`)
    console.log(`    Best Practices: ${avgScores['best-practices']}`)
    console.log(`    SEO: ${avgScores.seo}`)
  }

  if (!passed) {
    console.log('\n❌ Some audits failed to meet the required thresholds.')
    process.exit(1)
  } else {
    console.log('\n✅ All audits passed!')
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Lighthouse audit interrupted')
  process.exit(1)
})

if (require.main === module) {
  runAllAudits().catch(error => {
    console.error('💥 Audit script failed:', error)
    process.exit(1)
  })
}

module.exports = { runLighthouseAudit, runAllAudits }