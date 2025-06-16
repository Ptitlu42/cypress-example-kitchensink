const fs = require('fs');
const path = require('path');

function generateCucumberReport() {
  const cucumberJsonDir = 'cypress/cucumber-json';
  const reportsDir = 'cypress/reports';
  
  console.log('Starting Cucumber report generation...');
  console.log('Looking for JSON files in:', cucumberJsonDir);
  
  if (!fs.existsSync(cucumberJsonDir)) {
    console.log('Cucumber JSON directory does not exist, creating placeholder report');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const placeholderHtml = generateHTML([]);
    fs.writeFileSync(path.join(reportsDir, 'cucumber-report.html'), placeholderHtml);
    console.log('Placeholder Cucumber HTML report generated');
    return;
  }

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const jsonFiles = fs.readdirSync(cucumberJsonDir).filter(file => file.endsWith('.cucumber.json') || file.endsWith('.json'));
  console.log('Found JSON files:', jsonFiles);
  
  if (jsonFiles.length === 0) {
    console.log('No Cucumber JSON files found, creating placeholder report');
    const placeholderHtml = generateHTML([]);
    fs.writeFileSync(path.join(reportsDir, 'cucumber-report.html'), placeholderHtml);
    console.log('Placeholder Cucumber HTML report generated');
    return;
  }

  let allFeatures = [];
  
  jsonFiles.forEach(file => {
    const content = fs.readFileSync(path.join(cucumberJsonDir, file), 'utf8');
    console.log(`Reading file: ${file}, size: ${content.length} bytes`);
    try {
      const features = JSON.parse(content);
      if (Array.isArray(features)) {
        allFeatures = allFeatures.concat(features);
      } else {
        allFeatures.push(features);
      }
      console.log(`Parsed ${features.length} features from ${file}`);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  });

  console.log(`Total features found: ${allFeatures.length}`);
  const html = generateHTML(allFeatures);
  fs.writeFileSync(path.join(reportsDir, 'cucumber-report.html'), html);
  console.log('Cucumber HTML report generated: cypress/reports/cucumber-report.html');
}

function generateHTML(features) {
  if (!features || features.length === 0) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Cucumber Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat { text-align: center; padding: 20px; border-radius: 10px; color: white; font-weight: bold; }
        .stat h3 { font-size: 2em; margin-bottom: 5px; }
        .stat.total { background: #3498db; }
        .stat.passed { background: #2ecc71; }
        .stat.failed { background: #e74c3c; }
        .no-data { text-align: center; color: #6c757d; padding: 40px; font-style: italic; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="stats">
            <div class="stat total">
                <h3>0</h3>
                <p>Total Scenarios</p>
            </div>
            <div class="stat passed">
                <h3>0</h3>
                <p>Passed</p>
            </div>
            <div class="stat failed">
                <h3>0</h3>
                <p>Failed</p>
            </div>
        </div>
        
        <div class="no-data">
            No Cucumber/Gherkin tests have been executed yet.<br>
            Run your Cucumber tests to see results here.
        </div>
    </div>
</body>
</html>`;
  }

  const totalScenarios = features.reduce((acc, feature) => {
    return acc + (feature.elements ? feature.elements.length : 0);
  }, 0);
  
  const passedScenarios = features.reduce((acc, feature) => {
    if (!feature.elements) return acc;
    return acc + feature.elements.filter(scenario => 
      scenario.steps && scenario.steps.every(step => step.result && step.result.status === 'passed')
    ).length;
  }, 0);
  
  const failedScenarios = totalScenarios - passedScenarios;

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Cucumber Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat { text-align: center; padding: 20px; border-radius: 10px; color: white; font-weight: bold; }
        .stat h3 { font-size: 2em; margin-bottom: 5px; }
        .stat.total { background: #3498db; }
        .stat.passed { background: #2ecc71; }
        .stat.failed { background: #e74c3c; }
        .feature { margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .feature-header { background: #ecf0f1; padding: 15px; font-weight: bold; color: #2c3e50; }
        .scenario { padding: 15px; border-bottom: 1px solid #eee; }
        .scenario:last-child { border-bottom: none; }
        .scenario.passed { background: #d5f4e6; border-left: 4px solid #2ecc71; }
        .scenario.failed { background: #fdf2f2; border-left: 4px solid #e74c3c; }
        .scenario h4 { margin-bottom: 10px; color: #2c3e50; }
        .steps { margin: 10px 0; }
        .step { padding: 8px 15px; margin: 3px 0; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9em; }
        .step.passed { background: #c8e6c9; border-left: 3px solid #2ecc71; }
        .step.failed { background: #ffcdd2; border-left: 3px solid #e74c3c; }
        .step.skipped { background: #fff3cd; border-left: 3px solid #f39c12; }
        .step-keyword { font-weight: bold; color: #2c3e50; }
        .error-message { color: #e74c3c; margin-top: 5px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="stats">
            <div class="stat total">
                <h3>${totalScenarios}</h3>
                <p>Total Scenarios</p>
            </div>
            <div class="stat passed">
                <h3>${passedScenarios}</h3>
                <p>Passed</p>
            </div>
            <div class="stat failed">
                <h3>${failedScenarios}</h3>
                <p>Failed</p>
            </div>
        </div>
        
        ${features.map(generateFeatureHTML).join('')}
    </div>
</body>
</html>`;
}

function generateFeatureHTML(feature) {
  return `
    <div class="feature">
        <div class="feature-header">
            <h3>${feature.name}</h3>
            ${feature.description ? `<p>${feature.description}</p>` : ''}
        </div>
        ${feature.elements.map(generateScenarioHTML).join('')}
    </div>`;
}

function generateScenarioHTML(scenario) {
  const isPassed = scenario.steps.every(step => step.result.status === 'passed');
  const statusClass = isPassed ? 'passed' : 'failed';
  
  return `
    <div class="scenario ${statusClass}">
        <h4>${scenario.name}</h4>
        <div class="steps">
            ${scenario.steps.map(generateStepHTML).join('')}
        </div>
    </div>`;
}

function generateStepHTML(step) {
  return `
    <div class="step ${step.result.status}">
        <span class="step-keyword">${step.keyword}</span> ${step.name}
        ${step.result.error_message ? `<div class="error-message">${step.result.error_message}</div>` : ''}
    </div>`;
}

if (require.main === module) {
  generateCucumberReport();
}

module.exports = { generateCucumberReport }; 