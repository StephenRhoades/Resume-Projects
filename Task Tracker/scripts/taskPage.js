/**
 * Populates the task form with the data of the selected task for editing.
 * @param {Object} taskObject - The task object to be edited.
 */
function populateTaskForm(taskObject) {
    const form = document.getElementById('myForm');
    form.querySelector('#task-name').value = taskObject.taskName;
    form.querySelector('#task-desc').value = taskObject.taskDescription;
    form.querySelector('#task-date').value = taskObject.date.split(' ')[0]; // Extract date
    form.querySelector('#task-time').value = taskObject.date.split(' ')[1]; // Extract time
    reloadReminders(taskObject);
}

/**
 * Takes the milisecond value of reminders and makes it more readable for the user.
 * @param {Number} reminder the miliseconds before the task to remind the user
 * @returns the reminder in days, hours, and minutes
 */
function parseReminder(reminder) {
    const days = Math.floor(reminder / (24*60*60*1000));
  const hours = Math.floor((reminder % (24*60*60*1000)) / (60*60*1000));
  const minutes = Math.floor((reminder % (60*60*1000)) / (60*1000));
    let time = "remind ";

    if (days > 0) {
        time += " " +  days + " day";
        if (days > 1) {
            time += "s";
        }
    }
    if (hours > 0) {
        if (time !== "remind ") {
            time += ",";
        }
        time += " " + hours + " hour";
        if (hours > 1) {
            time += "s";
        }
    }
    if (minutes > 0) {
        if (time !== "remind ") {
            time += ",";
        }
        time += " " + minutes + " minute";
        if (minutes > 1) {
            time += "s";
        }
    }
    if (time === "remind ") {
        time += " when due";
    } else {
        time += " before"
    }

    return time;
}

/**
 * Saves the modified task to dynamicTaskArray and updates local storage.
 * @param {Event} event - The submit button click event.
 * @param {number} taskId - The ID of the task to update.
 */
/**
 * Saves the modified task and redirects based on the source.
 * @param {Event} event - Submit button click event.
 * @param {number} taskId - ID of the task to save.
 * @param {string} source - The source view ('list' or 'calendar').
 */
function saveEditedTask(event, taskId, source) {
    event.preventDefault();

    // Collect form data
    const form = document.getElementById('myForm');
    const taskName = form.querySelector('#task-name').value;
    const taskDesc = form.querySelector('#task-desc').value;
    const taskDate = form.querySelector('#task-date').value;
    const taskTime = form.querySelector('#task-time').value;

    const taskIndex = dynamicTaskArray.findIndex((task) => task.id === taskId);

    if (taskIndex > -1) {
        const task = dynamicTaskArray[taskIndex];
        modifyTask(task, taskName, taskDesc, task.taskCategory, `${taskDate} ${taskTime}`, task.complete, task.recurring);
        saveTasksToLocalStorage();

        window.location.href = source === 'calendar' ? 'calendarView.html' : 'listView.html'; // Redirect based on source
    } else {
        alert('Error: Task not found.');
    }
}

/**
 * Deletes a task and redirects based on the source.
 * @param {number} taskId - ID of the task to delete.
 * @param {string} source - The source view ('list' or 'calendar').
 */
