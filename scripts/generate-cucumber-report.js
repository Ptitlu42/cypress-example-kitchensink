const fs = require('fs');
const path = require('path');

function generateCucumberReport() {
  const cucumberJsonDir = 'cypress/cucumber-json';
  const reportsDir = 'cypress/reports';
  
  if (!fs.existsSync(cucumberJsonDir)) {
    console.log('No Cucumber JSON reports found');
    return;
  }

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const jsonFiles = fs.readdirSync(cucumberJsonDir).filter(file => file.endsWith('.cucumber.json'));
  
  if (jsonFiles.length === 0) {
    console.log('No Cucumber JSON files found');
    return;
  }

  let allFeatures = [];
  
  jsonFiles.forEach(file => {
    const content = fs.readFileSync(path.join(cucumberJsonDir, file), 'utf8');
    try {
      const features = JSON.parse(content);
      allFeatures = allFeatures.concat(features);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
    }
  });

  const html = generateHTML(allFeatures);
  fs.writeFileSync(path.join(reportsDir, 'cucumber-report.html'), html);
  console.log('Cucumber HTML report generated: cypress/reports/cucumber-report.html');
}

function generateHTML(features) {
  const totalScenarios = features.reduce((acc, feature) => acc + feature.elements.length, 0);
  const passedScenarios = features.reduce((acc, feature) => {
    return acc + feature.elements.filter(scenario => 
      scenario.steps.every(step => step.result.status === 'passed')
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
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; padding: 15px; border-radius: 8px; color: white; }
        .stat.total { background: #3498db; }
        .stat.passed { background: #2ecc71; }
        .stat.failed { background: #e74c3c; }
        .feature { margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .feature-header { background: #34495e; color: white; padding: 15px; }
        .scenario { padding: 15px; border-bottom: 1px solid #eee; }
        .scenario:last-child { border-bottom: none; }
        .scenario.passed { background: #d5f4e6; }
        .scenario.failed { background: #fdf2f2; }
        .steps { margin: 10px 0; }
        .step { padding: 5px 10px; margin: 2px 0; border-radius: 4px; font-family: monospace; }
        .step.passed { background: #c8e6c9; }
        .step.failed { background: #ffcdd2; }
        .step.skipped { background: #fff3cd; }
        .timestamp { color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🥒 Cucumber Test Report</h1>
            <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
        </div>
        
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
            <h2>${feature.name}</h2>
            <p>${feature.description || ''}</p>
        </div>
        ${feature.elements.map(generateScenarioHTML).join('')}
    </div>`;
}

function generateScenarioHTML(scenario) {
  const isPassed = scenario.steps.every(step => step.result.status === 'passed');
  const statusClass = isPassed ? 'passed' : 'failed';
  
  return `
    <div class="scenario ${statusClass}">
        <h3>${scenario.name}</h3>
        <div class="steps">
            ${scenario.steps.map(generateStepHTML).join('')}
        </div>
    </div>`;
}

function generateStepHTML(step) {
  return `
    <div class="step ${step.result.status}">
        <strong>${step.keyword}</strong> ${step.name}
        ${step.result.error_message ? `<div style="color: red; margin-top: 5px;">${step.result.error_message}</div>` : ''}
    </div>`;
}

if (require.main === module) {
  generateCucumberReport();
}

module.exports = { generateCucumberReport }; 