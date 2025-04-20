const STORAGE_KEY = "user-preference-alarm-enabled";

onInstall();
notify();
addMessageListener();

/**
 * Basic logging run on installation of the Task Tracker.
 */
function onInstall() {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('Task Tracker extension installed.');
    chrome.contextMenus.create({
      id: "quickAddTask",
      title: "Quick Add Task",
      contexts: ["page", "selection"]
    });
  });
}

// listener for quick add context menu option
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickAddTask") {
      // Check if text is selected
      const selectedText = info.selectionText || "";

      // Dynamically set the popup to include the selected text
      chrome.action.setPopup({
          popup: `../html/openView.html?task=${encodeURIComponent(selectedText)}`,
      }, () => {
          // Open the popup window
          chrome.action.openPopup();

          // Reset popup to default (calendar view) for normal behavior
          chrome.action.setPopup({ popup: "../html/pages/calendarView.html" });
      });
  }
});

/**
 * This will create a listener that generates a notification upon an alarm going off.
 * When an alarm is found the following will be logged: "taskReminderid_name_timeBefore alarm!"
 * When a notification is created the following will be logged: "taskReminderid_name_timeBefore notification created."
 */
async function notify() {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('taskReminder')) {
      console.log(alarm.name + " alarm!");

      let name = alarm.name.substring(alarm.name.indexOf('_') + 1, alarm.name.lastIndexOf('_'));
      let timeBefore = Number(alarm.name.substring(alarm.name.lastIndexOf('_') + 1));

      const time = parseTimeBefore(timeBefore);
      
      chrome.runtime.sendMessage({
        command: 'removeReminder',
        reminderId: alarm.name,  // Send the unique alarm name to identify
      });

      chrome.notifications.create({
        type: 'basic',
        iconUrl: '../images/taskIcon.png',
        title: 'Task Reminder',
        message: 'Task ' + name + ' is due ' + time + '!'
      });
      console.log(alarm.name + " notification created.")
    }
  });
}

/**
 * This will parse the Number value of the timeBefore to be in the format:
 * "# days, # hours, # minutes" or "now" if less than a minute.
 * @param {Number} timeBefore the number of miliseconds befor the task is scheduled.
 * @returns A string formated to list the days, hours, and minutes left till the item is due.
 */
function parseTimeBefore(timeBefore){
  const days = Math.floor(timeBefore / (24*60*60*1000));
  const hours = Math.floor((timeBefore % (24*60*60*1000)) / (60*60*1000));
  const minutes = Math.floor((timeBefore % (60*60*1000)) / (60*1000));
  
  let time = "in";

  if (days > 0) {
    time += " " +  days + " day";
    if (days > 1) {
      time += "s";
    }
  }
  if (hours > 0) {
    if (time !== "in") {
      time += ",";
    }
    time += " " + hours + " hour";
    if (hours > 1) {
      time += "s";
    }
  }
  if (minutes > 0) {
    if (time !== "in") {
      time += ",";
    }
    time += " " + minutes + " minute";
    if (minutes > 1) {
      time += "s";
    }
  }
  if (time === "in")
    time = "now";
  return time;
}

/**
 * Listens for any messages from other js files and handles them in specific ways depending on the command. 
 * ie.chrome.runtime.sendMessage({
 *       command: 'alarm',
 *       id: Number(task.id),
 *       name: task.taskName,
 *       date:  Date.parse(task.date),
 *       timeBefore: reminder,
 *   }); 
 * Current commands:
 * "alarm" fields:<id>,<name>,<date>,<timeBefore>
 * "delete" fields:<id>,<name>,<timeBefore>
 * "clearAlarms" fields:NA
 * When a message is received the follwing will be logged:
 *      "Background received: message"
 */
function addMessageListener(){
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('Background received:', message);
        switch (message.command) {
          case "alarm":
            createTaskAlarm(message.id, getReminderTime(message.date, message.timeBefore), message.timeBefore, message.name);
            sendResponse({ status: 'received' });
            break;
          case "delete":
            deleteTaskAlarm(message.id, message.name, message.timeBefore);
            sendResponse({ status: 'received' });
            break;
          case "clearAlarms":
            clearAlarms();
            sendResponse({ status: 'received' });
            break;
          default:
            sendResponse({ status: 'error', message: 'Unknown command' });
            break;
        }
    });
}

/**
 * Calculates the time of when the reminder should be sent based on
 * the due date and the time before due that the user wants to be 
 * reminded.
 * 
 * @param {Number} reminderPeriod The time before the task to be reminded.
 * @param {Number} dueDate the time that the task is scheduled for.
 * @returns the date to set the reminder
 */
function getReminderTime(dueDate, reminderPeriod) {
  return new Date(dueDate - reminderPeriod);
}

/**
 * Generates an alarm based on the task id, name, reminder date, and alert time
 * that will run in the background until going off.
 * 
 * @param {int} taskId the id of the task to set the alarm for.
 * @param {Date} reminderDate the exact time of reminder alarm.
 * @param {int} timeBefore the time before the task date of the alarm.
 * @param {String} name the name of the task to set the alarm for.
 */
function createTaskAlarm(taskId, reminderDate, timeBefore, name) {
  if (!(reminderDate instanceof Date)) {
    throw new Error('Invalid reminderDate: not a Date object');
  }

  const timestamp = reminderDate.getTime();

  if (isNaN(timestamp)) {
    throw new Error('Invalid Date: reminderDate results in NaN');
  }

  chrome.alarms.create(`taskReminder${taskId}_${name}_${timeBefore}`, {
      when: timestamp
  });
  console.log("alarm " + `taskReminder${taskId}_${name}_${timeBefore}` + " created!")
;}

/**
 * Delete a created alarm by id and timeBefore
 * will log the result of attempt as such:
 *    success   => "taskRemindertaskId_name_timeBefore deleted."
 *    failure   => "taskRemindertaskId_name_timeBefore failed to delete!"
 *    alarm not found => "taskRemindertaskId_name_timeBefore not found for deletion."
 * @param {int} taskId the id of the task of thealarm to delete.
 * @param {String} name the name of the task of the alarm to delete.
 * @param {int} timeBefore the timeBefore of the alarm to delete.
 */
function deleteTaskAlarm(taskId, name, timeBefore) {
  const alarmName = `taskReminder${taskId}_${name}_${timeBefore}`;
  chrome.alarms.get(alarmName, (alarm) => {
    if (alarm) {
      chrome.alarms.clear(alarmName, (success) => {
        if (success) {
          console.log(alarmName + " deleted.");
        } else {
          console.log(alarmName + " failed to delete!");
        }
      });
    } else {
      console.log(alarmName + " not found for deletion.");
    }
  });
}

/**
 * This will clear all alarms from the system
 * log "All alarms successfully cleared!" on success
 * log "No alarms to clear." on failure
 */
function clearAlarms() {
  chrome.alarms.clearAll((wasCleared) => {
    if (wasCleared) {
        console.log("All alarms successfully cleared!");
    } else {
        console.log("No alarms to clear.");
    }
  });
}
