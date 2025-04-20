/**
 * @jest-environment jsdom
 */

describe('openView.js full coverage', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="add-task-section"></div>
            <div id="buttons-container"></div>
            <div id="task-recur">
                <div class="anchor"></div>
            </div>
            <form id="myForm">
                <input id="task-name" type="text" />
            </form>
        `;

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn().mockReturnValue('light'),
                setItem: jest.fn(),
            },
            writable: true,
        });

        Object.defineProperty(window, 'location', {
            value: {
                search: '?task=SampleTask',
            },
            writable: true,
        });

        console.log = jest.fn();

        // Load the script (to simulate DOMContentLoaded)
        require('../views/openView.js');
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should call initializeOpenView on DOMContentLoaded', () => {
        const initializeOpenView = jest.fn();
        document.addEventListener('DOMContentLoaded', initializeOpenView);
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(initializeOpenView).toHaveBeenCalled();
    });

    it('should load the saved theme and apply it', () => {
        const theme = 'dark';
        window.localStorage.getItem.mockReturnValue(theme);

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(window.localStorage.getItem).toHaveBeenCalledWith('theme');
        expect(document.body.classList.contains(`${theme}-theme`)).toBe(true);
        expect(document.getElementById('add-task-section').classList.contains(`${theme}-theme`)).toBe(true);
        expect(document.getElementById('buttons-container').classList.contains(`${theme}-theme`)).toBe(true);
    });

    it('should reset the form fields on page load', () => {
        const form = document.getElementById('myForm');
        const resetSpy = jest.spyOn(form, 'reset');

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(resetSpy).toHaveBeenCalled();
    });

    it('should prefill the task field from query parameters', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));

        const taskNameInput = document.getElementById('task-name');

        expect(taskNameInput.value).toBe('SampleTask');
    });

    it('should not prefill the task field if query parameter is missing', () => {
        window.location.search = '';
        document.dispatchEvent(new Event('DOMContentLoaded'));

        const taskNameInput = document.getElementById('task-name');

        expect(taskNameInput.value).toBe('');
    });
});
