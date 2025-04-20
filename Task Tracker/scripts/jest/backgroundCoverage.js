/**
 * @jest-environment jsdom
 */


describe('background.js full coverage', () => {
    beforeEach(() => {
        // Reset modules first
        jest.resetModules();

        // Define global.chrome before requiring background.js
        global.chrome = {
            runtime: {
                onInstalled: { addListener: jest.fn() },
                onMessage: { addListener: jest.fn() },
                sendMessage: jest.fn(),
            },
            alarms: {
                onAlarm: { addListener: jest.fn() },
                create: jest.fn(),
                get: jest.fn((name, callback) => callback(null)),
                clear: jest.fn((name, callback) => callback(true)),
                clearAll: jest.fn((callback) => callback(true)),
            },
            contextMenus: {
                create: jest.fn(),
                onClicked: { addListener: jest.fn() },
            },
            notifications: {
                create: jest.fn(),
            },
            action: {
                setPopup: jest.fn(),
                openPopup: jest.fn(),
            },
        };

        console.log = jest.fn();

        // Now require background.js after chrome is defined
        require('../background.js');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should log installation and create a context menu on install', () => {
        expect(global.chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
        const installCallback = global.chrome.runtime.onInstalled.addListener.mock.calls[0][0];
        installCallback();

        expect(console.log).toHaveBeenCalledWith('Task Tracker extension installed.');
        expect(global.chrome.contextMenus.create).toHaveBeenCalledWith({
            id: 'quickAddTask',
            title: 'Quick Add Task',
            contexts: ['page', 'selection'],
        });
    });

    it('should handle context menu click to quick add task', () => {
        const onClickCallback = global.chrome.contextMenus.onClicked.addListener.mock.calls[0][0];
        const info = { menuItemId: 'quickAddTask', selectionText: 'Test Task' };
        onClickCallback(info);

        expect(global.chrome.action.setPopup).toHaveBeenCalledWith({
            popup: '../html/openView.html?task=Test%20Task',
        }, expect.any(Function));

        const setPopupCallback = global.chrome.action.setPopup.mock.calls[0][1];
        setPopupCallback();

        expect(global.chrome.action.openPopup).toHaveBeenCalled();
        expect(global.chrome.action.setPopup).toHaveBeenCalledWith({
            popup: '../html/pages/calendarView.html',
        });
    });

    it('should handle an alarm and create a notification', () => {
        const onAlarmCallback = global.chrome.alarms.onAlarm.addListener.mock.calls[0][0];
        const alarm = { name: 'taskReminder1_Test_60000' };

        onAlarmCallback(alarm);

        expect(console.log).toHaveBeenCalledWith('taskReminder1_Test_60000 alarm!');
        expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
            command: 'removeReminder',
            reminderId: 'taskReminder1_Test_60000',
        });
        expect(global.chrome.notifications.create).toHaveBeenCalledWith({
            type: 'basic',
            iconUrl: '../images/taskIcon.png',
            title: 'Task Reminder',
            message: 'Task Test is due in 1 minute!',
        });
    });

    it('should handle messages and execute corresponding commands', () => {
        const onMessageCallback = global.chrome.runtime.onMessage.addListener.mock.calls[0][0];
        const sendResponse = jest.fn();

        onMessageCallback({ command: 'alarm', id: 1, name: 'Test', date: Date.now(), timeBefore: 60000 }, null, sendResponse);
        expect(sendResponse).toHaveBeenCalledWith({ status: 'received' });

        onMessageCallback({ command: 'delete', id: 1, name: 'Test', timeBefore: 60000 }, null, sendResponse);
        expect(sendResponse).toHaveBeenCalledWith({ status: 'received' });

        onMessageCallback({ command: 'clearAlarms' }, null, sendResponse);
        expect(sendResponse).toHaveBeenCalledWith({ status: 'received' });

        onMessageCallback({ command: 'unknown' }, null, sendResponse);
        expect(sendResponse).toHaveBeenCalledWith({ status: 'error', message: 'Unknown command' });
    });


});
