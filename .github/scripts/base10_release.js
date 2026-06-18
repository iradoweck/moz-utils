const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STATE_FILE = '.base10-state.json';

// Helper to run bash commands
function runCmd(cmd) {
    try {
        return execSync(cmd, { stdio: 'pipe' }).toString().trim();
    } catch (err) {
        console.error(`Error running command: ${cmd}`, err.stderr.toString());
        process.exit(1);
    }
}

// Base 10 bump logic
function bumpBase10(versionStr) {
    let [major, minor, patch] = versionStr.split('.').map(Number);
    patch += 1;
    if (patch >= 10) {
        patch = 0;
        minor += 1;
        if (minor >= 10) {
            minor = 0;
            major += 1;
        }
    }
    return `${major}.${minor}.${patch}`;
}

// Update file contents
function updateFile(filePath, regex, replacement) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    const newContent = content.replace(regex, replacement);
    fs.writeFileSync(filePath, newContent, 'utf-8');
}

function main() {
    console.log("Starting Dogmatic Base 10 Release Engine...");
    
    // Read state
    if (!fs.existsSync(STATE_FILE)) {
        console.error("State file not found!");
        process.exit(1);
    }
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    
    // Get changed files from the last commit (merge commit)
    let changedFiles = [];
    try {
        changedFiles = runCmd('git diff --name-only HEAD~1 HEAD').split('\n').filter(f => f);
    } catch(e) {
        console.log("No previous commit found or diff failed.");
        process.exit(0);
    }

    console.log("Changed files:", changedFiles);

    let packagesChanged = false;
    let websiteChanged = false;

    for (const file of changedFiles) {
        if (file.startsWith('website/')) {
            websiteChanged = true;
        } else if (
            file.startsWith('ts/') ||
            file.startsWith('php/') ||
            file.startsWith('python/') ||
            file.startsWith('dart/') ||
            file.startsWith('kotlin/')
        ) {
            packagesChanged = true;
        }
    }

    if (!packagesChanged && !websiteChanged) {
        console.log("No relevant files changed for release.");
        process.exit(0);
    }

    let pointsToAdd = 0;
    
    // Process Packages
    if (packagesChanged) {
        state.versions.packages = bumpBase10(state.versions.packages);
        console.log(`Bumping packages to ${state.versions.packages}`);
        
        updateFile('ts/package.json', /"version":\s*"[^"]+"/, `"version": "${state.versions.packages}"`);
        updateFile('php/composer.json', /"version":\s*"[^"]+"/, `"version": "${state.versions.packages}"`);
        updateFile('python/pyproject.toml', /version\s*=\s*"[^"]+"/, `version = "${state.versions.packages}"`);
        updateFile('dart/pubspec.yaml', /^version:\s*[^\s]+/m, `version: ${state.versions.packages}`);
        updateFile('kotlin/build.gradle.kts', /version\s*=\s*"[^"]+"/, `version = "${state.versions.packages}"`);
        pointsToAdd += 1;
    }

    // Process Website
    if (websiteChanged) {
        state.versions.website = bumpBase10(state.versions.website);
        console.log(`Bumping website to ${state.versions.website}`);
        updateFile('website/package.json', /"version":\s*"[^"]+"/, `"version": "${state.versions.website}"`);
        pointsToAdd += 1;
    }

    // Apply Root Dogma
    state.accumulated_points += pointsToAdd;
    let rootBumped = false;
    
    if (state.accumulated_points >= 2) {
        state.accumulated_points -= 2;
        state.versions.root = bumpBase10(state.versions.root);
        console.log(`Bumping root package to ${state.versions.root}`);
        updateFile('package.json', /"version":\s*"[^"]+"/, `"version": "${state.versions.root}"`);
        rootBumped = true;
    }

    // Save State
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');

    // Generate Changelog (Simple append)
    const commitMsg = runCmd('git log -1 --pretty=%B').trim().split('\n')[0];
    const date = new Date().toISOString().split('T')[0];
    let clEntry = `\n## [${rootBumped ? state.versions.root : state.versions.root + '-draft'}] - ${date}\n`;
    clEntry += `- ${commitMsg}\n`;
    
    const clPaths = ['CHANGELOG.md'];
    if (packagesChanged) {
        clPaths.push('ts/CHANGELOG.md', 'php/CHANGELOG.md', 'python/CHANGELOG.md', 'dart/CHANGELOG.md', 'kotlin/CHANGELOG.md');
    }
    if (websiteChanged) {
        clPaths.push('website/CHANGELOG.md');
    }

    for (const p of clPaths) {
        if (!fs.existsSync(p)) fs.writeFileSync(p, '# Changelog\n');
        const currentCl = fs.readFileSync(p, 'utf8');
        const newCl = currentCl.replace('# Changelog\n', '# Changelog\n' + clEntry);
        fs.writeFileSync(p, newCl, 'utf8');
    }

    console.log("Base 10 Release Engine completed successfully.");
}

main();
