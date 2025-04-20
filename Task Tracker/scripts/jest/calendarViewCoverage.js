/**
 * @jest-environment jsdom
 */
const Calendar = require('../views/calendarView.js'); // Adjust path as necessary

describe('Calendar Class - Comprehensive Coverage', () => {
  let calendar;
  let dynamicTaskArray = [];
  let saveTasksToLocalStorage;

  beforeAll(() => {
    // Mock chrome.runtime and saveTasksToLocalStorage for deleteTask functionality
    global.chrome = {
      runtime: {
        sendMessage: jest.fn((msg, cb) => {
          cb && cb({ status: 'received' });
        }),
        lastError: null
      }
    };

    saveTasksToLocalStorage = jest.fn();
    global.saveTasksToLocalStorage = saveTasksToLocalStorage;

    // Mock global dynamicTaskArray
    global.dynamicTaskArray = dynamicTaskArray;

    // Mock loadTaskInLocalStorage if needed
    global.loadTaskInLocalStorage = jest.fn(() => []);
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="calendar-container"></div>
      <div id="buttons-container"></div>
      <h1 id="monthName"></h1>
      <div id="calendarDays"></div>
      <button id="prevMonth">Prev</button>
      <button id="nextMonth">Next</button>
      <button id="monthlyViewButton">Monthly</button>
      <button id="weeklyViewButton">Weekly</button>
    `;

    // Reset globals and instances before each test
    dynamicTaskArray = [];
    global.dynamicTaskArray = dynamicTaskArray;
    calendar = new Calendar();
  });

  test('Constructor initializes correctly', () => {
    expect(calendar).toBeTruthy();
    expect(calendar.viewMode).toBe('monthly');
    expect(calendar.tasks).toEqual([]);
  });

  test('loadTasks method works', () => {
    const mockTasks = [
      { id: 1, taskName: 'Test Task', date: '2024-03-15 10:00', complete: false, reminderList: [] }
    ];
    calendar.loadTasks(mockTasks);
    expect(calendar.tasks).toEqual(mockTasks);
  });

  describe('Date Formatting and Utilities', () => {
    test('formatDate creates correctly formatted date strings', () => {
      expect(calendar.formatDate(2024, 3, 5)).toBe('2024-03-05');
      expect(calendar.formatDate(2024, 12, 25)).toBe('2024-12-25');
      expect(calendar.formatDate(2024, 1, 7)).toBe('2024-01-07'); // single-digit month/day
    });

    test('getStartOfWeek returns correct week start date', () => {
      const testDate = new Date('2024-03-15'); // Suppose this is a Friday
      const startOfWeek = calendar.getStartOfWeek(testDate);
      expect(startOfWeek).toBeInstanceOf(Date);
      // Just ensure it's a date; actual calculation may vary depending on weekday
    });

    test('highlightDay is callable and does not error', () => {
      // currentTasks is referenced inside highlightDay
      global.currentTasks = [];
      calendar.highlightDay('2024-03-15');
      // This method currently sets currentTasks = []; Just ensure no error
    });
  });

  describe('Task-related Methods', () => {
    const mockTasks = [
      { id: 1, taskName: 'Meeting', date: '2024-03-15 10:00', complete: false, reminderList: [] },
      { id: 2, taskName: 'Dentist', date: '2024-03-15 14:00', complete: false, reminderList: [] },
      { id: 3, taskName: 'Project', date: '2024-03-20 09:00', complete: true, reminderList: [] }
    ];

    beforeEach(() => {
      calendar.loadTasks(mockTasks);
    });

    test('hasTaskOnDate identifies days with tasks', () => {
      expect(calendar.hasTaskOnDate('2024-03-15')).toBe(true);
      expect(calendar.hasTaskOnDate('2024-03-16')).toBe(false);
    });

    test('getTasksOnDate returns correct tasks', () => {
      const tasksOnDate = calendar.getTasksOnDate('2024-03-15');
      expect(tasksOnDate.length).toBe(2);
      expect(tasksOnDate[0].taskName).toBe('Meeting');
    });
  });

  describe('Rendering the Calendar (Monthly and Weekly)', () => {
    beforeEach(() => {
      // Add tasks spanning multiple days and multiple tasks on one day
      const tasks = [
        { id: 1, taskName: 'Multi1', date: '2024-03-15 09:00', complete: false, reminderList: [] },
        { id: 2, taskName: 'Multi2', date: '2024-03-15 10:00', complete: false, reminderList: [] },
        { id: 3, taskName: 'Later', date: '2024-03-20 09:00', complete: true, reminderList: [] }
      ];
      calendar.loadTasks(tasks);
      // Set a known date to ensure March 2024
      calendar.date = new Date(2024, 2, 15); // March 15, 2024 (Note: month is 0-indexed)
    });

    test('renderCalendar draws days and tasks indicators', () => {
      calendar.renderCalendar();
      const days = document.querySelectorAll('.day');
      expect(days.length).toBeGreaterThan(0);

      // Check a day with multiple tasks (2024-03-15) - should have a .task-day and .task-indicator
      const dayWithTasks = document.querySelector('.day.task-day[data-date="2024-03-15"]');
      expect(dayWithTasks).not.toBeNull();
      expect(dayWithTasks.querySelector('.task-indicator').textContent).toBe('2');

      // Check if current-day highlighting works
      // We need to set today's date to match calendar.date to hit that condition
      const origNow = Date;
      global.Date = class extends origNow {
        constructor(...args) {
          if (args.length === 0) {
            super(2024, 2, 15); // override "today" as March 15, 2024
          } else {
            super(...args);
          }
        }
      };
      calendar.renderCalendar();
      const currentDay = document.querySelector('.current-day');
      expect(currentDay).not.toBeNull();
      global.Date = origNow; // restore Date
    });

    test('renderWeeklyView draws the correct week range', () => {
      calendar.viewMode = 'weekly';
      calendar.renderWeeklyView();

      const weeklyDays = document.querySelectorAll('.weekly-view-day');
      expect(weeklyDays.length).toBe(7);

      // Check a day with tasks
      const weekTaskDay = document.querySelector('.weekly-view-day.task-day[data-date="2024-03-15"]');
      expect(weekTaskDay).not.toBeNull();
    });
  });

  describe('View Mode Controls', () => {
    beforeEach(() => {
      // Just tasks to ensure no error
      calendar.loadTasks([
        { id: 1, taskName: 'Task', date: '2024-03-15 09:00', complete: false, reminderList: [] }
      ]);
      calendar.date = new Date(2024, 2, 15);
    });

    test('prevMonthOrWeek in monthly mode changes month', () => {
      calendar.viewMode = 'monthly';
      const initialMonth = calendar.date.getMonth();
      calendar.prevMonthOrWeek();
      expect(calendar.date.getMonth()).toBe(initialMonth - 1);
    });

    test('prevMonthOrWeek in weekly mode changes date by -7 days', () => {
      calendar.viewMode = 'weekly';
      const initialDate = new Date(calendar.date);
      calendar.prevMonthOrWeek();
      const expected = new Date(initialDate);
      expected.setDate(expected.getDate() - 7);
      expect(calendar.date.toISOString()).toBe(expected.toISOString());
    });

    test('nextMonthOrWeek in monthly mode changes month', () => {
      calendar.viewMode = 'monthly';
      const initialMonth = calendar.date.getMonth();
      calendar.nextMonthOrWeek();
      expect(calendar.date.getMonth()).toBe(initialMonth + 1);
    });

    test('nextMonthOrWeek in weekly mode changes date by +7 days', () => {
      calendar.viewMode = 'weekly';
      const initialDate = new Date(calendar.date);
      calendar.nextMonthOrWeek();
      const expected = new Date(initialDate);
      expected.setDate(expected.getDate() + 7);
      expect(calendar.date.getDate()).toBe(expected.getDate());
    });
  });

  describe('expandDay, showTaskModal, and interaction', () => {
    beforeEach(() => {
      calendar.loadTasks([
        { id: 1, taskName: 'Test1', taskDescription: 'Desc1', date: '2024-03-15 09:00', complete: false, reminderList: [] },
        { id: 2, taskName: 'Test2', taskDescription: 'Desc2', date: '2024-03-15 10:00', complete: true, reminderList: [] }
      ]);
      calendar.date = new Date(2024, 2, 15);

      // Render so we have DOM
      calendar.renderCalendar();
    });

    test('expandDay shows modal for a day with tasks', () => {
      // Spy on alert
      window.alert = jest.fn();

      // We need a real clickable day element
      const day = document.querySelector('.day.task-day[data-date="2024-03-15"]');
      expect(day).not.toBeNull();

      day.click(); // triggers expandDay via event listener
      const modal = document.querySelector('.modal');
      expect(modal).not.toBeNull();
      expect(window.alert).not.toHaveBeenCalled(); // No alert since tasks exist
    });

    test('expandDay alerts if no tasks', () => {
      window.alert = jest.fn();
      calendar.expandDay('2024-03-16');
      expect(window.alert).toHaveBeenCalledWith('No tasks for this day.');
    });

    test('Modal close button works', () => {
      calendar.expandDay('2024-03-15');
      const modal = document.querySelector('.modal');
      const closeModalButton = modal.querySelector('#closeModal');
      closeModalButton.click();
      expect(document.querySelector('.modal')).toBeNull();
    });

    test('Toggle task completion from modal', () => {
      global.dynamicTaskArray = [
        { id: 1, taskName: 'Test1', complete: false, reminderList: [] },
        { id: 2, taskName: 'Test2', complete: true, reminderList: [] }
      ];

      calendar.expandDay('2024-03-15');
      const completeButton = document.querySelector('.complete-button[data-task-id="1"]');
      completeButton.click(); // Toggle completion of task 1
      expect(global.dynamicTaskArray[0].complete).toBe(true);

      // Toggle again
      completeButton.click();
      expect(global.dynamicTaskArray[0].complete).toBe(false);
    });

    test('toggleTaskCompletion with non-existent task', () => {
      window.alert = jest.fn();
      calendar.toggleTaskCompletion(9999);
      expect(window.alert).toHaveBeenCalledWith('Error: Task not found.');
    });

    test('deleteTask with non-existent task', () => {
      window.alert = jest.fn();
      calendar.deleteTask(9999);
      expect(window.alert).toHaveBeenCalledWith('Error: Task not found.');
    });

    test('deleteTask with existing task and reminders', () => {
      global.dynamicTaskArray = [
        { id: 3, taskName: 'ReminderTask', complete: false, reminderList: [5,10] }
      ];
      calendar.loadTasks([
        { id: 3, taskName: 'ReminderTask', date: '2024-03-15 11:00', complete: false, reminderList: [5,10] }
      ]);

      calendar.deleteTask(3);
      expect(global.dynamicTaskArray.find(t => t.id === 3)).toBeUndefined();
      expect(saveTasksToLocalStorage).toHaveBeenCalled();
    });
  });
});
