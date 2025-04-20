
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function test(func, errors) {
    try {
        func();
    } catch (e) {
       errors.push(e);
    }
}
