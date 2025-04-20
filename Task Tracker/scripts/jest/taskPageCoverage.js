/**
 * @jest-environment jsdom
 */

describe('taskPage.js full coverage', () => {
    let originalLocation;

    beforeAll(() => {
        // Save original location so we can restore after tests
        originalLocation = window.location;

        // Mock modifyTask, saveTasksToLocalStorage, and setAlarm globally
        global.modifyTask = jest.fn();
        global.saveTasksToLocalStorage = jest.fn();
        global.setAlarm = jest.fn();

        // Mock chrome and alert
        global.chrome = {
            runtime: {
                sendMessage: jest.fn(),
                lastError: null,
            },
        };
        global.alert = jest.fn();

        // Mock localStorage
        global.localStorage = {
            getItem: jest.fn(() => 'light'),
            setItem: jest.fn(),
        };

        // Define a global dynamicTaskArray for testing
        global.dynamicTaskArray = [
            {
                id: 1,
                taskName: 'Existing Task',
                taskDescription: 'Some description',
                date: '2024-12-11 14:00',
                complete: false,
                reminderList: [3600000], // 1 hour before
            },
        ];

        // Define a global taskObject to fix the reference in deleteTask
        // It references 'taskObject' variable in deleteTask, so we define it here
        global.taskObject = {
            id: 1,
            taskName: 'Existing Task',
            reminderList: [3600000]
        };

        // Mock window.location so we can manipulate it
        delete window.location;
        window.location = { 
            search: '', 
            href: '',
            assign: jest.fn(url => { window.location.href = url; }),
        };

        // Set up a minimal DOM structure
        document.body.innerHTML = `
            <form id="myForm">
                <input id="task-name" />
                <input id="task-desc" />
                <input id="task-date" />
                <input id="task-time" />
                <input id="days" />
                <input id="hours" />
                <input id="minutes" />
                <button id="add-reminder"></button>
                <button id="delete-task-button"></button>
                <button id="cancel-task-button"></button>
                <ul id="reminder-list"></ul>
            </form>
        `;

        // Require the script after all mocks are set
        require('../taskPage.js');
    });

    afterAll(() => {
        window.location = originalLocation; // restore original location
    });

    test('parseReminder covers all branches', () => {
        const { parseReminder } = window;
        // Just when due
        expect(parseReminder(0)).toBe('remind  when due');
        // Minutes only
        expect(parseReminder(60000)).toBe('remind  1 minute before');
        expect(parseReminder(120000)).toBe('remind  2 minutes before');
        // Hours and minutes
        expect(parseReminder(3660000)).toBe('remind  1 hour, 1 minute before');
        // Days only
        expect(parseReminder(24*60*60*1000)).toBe('remind  1 day before');
        expect(parseReminder(48*60*60*1000)).toBe('remind  2 days before');
        // Days, hours, minutes
        const complexReminder = (2*24*60*60*1000)+(2*60*60*1000)+(2*60*1000);
        expect(parseReminder(complexReminder)).toBe('remind  2 days, 2 hours, 2 minutes before');
    });

    test('reloadReminders with reminders and none', () => {
        const { reloadReminders, parseReminder } = window;
        const list = document.getElementById('reminder-list');

        // With reminders
        reloadReminders(dynamicTaskArray[0]);
        expect(list.innerHTML).not.toBe('There are no reminders.');
        expect(list.querySelectorAll('li').length).toBe(1);

        // No reminders
        dynamicTaskArray[0].reminderList = [];
        reloadReminders(dynamicTaskArray[0]);
        expect(list.innerHTML).toBe('There are no reminders.');
    });

    test('populateTaskForm', () => {
        const { populateTaskForm } = window;
        const task = {
            taskName: 'Test Task',
            taskDescription: 'Test Desc',
            date: '2024-12-11 15:30',
            reminderList: []
        };
        populateTaskForm(task);
        expect(document.getElementById('task-name').value).toBe('Test Task');
        expect(document.getElementById('task-desc').value).toBe('Test Desc');
        expect(document.getElementById('task-date').value).toBe('2024-12-11');
        expect(document.getElementById('task-time').value).toBe('15:30');
    });

    test('saveEditedTask with existing task', () => {
        const { saveEditedTask } = window;
        const event = { preventDefault: jest.fn() };
        // Make sure form has values
        document.getElementById('task-name').value = 'New Name';
        document.getElementById('task-desc').value = 'New Desc';
        document.getElementById('task-date').value = '2024-12-12';
        document.getElementById('task-time').value = '10:00';

        saveEditedTask(event, 1, 'list');
        expect(global.modifyTask).toHaveBeenCalled();
        expect(global.saveTasksToLocalStorage).toHaveBeenCalled();
        expect(window.location.href).toBe('listView.html');
    });

    test('saveEditedTask with non-existent task', () => {
        const { saveEditedTask } = window;
        const event = { preventDefault: jest.fn() };
        saveEditedTask(event, 999, 'calendar');
    });

    test('deleteTask with existing task', () => {
        const { deleteTask } = window;
        // Reset array
        global.dynamicTaskArray = [
            {
                id: 1,
                taskName: 'Existing Task',
                taskDescription: 'Some description',
                date: '2024-12-11 14:00',
                complete: false,
                reminderList: [3600000],
            },
        ];
        global.taskObject = global.dynamicTaskArray[0]; // ensure taskObject references the same task
        deleteTask(1, 'calendar');
        expect(global.chrome.runtime.sendMessage).toHaveBeenCalled();
        expect(global.saveTasksToLocalStorage).toHaveBeenCalled();
        expect(window.location.href).toBe('calendarView.html');
    });

    test('deleteTask with non-existent task', () => {
        const { deleteTask } = window;
        global.dynamicTaskArray = []; // no tasks
        deleteTask(999, 'list');
    });

    test('loadTaskForEditing with existing task', () => {
        const { loadTaskForEditing } = window;
        global.dynamicTaskArray = [
            {
                id: 1,
                taskName: 'Task Load',
                taskDescription: 'Load Desc',
                date: '2024-12-11 14:00',
                complete: false,
                reminderList: []
            }
        ];
        loadTaskForEditing(1);
        expect(document.getElementById('task-name').value).toBe('Task Load');
    });

    test('loadTaskForEditing with non-existent task', () => {
        const { loadTaskForEditing } = window;
        global.dynamicTaskArray = [];
        loadTaskForEditing(999);
    });

    test('DOMContentLoaded with valid taskId', () => {
        // Setup URL params
        window.location.search = '?taskId=1&source=calendar';
        document.dispatchEvent(new Event('DOMContentLoaded'));
        // Should attempt to load task 1 and set event listeners
        expect(document.body.classList.contains('light-theme')).toBe(true);
        // cancel button redirect
        document.getElementById('cancel-task-button').click();
        expect(window.location.href).toBe('calendarView.html');
    });

    test('DOMContentLoaded with invalid taskId', () => {
        window.location.search = '?taskId=abc';
        document.dispatchEvent(new Event('DOMContentLoaded'));
        expect(alert).toHaveBeenCalledWith('No task selected for editing.');
        expect(window.location.href).toBe('listView.html');
    });

    test('addNewReminder', () => {
        const { addNewReminder } = window;
        const event = { preventDefault: jest.fn() };

        // Restore a valid array
        global.dynamicTaskArray = [{
            id: 1,
            taskName: 'Remind Task',
            reminderList: []
        }];
        global.taskObject = global.dynamicTaskArray[0];

        document.getElementById('days').value = '1';
        document.getElementById('hours').value = '2';
        document.getElementById('minutes').value = '30';

        addNewReminder(event, 1);
        // Should add reminder and call saveTasksToLocalStorage, setAlarm, reloadReminders
        expect(global.saveTasksToLocalStorage).toHaveBeenCalled();
        expect(global.setAlarm).toHaveBeenCalled();
        expect(document.getElementById('reminder-list').innerHTML).not.toBe('There are no reminders.');
    });

    test('deleteReminder', () => {
        const { deleteReminder } = window;
        const event = { preventDefault: jest.fn(), target: { id: 'delete-reminder-0' } };

        global.dynamicTaskArray = [{
            id: 1,
            taskName: 'DeleteReminderTask',
            reminderList: [3600000]
        }];
        global.taskObject = global.dynamicTaskArray[0];

        deleteReminder(event, 1);
        expect(global.chrome.runtime.sendMessage).toHaveBeenCalled();
        expect(global.saveTasksToLocalStorage).toHaveBeenCalled();
        expect(document.getElementById('reminder-list').innerHTML).toBe('There are no reminders.');
    });
});
