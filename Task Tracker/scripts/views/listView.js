/**
 * listView.js responsible for:
 *  - generating the HTML on 'listView.html' page
 *  - grabbing the tasks from local storage (chrome storage) & building the text for the task
 *  - sorting the tasks from local storage in the way the user wants  
 */

/**
 * Event listener for the buttons on the listView page.
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Check if taskContainer exists (only on list view page)
    const taskContainer = document.getElementById('taskContainer');
    if (taskContainer) {
        console.log("taskContainer found");

        // Attach event listener to show tasks
        document.getElementById('show-tasks')?.addEventListener('click', function(event) {
            event.preventDefault();
            generateTasks();  // Call generateTasks to show stored tasks
        });

        document.getElementById('clear-tasks')?.addEventListener('click', function(event) {
            event.preventDefault();
            clearTasks();
        });

        document.getElementById('sort-deadline')?.addEventListener('click', function(event) {
            event.preventDefault();
            generateTasks('deadline');
        });

        document.getElementById('sort-alpha')?.addEventListener('click', function(event) {
            event.preventDefault();
            generateTasks('alpha');
        });

         // Create and attach the toggle completed tasks button
         const toggleCompletedButton = document.createElement('button');
         toggleCompletedButton.id = 'toggle-completed-tasks';
         toggleCompletedButton.textContent = 'Hide Completed Tasks'; // Default text
         toggleCompletedButton.addEventListener('click', toggleCompletedTasks);
 
         const clearTasksButton = document.getElementById('clear-tasks');
         clearTasksButton.parentNode.insertBefore(toggleCompletedButton, clearTasksButton.nextSibling);
    }

    // load the saved theme, must be done locally since the html page is 'refreshed' everytime the user changes pages
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${savedTheme}-theme`);
    // change the main container of listView 
    document.getElementById("listViewMainContainer").classList.remove('light-theme', 'dark-theme');
    document.getElementById("listViewMainContainer").classList.add(`${savedTheme}-theme`);
});

/**
 * Toggles the visibility of completed tasks and regenerates the task list.
 */
let showCompletedTasks = true; // Global flag to track visibility of completed tasks

function toggleCompletedTasks() {
    showCompletedTasks = !showCompletedTasks; // Toggle the flag

    // Update the button text based on the new state
    const toggleCompletedButton = document.getElementById('toggle-completed-tasks');
    toggleCompletedButton.textContent = showCompletedTasks ? 'Hide Completed Tasks' : 'Show Completed Tasks';

    // Refresh the task list to reflect changes
    generateTasks();
}

/**
 * Builds the HTML for task View from local storage and updates taskView.html 
 */
function generateTasks(sortType) {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; // Clear previous tasks

    // Load tasks from localStorage
    let tasks = loadTaskInLocalStorage();

    if (tasks.length === 0) {
        taskContainer.innerHTML = '<p>No tasks available</p>';
        return;
    }

    // Sort tasks based on sortType
    if (sortType === 'deadline') {
        tasks = sortDeadline(tasks);
    } else if (sortType === 'alpha') {
        tasks = sortAlpha(tasks);
    }

    tasks.forEach((task) => {
        // Skip rendering completed tasks if showCompletedTasks is false
        if (!showCompletedTasks && task.complete) {
            return;
        }

        // Create task container
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.complete) {
            taskDiv.classList.add('task-complete'); // Add class for completed tasks
        }

        // Task information container
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        const taskLabel = document.createElement('label');
        taskLabel.className = 'name';
        taskLabel.textContent = `Task ${task.id}: ${task.taskName}`;
        if (task.complete) {
            taskLabel.style.textDecoration = 'line-through'; // Strike-through for completed tasks
        }

        const taskDescription = document.createElement('p');
        taskDescription.className = 'description';
        taskDescription.textContent = `Description: ${task.taskDescription}`;

        const taskDate = document.createElement('p');
        taskDate.className = 'date';
        taskDate.textContent = `Due Date: ${task.date}`;

        const taskComplete = document.createElement('p');
        taskComplete.className = 'complete';
        taskComplete.textContent = `Completed: ${task.complete ? 'Yes' : 'No'}`;

        // Append information to task info container
        taskInfo.appendChild(taskLabel);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskDate);
        taskInfo.appendChild(taskComplete);

        // Task actions container
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        // Edit button
        const editButton = document.createElement('a');
        editButton.className = 'edit-button';
        editButton.href = `../../html/pages/taskPage.html?taskId=${task.id}&source=list`;
        editButton.textContent = 'Edit';

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTaskFromList(task.id));

        // Mark as Complete/Incomplete button
        const toggleCompleteButton = document.createElement('button');
        toggleCompleteButton.className = 'complete-button';
        toggleCompleteButton.textContent = task.complete ? '\u274C' : '\u2714'; // Cross or checkmark
        toggleCompleteButton.addEventListener('click', () => {
            toggleTaskCompletion(task.id);

            // Update task appearance dynamically
            task.complete = !task.complete;
            taskDiv.classList.toggle('task-complete', task.complete);
            taskLabel.style.textDecoration = task.complete ? 'line-through' : 'none';
            taskComplete.textContent = `Completed: ${task.complete ? 'Yes' : 'No'}`; // Update text dynamically
            toggleCompleteButton.textContent = task.complete ? '\u274C' : '\u2714';
        });

        // Append actions to task actions container
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        taskActions.appendChild(toggleCompleteButton);

        // Append info and actions to task container
        taskDiv.appendChild(taskInfo);
        taskDiv.appendChild(taskActions);

        // Append task container to task list
        taskContainer.appendChild(taskDiv);
    });
}



