class Calendar {
    constructor() {
        this.date = new Date();       // Current date (used for determining the month and year)
        this.tasks = [];              // Array to store task objects
        this.activeModal = null;      // Track the currently active modal
        this.viewMode = 'monthly';    // Default view mode
    }

    loadTasks(tasks) {
        this.tasks = tasks;
    }

    renderCalendar() {
        const monthNameElement = document.getElementById('monthName');
        const calendarDaysElement = document.getElementById('calendarDays');
        
        const currentMonth = this.date.getMonth();
        const currentYear = this.date.getFullYear();

        monthNameElement.innerText = this.date.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Clear the calendar days
        calendarDaysElement.innerHTML = '';

        // Get the first and last day of the current month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Fill in previous month's trailing days if needed
        for (let i = 0; i < firstDay; i++) {
            calendarDaysElement.innerHTML += `<div class="day empty"></div>`;
        }

        // Fill in the current month's days
        for (let day = 1; day <= lastDate; day++) {
            const fullDate = this.formatDate(currentYear, currentMonth + 1, day);
            const today = new Date();
            let classes = "day";
            const tasksForDay = this.getTasksOnDate(fullDate);

            // Check if this day has tasks
            if (tasksForDay.length > 0) {
                classes += " task-day";
            }

            // Highlight current day
            if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
                classes += " current-day";
            }

            calendarDaysElement.innerHTML += `
                <div class="${classes}" data-date="${fullDate}">
                    ${day}
                    ${tasksForDay.length > 1 ? `<div class="task-indicator">${tasksForDay.length}</div>` : ''}
                </div>`;
        }

        // Add click event listeners to day elements
        document.querySelectorAll('.day').forEach(dayElement => {
            dayElement.addEventListener('click', () => {
                const dateString = dayElement.getAttribute('data-date');
                if (dateString) {
                    this.clearExistingModal(); // Ensure only one modal is shown at a time
                    this.expandDay(dateString);
                }
            });
        });
    }

    renderWeeklyView() {
        const calendarDaysElement = document.getElementById('calendarDays');
        calendarDaysElement.innerHTML = '';
    
        const startOfWeek = this.getStartOfWeek(new Date(this.date));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
    
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    
        const weekNameElement = document.getElementById('monthName');
        weekNameElement.innerText = `${startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`;
    
        weekDates.forEach(date => {
            const fullDate = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
            const tasksForDay = this.getTasksOnDate(fullDate);
            let classes = "day weekly-view-day";
            const today = new Date();
    
            // Highlight current day
            if (date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()) {
                classes += " current-day";
            }
    
            if (tasksForDay.length > 0) {
                classes += " task-day";
            }
    
            calendarDaysElement.innerHTML += `
                <div class="${classes}" data-date="${fullDate}">
                    ${date.getDate()}
                    ${tasksForDay.length > 1 ? `<div class="task-indicator">${tasksForDay.length}</div>` : ''}
                </div>`;
        });
    
        document.querySelectorAll('.weekly-view-day').forEach(dayElement => {
            dayElement.addEventListener('click', () => {
                const dateString = dayElement.getAttribute('data-date');
                if (dateString) {
                    this.clearExistingModal();
                    this.expandDay(dateString);
                }
            });
        });
    }

    getStartOfWeek(date) {
        const dayIndex = date.getDay();
        const start = new Date(date);
        start.setDate(start.getDate() - dayIndex);
        return start;
    }

    prevMonthOrWeek() {
        if (this.viewMode === 'monthly') {
            this.date.setMonth(this.date.getMonth() - 1);
            this.renderCalendar();
        } else {
            this.date.setDate(this.date.getDate() - 7);
            this.renderWeeklyView();
        }
        this.clearExistingModal();
    }

    nextMonthOrWeek() {
        if (this.viewMode === 'monthly') {
            this.date.setMonth(this.date.getMonth() + 1);
            this.renderCalendar();
        } else {
            this.date.setDate(this.date.getDate() + 7);
            this.renderWeeklyView();
        }
        this.clearExistingModal();
    }

    hasTaskOnDate(dateString) {
        return this.tasks.some(task => task.date.split(' ')[0] === dateString);
    }

    formatDate(year, month, day) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    highlightDay(dateString) {
        currentTasks = [];
    }

    toggleTaskCompletion(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex > -1) {
            const task = this.tasks[taskIndex];
            task.complete = !task.complete; // Toggle the completion status
    
            // Update global array and save
            const globalTaskIndex = dynamicTaskArray.findIndex(globalTask => globalTask.id === taskId);
            if (globalTaskIndex > -1) {
                dynamicTaskArray[globalTaskIndex].complete = task.complete;
                saveTasksToLocalStorage(); 
            }
        } else {
            alert('Error: Task not found.');
        }
    }

    expandDay(dateString) {
        if (this.hasTaskOnDate(dateString)) {
            const tasksForDay = this.getTasksOnDate(dateString).sort((a, b) => new Date(a.date) - new Date(b.date));
            const taskList = tasksForDay.map(task => {
                const taskDateTime = new Date(task.date);
                const timeDisplay = taskDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `
                    <li class="task-item ${task.complete ? 'task-complete' : ''}" data-task-id="${task.id}">
                        <div class="task-info">
                            <strong>${timeDisplay ? timeDisplay + ' - ' : ''}${task.taskName}</strong>
                            <p>${task.taskDescription}</p>
                        </div>
                        <div class="task-actions">
                            <a href="../../html/pages/taskPage.html?taskId=${task.id}&source=calendar" class="edit-button">Edit</a>
                            <button class="delete-button" data-task-id="${task.id}">Delete</button>
                            <button class="complete-button" data-task-id="${task.id}">
                                ${task.complete ? '❌' : '✔'}
                            </button>
                        </div>
                    </li>`;
            }).join('');
            this.showTaskModal(dateString, taskList);
    
            // Completion buttons
            document.querySelectorAll('.complete-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const taskId = parseInt(event.target.getAttribute('data-task-id'), 10);
                    this.toggleTaskCompletion(taskId);
    
                    // Update modal
                    const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
                    const task = this.tasks.find(task => task.id === taskId);
                    taskItem.classList.toggle('task-complete', task.complete);
                    button.textContent = task.complete ? '❌' : '✔';
                });
            });
    
            // Delete buttons
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const taskId = parseInt(event.target.getAttribute('data-task-id'), 10);
                    this.toggleTaskCompletion(taskId);
                
                    // Update modal UI
                    const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
                    const task = this.tasks.find(task => task.id === taskId);
                    taskItem.classList.toggle('task-complete', task.complete);
                    button.textContent = task.complete ? '❌' : '✔';
                });
            });
        } else {
            alert('No tasks for this day.');
        }
    }

    showTaskModal(date, taskList) {
        this.clearExistingModal();
        const modalContent = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Tasks for ${date}</h3>
                    <button id="closeModal" class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <ul class="task-list">${taskList}</ul>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalContent);
        this.activeModal = document.querySelector('.modal');
    
        document.getElementById('closeModal').addEventListener('click', () => {
            this.clearExistingModal();
        });
    
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = parseInt(event.target.getAttribute('data-task-id'), 10);
                this.deleteTask(taskId);
                this.clearExistingModal();
                this.renderCalendar(); // Refresh after deletion
            });
        });
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
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
            this.tasks.splice(taskIndex, 1);
            dynamicTaskArray = dynamicTaskArray.filter(task => task.id !== taskId);
            saveTasksToLocalStorage();
        } else {
            alert('Error: Task not found.');
        }
    }

    clearExistingModal() {
        if (this.activeModal) {
            this.activeModal.remove();
            this.activeModal = null;
        }
    }

    getTasksOnDate(dateString) {
        return this.tasks.filter(task => task.date.split(' ')[0] === dateString);
    }
}

