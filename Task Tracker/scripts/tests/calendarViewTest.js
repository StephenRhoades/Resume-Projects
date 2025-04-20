// calendarViewTest.js
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM fully loaded and parsed: calendarViewTest");
    const errors = [];

    test(testCalendarLoad, errors);
    test(testLoadTasks, errors);
    test(testNavigationButtonsMonthlyMode, errors);

    errors.forEach(e => console.error(e));
});

function testCalendarLoad() {
    // Check if monthName and calendarDays elements are present
    const monthNameElement = document.getElementById('monthName');
    const calendarDaysElement = document.getElementById('calendarDays');
    assert(monthNameElement !== null, "monthName element should exist");
    assert(calendarDaysElement !== null, "calendarDays element should exist");
    console.log("Test Calendar Load: Passed");
}

function testLoadTasks() {
    // If dynamicTaskArray or tasks are global, let's check them:
    if (typeof dynamicTaskArray === 'undefined') {
        console.log("Test Load Tasks: dynamicTaskArray not defined, skipping");
        return;
    }

    // Create a separate Calendar instance for testing tasks
    const testCalendar = new Calendar();
    dynamicTaskArray.push({
        id: 999,
        taskName: 'Test Task',
        date: '2024-03-15 10:00',
        complete: false,
        reminderList: []
    });
    testCalendar.loadTasks(dynamicTaskArray);
    assert(testCalendar.tasks.length > 0, "Should have loaded tasks into testCalendar");
    console.log("Test Load Tasks: Passed");
}

function testNavigationButtonsMonthlyMode() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    assert(prevMonthBtn !== null, "prevMonth button should exist");
    assert(nextMonthBtn !== null, "nextMonth button should exist");

    const testCalendar = new Calendar();
    testCalendar.viewMode = 'monthly';
    const initialMonth = testCalendar.date.getMonth();
    testCalendar.prevMonthOrWeek();
    // After calling prevMonthOrWeek in monthly mode, the month should shift
    assert(testCalendar.date.getMonth() !== initialMonth, "prevMonthOrWeek should change month in monthly mode");

    const newMonth = testCalendar.date.getMonth();
    testCalendar.nextMonthOrWeek();
    // After calling nextMonthOrWeek in monthly mode, the month should shift again
    assert(testCalendar.date.getMonth() !== newMonth, "nextMonthOrWeek should change month in monthly mode");

    console.log("Test Navigation Buttons Monthly Mode: Passed");
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

// Simple assert function
function assert(condition, message) {
    if (!condition) throw new Error(message);
}