/**
 * Toggles the completion status of a task, updates local storage, and refreshes the list.
 * @param {number} taskId - The ID of the task to toggle completion status.
 */
function toggleTaskCompletion(taskId) {
    const taskIndex = dynamicTaskArray.findIndex((task) => task.id === taskId);

    if (taskIndex > -1) {
        const task = dynamicTaskArray[taskIndex];
        task.complete = !task.complete; // Toggle the completion status
        saveTasksToLocalStorage(); // Save changes to local storage
    } else {
        alert('Error: Task not found.');
    }
}


/**
 * Deletes a task from the list view and updates the global tasks.
 * @param {number} taskId - The ID of the task to delete.
 */
function deleteTaskFromList(taskId) {
    const taskIndex = dynamicTaskArray.findIndex((task) => task.id === taskId);
    const task = dynamicTaskArray.find((task) => task.id === taskId);

    if (taskIndex > -1) {
        task.reminderList.forEach((reminder, index) => {
            chrome.runtime.sendMessage({
                command: "delete",
                id: Number(task.id),
                name: task.taskName,
                timeBefore: task.reminderList[index],
            }, 
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError.message);
                } else if (response?.status === 'received') {
                    console.log("Message successfully received by background.");
                } else {
                    console.error("Unexpected response:", response);
                }
            });
        });
        dynamicTaskArray.splice(taskIndex, 1); // Remove task from global array
        saveTasksToLocalStorage(); // Update local storage
        generateTasks(); // Refresh the task list
    } else {
        alert('Error: Task not found.');
    }
}

/**
 * Clears the tasks in taskView.html
 */
function clearTasks() {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';
}

/**
 * Build the HTML taskDiv given an array of tasks.
 * @param {*} tasks 
 */
function buildTaskDiv(tasks) {
    // tasks.forEach((task, index) => {
    //     // etc.
    // }
}

/**
 * Sort the array of tasks by earliest-deadline-first.
 * @param {*} tasks 
 * @returns {*} The tasks sorted by deadline
 */
function sortDeadline(tasks) {
    return [...tasks].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
}

/**
 * Sort the array of tasks alphabetically
 * @param {*} tasks 
 * @returns {*} The tasks sorted alphabetically
 */
function sortAlpha(tasks) {
    return [...tasks].sort((a, b) => {
        return a.taskName.localeCompare(b.taskName);
    });
}

/**
 * Sort the array of tasks in the order that the user added them.
 * @param {*} tasks 
 * @returns {*} The tasks sorted by date-added
 */
function sortDateAdded(tasks){
    let sortedTasks = tasks;
    return sortedTasks
}


window.generateTasks = generateTasks;
window.toggleCompletedTasks = toggleCompletedTasks;
window.clearTasks = clearTasks;
window.sortDeadline = sortDeadline;
window.sortAlpha = sortAlpha;
window.sortDateAdded = sortDateAdded;
window.deleteTaskFromList = deleteTaskFromList;
window.toggleTaskCompletion = toggleTaskCompletion;