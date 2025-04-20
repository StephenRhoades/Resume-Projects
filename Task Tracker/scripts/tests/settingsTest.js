// settingsTest.js
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM fully loaded and parsed: settingsTest");
    const errors = [];

    test(testThemeApplied, errors);
    test(testSettingsSectionExists, errors);

    errors.forEach(e => console.error(e));
});

function testThemeApplied() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';
    assert(body.classList.contains(`${savedTheme}-theme`), "Body should have the saved theme class");
    console.log("Test Theme Applied: Passed");
}

function testSettingsSectionExists() {
    const settingsSection = document.getElementById('settings-section');
    assert(settingsSection !== null, "'settings-section' should exist");
    console.log("Test Settings Section Exists: Passed");
}


// Simple test runner
function test(fn, errors) {
    try {
        fn();
    } catch (e) {
        console.log(fn.name + ": Failed");
        errors.push(e);
    }
}

// Simple assert
function assert(condition, message) {
    if (!condition) throw new Error(message);
}