function deleteTask(taskId, source) {
    const taskIndex = dynamicTaskArray.findIndex((task) => task.id === taskId);
    const task = dynamicTaskArray.find((task) => task.id === taskId);

    if (taskIndex > -1) {
        console.log(task.reminderList);
        task.reminderList.forEach((reminder, index) => {
            chrome.runtime.sendMessage({
                command: "delete",
                id: Number(taskObject.id),
                name: taskObject.taskName,
                timeBefore: taskObject.reminderList[index],
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
        dynamicTaskArray.splice(taskIndex, 1); // Remove from global array
        saveTasksToLocalStorage(); // Save updated global array to localStorage
        window.location.href = source === 'calendar' ? 'calendarView.html' : 'listView.html'; // Redirect based on source
    }
}

/**
 * Sets up the page to load the selected task for editing.
 * @param {number} taskId - The ID of the task to edit.
 */
function loadTaskForEditing(taskId) {
    const task = dynamicTaskArray.find((task) => task.id === taskId);
    if (task) {
        populateTaskForm(task);
    }
}

// Load the task ID from URL or other method
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = parseInt(urlParams.get('taskId'), 10);
    const source = urlParams.get('source') || 'list'; // Default to 'list' if not provided

    console.log('Task ID:', taskId);
    console.log('Source:', source);

    if (!isNaN(taskId)) {
        loadTaskForEditing(taskId);

        const form = document.getElementById('myForm');
        form.addEventListener('submit', (event) => {
            saveEditedTask(event, taskId, source);
        });

        // Add reminder functionality
        const addReminderButton = document.getElementById('add-reminder');
        addReminderButton.addEventListener('click', (event) => {addNewReminder(event, taskId)});

        // Add delete functionality
        const deleteButton = document.getElementById('delete-task-button');
        deleteButton.addEventListener('click', () => deleteTask(taskId, source));

        // Add cancel functionality
        const cancelButton = document.getElementById('cancel-task-button');
        cancelButton.addEventListener('click', () => {
            window.location.href = source === 'calendar' ? 'calendarView.html' : 'listView.html';
        });
    } else {
        alert('No task selected for editing.');
        window.location.href = 'listView.html'; // Default redirect
    }

    // load the saved theme, must be done locally since the html page is 'refreshed' everytime the user changes pages
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${savedTheme}-theme`);
    document.getElementById("myForm").classList.remove('light-theme', 'dark-theme');
    document.getElementById("myForm").classList.add(`${savedTheme}-theme`);
});


function addNewReminder(event, taskId) {
    event.preventDefault();
    const form = document.getElementById('myForm');

    const taskReminderDays = form.querySelector('#days').value;
    form.querySelector('#days').value = '';
    const taskReminderHours = form.querySelector('#hours').value;
    form.querySelector('#hours').value = '';
    const taskReminderMinutes = form.querySelector('#minutes').value;
    form.querySelector('#minutes').value = '';
    
    const reminder = taskReminderDays * 24 * 60 * 60 * 1000 + taskReminderHours * 60 * 60 * 1000 + taskReminderMinutes * 60 * 1000;
    const taskObject = dynamicTaskArray.find((task) => task.id === taskId);

    addReminder(reminder, taskObject);
    reloadReminders(taskObject);
}

function addReminder(reminder, task) {
    task.reminderList.push(reminder);
    saveTasksToLocalStorage();
    setAlarm(task, reminder);
}

function deleteReminder(event, taskId) {
    event.preventDefault();
    const elementId = event.target.id;
    const taskObject = dynamicTaskArray.find((task) => task.id === taskId);
    const index = elementId.substring(elementId.lastIndexOf('-') + 1);
    chrome.runtime.sendMessage({
        command: "delete",
        id: Number(taskObject.id),
        name: taskObject.taskName,
        timeBefore: taskObject.reminderList[index],
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
        // "delete," + Number(taskObject.id) + "," + taskObject.taskName + "," + taskObject.reminderList[index]);
    taskObject.reminderList.splice(index, 1);
    saveTasksToLocalStorage();
    reloadReminders(taskObject);
}

/**
* Reloads the reminder list in the DOM.
* @param {Array} reminderList - The updated list of reminders.
*/
function reloadReminders(taskObject) {
    const list = document.getElementById("reminder-list");
    if (taskObject.reminderList.length == 0) {
        list.innerHTML = "There are no reminders.";
    } else {
        list.innerHTML = "";
    }

    taskObject.reminderList.forEach((reminder, index) => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        li.innerText = parseReminder(reminder);
        li.className = "reminder";
        button.id = "delete-reminder-" + index;
        button.className = "delete-reminder";
        button.innerText = "Delete Reminder";

        button.addEventListener('click', (event) => {
            deleteReminder(event, taskObject.id);
        });

        li.appendChild(button);
        list.appendChild(li);
    });
}

// /**
//  * ATTENTION: TEST FUNCTION ONLY. HTML IMPLEMENTATION PENDING.
//  * Takes a taskObject, and once the submit button is pressed modifies the selected task with the filled form field.
//  * @param {*} event Mouse click on submit button.
//  * @param {*} taskObject Selected task.
//  */
// function submitModifyTask(event, taskObject) { //UNCOMMENT code once category, complete and recurring html containers are created.
//     event.preventDefault();

//     // Collect form data
//     const form = document.getElementById('myForm');
//     const formData = new FormData(form);
//     const taskName = formData.get('task-name');
//     const taskDesc = formData.get('task-desc'); 
//     //const taskCategory = formData.get('task-category');   
//     const taskDate = formData.get('task-date');
//     //const taskRecurring = formData.get('task-complete'); 
//     //const taskComplete = formData.get('task-recurring'); 

//     changeName(taskObject, taskName);
//     changeDecription(taskObject, taskDesc);
//     //changeCategory(taskObject, taskCategory);
//     changeDate(taskObject, taskDate);
//     //changeComplete(taskObject, taskComplete);
//     //changeRecurring(taskObject, taskRecurring);

//     console.log("Saving task:", task);

//     // Add the new task to the task array and save it to localStorage
//     //dynamicTaskArray.push(task);
//     saveTasksToLocalStorage();

//     // Form submission or reset
//     form.reset();  // This will clear the form after submitting. Test the behavior of this.

// }

// /**
//  * ATTENTION: TEST FUNCTION ONLY. HTML IMPLEMENTATION PENDING.
//  * Auto-fills task form from a given taskObject. Meant to be called after a user selects a task to modify and before submitModifyTask() is called.
//  * @param {*} event Mouse click on selecting task in list or calendar.
//  * @param {*} taskObject Selected task.
//  */
// function fillTaskForm(event, taskObject) {
//     event.preventDefault();
//     const form = document.getElementById('myForm');
//     // Auto-fills form data from existing taskObject
//     form.getElementById('task-name').value=taskObject.taskName;
//     form.getElementById('task-desc').value=taskObject.taskDescription;
//     //form.getElementById('task-category').value=taskObject.taskCategory;
//     form.getElementById('task-date').value=taskObject.taskDate;
//     //form.getElementById('task-complete').value=taskObject.complete;
//     //form.getElementById('task-recurring').value=taskObject.recurring;
    
// }


// /**
//  * Changes the Task Name 
//  * @param {*} task 
//  */
// function changeName(taskObject, newName) {
//     modifyTask(taskObject, newName, taskObject.taskDescription, taskObject.taskCategory, taskObject.date, taskObject.complete, taskObject.recurring);
// }
// /**
//  * Changes the taskObject description.
//  * @param {*} taskObject taskObject element from a dynamicArray loaded from local storage.
//  * @param {*} newDescription New description of task object.
//  */
// function changeDecription(taskObject, newDescription) {
//     modifyTask(taskObject,taskObject.taskName, newDescription, taskObject.taskCategory, taskObject.date, taskObject.complete, taskObject.recurring);
// }

// /**
//  * Changes the taskObject category.
//  * @param {*} taskObject taskObject element from a dynamicArray loaded from local storage.
//  * @param {*} newCategory New category of task object.
//  */
// function changeCategory(taskObject, newCategory) {
//     modifyTask(taskObject,taskObject.taskName, taskObject.taskDescription, newCategory, taskObject.date, taskObject.complete, taskObject.recurring);
// }

// /**
//  * Changes the taskObject date.
//  * @param {*} taskObject taskObject element from a dynamicArray loaded from local storage.
//  * @param {*} newDate New date of task object.
//  */
// function changeDate(taskObject, newDate) {
//     modifyTask(taskObject,taskObject.taskName, taskObject.taskDescription, taskObject.taskCategory, newDate, taskObject.complete, taskObject.recurring);
// }

// /**
//  * Changes the taskObject completion status.
//  * @param {*} taskObject taskObject element from a dynamicArray loaded from local storage.
//  * @param {*} newComplete New completion status of task object. Currently False if not completed, true otherwise.
//  */
// function changeComplete(taskObject, newComplete) {
//     modifyTask(taskObject,taskObject.taskName, taskObject.taskDescription, taskObject.taskCategory, taskObject.date, newComplete, taskObject.recurring);
// }

// /**
//  * Changes the taskObject recurring status.
//  * @param {*} taskObject taskObject element from a dynamicArray loaded from local storage.
//  * @param {*} newRecurring New recurring of task object.
//  */
// function changeRecurring(taskObject, newRecurring) {
//     modifyTask(taskObject,taskObject.taskName, taskObject.taskDescription, taskObject.taskCategory, taskObject.date, taskObject.complete, newRecurring);
// }

// //let dynamicTaskArray = loadTaskInLocalStorage();

// /**
//  * Removes the given taskObject from the dynamicArray and saves the new array to local storage.
//  * @param {*} taskObject taskObject element
//  */
// function removeTask(taskObject) {
//     loadTaskInLocalStorage();
//     const index = dynamicTaskArray.indexOf(taskObject); //may replace this logic using taskID instead.
//     if (index > -1) //Splice only when item is found
//     {
//         dynamicTaskArray.splice(index, 1);
//         saveTasksToLocalStorage();
//     }
// }

// /**
//  * Removes the taskObject at the given index. The resulting dynamicArray is saved to local storage.
//  * @param {*} index Index of a taskObject in the dynamicArray.
//  */
// function removeTaskIndex(index) {
//     loadTaskInLocalStorage();
//     if (index > -1 && index<dynamicTaskArray.length) //Only splice when given valid index
//     {
//         dynamicTaskArray.splice(index, 1);
//         saveTasksToLocalStorage();
//     }
// }


// function addReminder(taskObject) {
//     chrome.alarms.create(taskObject.taskName, {
//         when: taskObject.taskDate - 900000 //Creates reminder 15 minutes before task due date
//     });
// }

// function changeReminder() {}

// function removeReminder() {}

// //function modifyTask(taskObject, taskName, taskDescription, taskCategory, date, complete, recurring)


// /**
//  * Event Listeners for the buttons.
//  */
// document.addEventListener('DOMContentLoaded', function() {
//     console.log("DOM fully loaded and parsed: task");

//     edit_btn = document.getElementById('edit-button-id');
//     edit_btn.addEventListener('click', function(event) {
//         editTask(edit_btn, event);
//     });

//     expand_btn = document.getElementById('expand-btn-id');
//     expand_btn.addEventListener('click', function(event) {
//         toggleDetails(expand_btn, event);
//     });
// });

// /**
//  * Toggles the dropdown menu to show the details of the task
//  * @param {*} button reference to the button
//  */
// function toggleDetails(button) {
//     const details = button.nextElementSibling;
//     if (details.style.display === "block") {
//         details.style.display = "none";
//         button.textContent = "Expand";
//     } else {
//         details.style.display = "block";
//         button.textContent = "Collapse";
//     }
// }


// /**
//  * Creates the inputs for the user to edit a task
//  * @param {*} button 
//  */
// function editTask(button) {
//     const task = button.closest('.task');
//     const details = task.querySelector('.task-details');

//     // name
//     const nameInput = document.createElement("input");
//     nameInput.type = "text";
//     nameInput.value = details.querySelector('p:nth-child(1)').innerText.split(": ")[1];
//     nameInput.className = "edit-input";

//     // date
//     const dateInput = document.createElement("input");
//     dateInput.type = "date";
//     dateInput.value = details.querySelector('p:nth-child(1)').innerText.split(": ")[1];
//     dateInput.className = "edit-input";

//     // time
//     const timeInput = document.createElement("input");
//     timeInput.type = "time";
//     timeInput.value = details.querySelector('p:nth-child(2)').innerText.split(": ")[1];
//     timeInput.className = "edit-input";

//     // description
//     const descInput = document.createElement("textarea");
//     descInput.className = "edit-input";
//     descInput.value = details.querySelector('p:nth-child(3)').innerText.split(": ")[1];

//     // Clear details and add input fields with a Save button
//     details.innerHTML = '';
//     details.appendChild(nameInput);
//     details.appendChild(dateInput);
//     details.appendChild(timeInput);
//     details.appendChild(descInput);

//     const saveButton = document.createElement("button");
//     saveButton.textContent = "Save";
//     saveButton.className = "save-btn";
//     saveButton.onclick = function () {
//         saveTask(details, nameInput.value, dateInput.value, timeInput.value, descInput.value, button);
//     };

//     details.appendChild(saveButton);
//     details.style.display = "block";
// }

// /**
//  * 
//  * @param {*} details 
//  * @param {*} date 
//  * @param {*} time 
//  * @param {*} description 
//  * @param {*} button 
//  */
// function saveTask(details, taskName, date, time, description, button) {
//     // Replace input fields with the updated text
//     details.innerHTML = `
//         <p><strong>Date:</strong> ${taskName}</p>
//         <p><strong>Date:</strong> ${date}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Description:</strong> ${description}</p>
//     `;
//     button.textContent = "Edit";
// }

// Attach functions to window for testing
window.populateTaskForm = populateTaskForm;
window.parseReminder = parseReminder;
window.saveEditedTask = saveEditedTask;
window.deleteTask = deleteTask;
window.loadTaskForEditing = loadTaskForEditing;
window.addNewReminder = addNewReminder;
window.deleteReminder = deleteReminder;
window.reloadReminders = reloadReminders;