// Existing DOMContentLoaded logic remains as is
document.addEventListener('DOMContentLoaded', function() {
    const calendar = new Calendar();

    // Example tasks for demonstration purposes
    const exampleTasks = loadTaskInLocalStorage(); 
    
    // Load tasks into the calendar
    calendar.loadTasks(exampleTasks);

    // Render the initial calendar
    calendar.renderCalendar();

    // Set up navigation buttons
    document.getElementById('prevMonth').addEventListener('click', () => calendar.prevMonthOrWeek());
    document.getElementById('nextMonth').addEventListener('click', () => calendar.nextMonthOrWeek());

    const monthlyViewButton = document.getElementById('monthlyViewButton');
    const weeklyViewButton = document.getElementById('weeklyViewButton');

    monthlyViewButton.addEventListener('click', () => {
        calendar.viewMode = 'monthly';
        calendar.renderCalendar();
        monthlyViewButton.classList.add('active');
        weeklyViewButton.classList.remove('active');
    });

    weeklyViewButton.addEventListener('click', () => {
        calendar.viewMode = 'weekly';
        calendar.renderWeeklyView();
        weeklyViewButton.classList.add('active');
        monthlyViewButton.classList.remove('active');
    });

    // load the saved theme, must be done locally since the html page is 'refreshed' everytime the user changes pages
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${savedTheme}-theme`);
    document.getElementById("calendar-container").classList.remove('light-theme', 'dark-theme');
    document.getElementById("calendar-container").classList.add(`${savedTheme}-theme`);
    document.getElementById("buttons-container").classList.remove('light-theme', 'dark-theme');
    document.getElementById("buttons-container").classList.add(`${savedTheme}-theme`);
});

// Export Calendar for testing environments
// This won't affect the browser if `module` is not defined
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calendar;
}
