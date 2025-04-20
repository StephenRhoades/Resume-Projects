document.addEventListener('DOMContentLoaded', function() {
    console.log("Running simple console tests for taskPage...");

    function assertTrue(condition, message) {
        if (condition) {
            console.log(`PASS: ${message}`);
        } else {
            console.log(`FAIL: ${message}`);
        }
    }

    // Check that the form exists (read-only check)
    const form = document.getElementById('myForm');
    assertTrue(form !== null, "The task form (#myForm) should be present on the page");

    // Check that reminder-list exists
    const reminderList = document.getElementById('reminder-list');
    assertTrue(reminderList !== null, "The reminder list (#reminder-list) should be present on the page");

    // Test parseReminder with a safe, harmless input
    if (typeof parseReminder === 'function') {
        try {
            const result = parseReminder(60000); // 1 minute
            console.log("parseReminder(60000) returned:", result);
            assertTrue(result.includes('1 minute'), "parseReminder should return a string mentioning '1 minute'");
        } catch (e) {
            console.log("FAIL: parseReminder threw an error:", e.message);
        }
    } else {
        console.log("parseReminder not defined, skipping that test");
    }

    // Test populateTaskForm with a mock task if form fields exist
    if (typeof populateTaskForm === 'function' && form) {
        const nameField = form.querySelector('#task-name');
        const descField = form.querySelector('#task-desc');
        const dateField = form.querySelector('#task-date');
        const timeField = form.querySelector('#task-time');

        if (nameField && descField && dateField && timeField) {
            const mockTask = {
                taskName: "Test Task",
                taskDescription: "Just a test description",
                date: "2025-03-25 10:00",
                reminderList: []
            };
            try {
                populateTaskForm(mockTask);
                console.log("populateTaskForm was called with a mock task. Check if form fields updated as expected.");
            } catch (e) {
                console.log("FAIL: populateTaskForm threw an error:", e.message);
            }
        } else {
            console.log("Not all form fields (#task-name, #task-desc, #task-date, #task-time) exist. Skipping populateTaskForm test.");
        }
    } else {
        console.log("populateTaskForm not defined or no form found, skipping populateTaskForm test");
    }
    
}, { once: true });
