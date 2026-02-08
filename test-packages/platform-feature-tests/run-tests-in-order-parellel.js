// run-tests-in-parallel.js
const { spawn } = require('child_process');
const path = require('path');

// ✅ Put your tags here
const tags = [
  '@onboarded',
  '@S78-granted',
  '@S78-nodecision',
  '@S78-refused',
  '@S78-appeal-validation-1',
  '@S78-appeal-validation-2',
  '@HAS-granted',
  '@HAS-nodecision',
  '@HAS-refused',
  '@HAS-validation-1',
  '@HAS-validation-2',
  '@HAS-validation-3',
  '@HAS-validation-4',
  '@HAS-validation-5',
  '@S20-granted',
  '@S20-nodecision',
  '@S20-refused',
  '@appealant-decided-appeals'
  // '@HAS-LPAQ-Validation-1',
  // '@HAS-LPAQ-Validation-2',
  // '@HAS-LPAQ-Submission',
  // '@S78-LPAQ-Validation-1',
  // '@S78-LPAQ-Validation-2',
  // '@S78-LPAQ-Submission',
  // // '@S20-LPAQ-Validation-1',
  // // '@S20-LPAQ-Validation-2',
  // '@S20-LPAQ-Submission',
  // '@S78-LPA-statement-Validation',
  // '@S78-LPA-statement-Submission',
  // '@S20-LPA-statement-Submission',
  // '@S78-LPA-Final-Comment-Validation',
  // '@S78-LPA-Final-Comment-Submission',
  // '@S20-LPA-Final-Comment-Submission',
  // // '@S78-LPA-POE-Validation',
  // // '@S78-LPA-POE-Submission',
  // // '@S20-LPA-POE-Submission',
  // '@LPA-decided-appeals',
  // // '@S78-appellant-statement-Validation',
  // // '@S78-appellant-statement-Submission',
  // '@S78-appellant-Final-Comment-Validation',
  // '@S78-appellant-Final-Comment-Submission',
  // // '@S78-appellant-POE-Validation',
  // // '@S78-appellant-POE-Submission',
  // // '@S78-RULE6-statement-Validation',
  // // '@S78-RULE6-statement-Submission',
  // // '@S78-RULE6-POE-Validation',
  // // '@S78-RULE6-POE-Submission',
  // '@IP-Comments-Validation',
  // '@IP-Comments-Submission'
  // add/remove as needed
];

// how many Cypress processes at once (tune to your CPU/RAM)
const MAX_CONCURRENCY = Math.min(3, tags.length);

// simple sanitizer for folder names
const sanitize = s => s.replace(/[^a-zA-Z0-9-_]/g, '_');

function runTag(tag) {
  return new Promise((resolve) => {
    const name = sanitize(tag);
    const outBase = path.join('artifacts', name);

    const args = [
  'cypress','run',
  '--env', `grepTags=${tag},grepFilterSpecs=true`,
  '--reporter','cypress-mochawesome-reporter',
  '--reporter-options',
    `reportDir=${outBase}/reports,charts=true,overwrite=false,html=true,json=true,embeddedScreenshots=true,inlineAssets=true`,
  '--config', `videosFolder=${outBase}/videos,screenshotsFolder=${outBase}/screenshots,screenshotOnRunFailure=true`,
  '--browser','chrome','--headless'
];

    console.log(`\n▶︎ Starting ${tag} → ${outBase}`);

    const proc = spawn('npx', args, { stdio: 'inherit', shell: true });

    proc.on('close', (code) => {
      if (code !== 0) {
        console.error(`✗ ${tag} failed (exit ${code})`);
      } else {
        console.log(`✓ ${tag} passed`);
      }
      resolve({ tag, code });
    });
  });
}

// tiny concurrency pool
async function runAll() {
  const queue = tags.slice();
  const failures = [];
  const workers = Array.from({ length: MAX_CONCURRENCY }, async () => {
    while (queue.length) {
      const tag = queue.shift();
      const result = await runTag(tag);
      if (result.code !== 0) failures.push(result);
    }
  });

  await Promise.all(workers);

  if (failures.length) {
    console.error('\n==== Failed tags ====');
    for (const f of failures) console.error(`${f.tag} (exit ${f.code})`);
    process.exit(1);
  }
  console.log('\nAll tag groups finished 🎉');
}

runAll().catch((e) => {
  console.error(e);
  process.exit(1);
});