document.addEventListener('DOMContentLoaded', initializeOpenView);

function initializeOpenView() {
    setupRecurrenceDropdown();
    clearForm();  // Optional: Clears the form fields on page load
    prefillTaskFromQuery();

    loadTheme();
}

function loadTheme(){
    // load the saved theme, must be done locally since the html page is 'refreshed' everytime the user changes pages
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${savedTheme}-theme`);
    // change the main container of add Task
    document.getElementById("add-task-section").classList.remove('light-theme', 'dark-theme');
    document.getElementById("add-task-section").classList.add(`${savedTheme}-theme`);

    document.getElementById("buttons-container").classList.remove('light-theme', 'dark-theme');
    document.getElementById("buttons-container").classList.add(`${savedTheme}-theme`);
}


/**
 * Toggles the visibility of the recurrence dropdown for selecting repeat days.
 */
function setupRecurrenceDropdown() {
    const checkList = document.getElementById('task-recur');
    const anchor = checkList.getElementsByClassName('anchor')[0];

    anchor.onclick = function() {
        checkList.classList.toggle('visible');
    };
}

/**
 * Clears the task form fields on page load to provide a blank state.
 * (Optional: Use if you want the form to reset each time the page loads)
 */
function clearForm() {
    document.getElementById('myForm').reset();
}


function prefillTaskFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const task = params.get("task"); // Get the `task` parameter from the query string
    if (task) {
        const taskNameInput = document.getElementById("task-name"); // Use the actual `id` of the task name input field
        if (taskNameInput) {
            taskNameInput.value = task; // Dynamically set the task name field
        }
    }
}
