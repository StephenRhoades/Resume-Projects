//Test to check if task object is empty
function testValidObject(task){
	if(task == null || Object.keys(task).length === 0){
		console.log("Invalid task object or object is empty");
		return false;
	}
	
	return true;
}

// Test to check if task name is valid
function testValidTaskName(taskName) {
    if (!taskName || typeof taskName !== 'string' || taskName.trim() === "") {
        console.log("Invalid task name:", taskName);
        return false;
    }
    return true;
}

// Test to check if task description is valid
function testValidTaskDescription(taskDesc) {
    if (!taskDesc || typeof taskDesc !== 'string' || taskDesc.trim() === "") {
        console.log("Invalid task description:", taskDesc);
        return false;
    }
    return true;
}

// Test to check if task date is valid (should be a non-empty string representing a valid date)
function testValidTaskDate(taskDate) {
    if (!taskDate || isNaN(Date.parse(taskDate))) {
        console.log("Invalid task date:", taskDate);
        return false;
    }
    return true;
}

// Test to check if task time is valid (should be a non-empty string)
function testValidTaskTime(taskTime) {
    if (!taskTime || typeof taskTime !== 'string' || taskTime.trim() === "" || tastTime.trim() > "24:00") {
        console.log("Invalid task time:", taskTime);
        return false;
    }
    return true;
}

// Combined function to validate all task input fields
function testValidateTaskData(taskName, taskDesc, taskDate, taskTime) {
    return testValidTaskName(taskName) &&
           testValidTaskDescription(taskDesc) &&
           testValidTaskDate(taskDate) &&
           testValidTaskTime(taskTime);
}

// Example: Testing invalid inputs for a task
function testAddInvalidTask() {
	const invalidTaskObject = {};
	
	if(!testValidObject(invalidTaskObject))
		console.log("Test 1: Task object is empty or null");
	else
		console.log("Test 1: Task object is not empty and not null");
	
    const invalidDate = {
        taskName: "Test Invalid Date", // Valid task name
        taskDesc: "This is a test task description",
        taskDate: "2024-12-32", // Invalid date
        taskTime: "10:00", // Valid time
    };
	
	if(!testValidObject(invalidDate))
		console.log("Test 2: Task object is empty or null");
	else
		console.log("Test 2: Task object is not empty and not null");

    let isValidDate = testValidateTaskData(
        invalidDate.taskName,
        invalidDate.taskDesc,
        invalidDate.taskDate,
        invalidDate.taskTime
    );

    if (!isValidDate) 
        console.log("Test 3: Date not valid");
    else 
        console.log("Test 3: Date is valid");
}

// Run the invalid task test
testAddInvalidTask();
