/**
 * Declares dynamicTaskArray field. It is created from tasks that have been
 * saved in local storage already.
 */
let dynamicTaskArray = loadTaskInLocalStorage();
let intervalID = [];

submitTask();

/**
 * Event Listener that loads DOM elements of extension webpage for use.
 */
function submitTask() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM fully loaded and parsed: task");

        document.getElementById('submit-task-button')?.addEventListener('click', function(event) {
            addTask(event);
        });
    });
}

async function generateTaskId() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['lastTaskId'], (result) => {
          let newId = (result.lastTaskId || 0) + 1;
          chrome.storage.local.set({ 'lastTaskId': newId }, () => {
            console.log("newID " + newId);
            resolve(newId); 
          });
        });
      });
}

async function addTask(event) {

    event.preventDefault();

    // Collect form data
    const form = document.getElementById('myForm');
    const formData = new FormData(form);
    const taskName = formData.get('task-name');
    const taskDesc = formData.get('task-desc'); 
    const taskDate = formData.get('task-date');
    const taskTime = formData.get('task-time');
    const taskRecur = formData.get('task-recur'); 
    const taskReminderDays = formData.get('days');
    const taskReminderHours = formData.get('hours');
    const taskReminderMinutes = formData.get('minutes');

    /*CHANGE HERE */
    const checkboxes = document.querySelectorAll('#task-recur input[type="checkbox"]');
    const selectedWeekdays = [];
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
          selectedWeekdays.push(weekdays[index]);
        }
    });

    console.log(selectedWeekdays);


    /**CHANGE HERE */
    console.log("days: " + taskReminderDays);
    console.log("hours: " + taskReminderHours);
    console.log("minutes " + taskReminderMinutes);
    
    const date = taskDate + ' ' + taskTime;
    const reminder = taskReminderDays * 24 * 60 * 60 * 1000 + taskReminderHours * 60 * 60 * 1000 + taskReminderMinutes * 60 * 1000;

    const taskId = await generateTaskId();
    const isRecurring=false;
    let currentDate= new Date();
    
    if(selectedWeekdays.length==0) //No recurring days selected
    {
        const isRecurring=false;
        const task = createTask(taskId, taskName, taskDesc, 'None', date, reminder, false, isRecurring);
        if (reminder != 0) {
            setAlarm(task, reminder);
        }
        console.log("Saving task:", task);
        dynamicTaskArray.push(task);
        saveTasksToLocalStorage();
    }
    else
    {
        const isRecurring=true;
        const task = createTask(taskId, taskName, taskDesc, 'None', date, reminder, false, isRecurring);
        addRecurring(selectedWeekdays, task, currentDate);
    }

    form.reset(); 
}


async function addRecurring(selectedWeekdays, task, currentDate) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let backupCurrentDay = new Date(currentDate.getTime());
    let endDate = new Date(Date.parse(task.date));
    console.log("endDate: ", endDate);

    for (let i = 0; i < 7; i++) {
        currentDate.setTime(backupCurrentDay.getTime());
        if (selectedWeekdays.includes(weekdays[i])) {
            console.log(weekdays[i]);
            while (currentDate.getDay() !== i) { 
                currentDate.setDate(currentDate.getDate() + 1); // Increment to the next desired weekday
            }

            // Add new tasks for each recurring weekday until the end date
            while (currentDate.getTime() < endDate.getTime()) {
                const newTaskId = await generateTaskId();

                // Format the date to "YYYY-MM-DD HH:mm"
                const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

                const newTask = createTask(
                    newTaskId,
                    task.taskName,
                    task.taskDescription,
                    task.taskCategory,
                    formattedDate,
                    task.reminderList[0],
                    task.complete,
                    task.recurring
                );
                if (task.reminderList.length != 0) {
                    setAlarm(newTask, task.reminderList[0]);
                }

                console.log(`Adding recurring task for ${formattedDate}`);
                dynamicTaskArray.push(newTask);
                currentDate.setDate(currentDate.getDate() + 7); // Move to the next occurrence of this weekday
            }
        }
    }

    saveTasksToLocalStorage();
}


function createRecurrObject(id, recurInterval) {
    return {id, recurInterval};
}

function pushTask(task, timeDifference)
{
    const current = task.getTime();
    task.date.setDate(current)
    dynamicTaskArray.push(task);
}

function calculateNextOccurrence(weekday, date) {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Parse the task date and time into a JavaScript Date object
    const taskDateTime = Date.parse(date);
    
    // Get the current day and target weekday index
    const currentDay = new Date().getDay();
    const targetDay = weekdays.indexOf(weekday);

    // Calculate the difference in days
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
        daysUntilTarget += 7; // Next week if the target day is in the past this week
    }

    // Set the next target date
    const nextTargetDate = new Date(taskDateTime);
    nextTargetDate.setDate(nextTargetDate.getDate() + daysUntilTarget);
    
    // Return the calculated date in ISO string format (you can adjust this to your preferred format)
    return nextTargetDate;
}

function setAlarm(task, reminder){
    chrome.runtime.sendMessage({
        command: 'alarm',
        id: Number(task.id),
        name: task.taskName,
        date:  Date.parse(task.date),
        timeBefore: reminder,
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
}

/**
 * Function that saves the current dynamic array of tasks into local storage.
 */
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(dynamicTaskArray));
}


function loadTaskInLocalStorage() {
    
    let loadTask = localStorage.getItem("tasks");

    if (loadTask == null) {
        console.log("No tasks found in local storage.");
        return [];
    } else {
        return JSON.parse(loadTask);
    }
}

function clearStorage() {
    localStorage.clear();
    dynamicTaskArray = loadTaskInLocalStorage();
}

function createTask(id, taskName, taskDescription, taskCategory, date, reminder, complete, recurring) {
    const reminderList =[];
    if (reminder != 0) {
        reminderList.push(reminder); 
    }
    return {id, taskName, taskDescription, taskCategory, date, reminderList, complete, recurring};
}

function modifyTask(taskObject, taskName, taskDescription, taskCategory, date, complete, recurring){
    taskObject.taskName=taskName;
    taskObject.taskDescription=taskDescription;
    taskObject.taskCategory=taskCategory;
    taskObject.date=date;
    taskObject.complete=complete;
    taskObject.recurring=recurring;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'removeReminder') {
      const reminderId = message.reminderId;
  
      // Call a function to remove the reminder from reminderList
      removeReminderFromList(reminderId);
  
      // Send a response back if needed
      sendResponse({ status: 'success', message: `Reminder ${reminderId} removed.` });
    }
  });

function removeReminderFromList(reminderId) {
    const taskName = reminderId.substring(reminderId.indexOf('_') + 1, reminderId.lastIndexOf('_'));
    const task = dynamicTaskArray.find(task => task.taskName === taskName);
    const timeBefore = Number(reminderId.substring(reminderId.lastIndexOf('_') + 1));
    const index = task.reminderList.findIndex(reminder => reminder === timeBefore);
    task.reminderList.splice(index, 1);
    saveTasksToLocalStorage();
}

