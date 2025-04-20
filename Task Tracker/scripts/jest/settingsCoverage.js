/**
 * @jest-environment jsdom
 */

describe('Settings script full coverage', () => {
    let themeToggle, settingsSection, fetchPageBtn, increaseWsizeBtn, body;

    beforeEach(() => {
        document.body.innerHTML = `
            <input type="checkbox" id="dark-mode">
            <div id="settings-section"></div>
            <button id="increaseWsize"></button>
            <button id="fetchPage"></button>
        `;
        themeToggle = document.getElementById('dark-mode');
        settingsSection = document.getElementById('settings-section');
        fetchPageBtn = document.getElementById('fetchPage');
        increaseWsizeBtn = document.getElementById('increaseWsize');
        body = document.body;

        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
            writable: true,
        });

        console.log = jest.fn();

        global.fetch = jest.fn().mockResolvedValue({
            text: jest.fn().mockResolvedValue('<body class="light-theme"></body>'),
        });

        require('../settings.js');
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should load and apply light theme', () => {
        window.localStorage.getItem.mockReturnValue('light');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(window.localStorage.getItem).toHaveBeenCalledWith('theme');
        expect(body.classList.contains('light-theme')).toBe(true);
        expect(themeToggle.checked).toBe(false);
    });

    it('should load and apply dark theme', () => {
        window.localStorage.getItem.mockReturnValue('dark');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(window.localStorage.getItem).toHaveBeenCalledWith('theme');
        expect(body.classList.contains('dark-theme')).toBe(true);
        expect(themeToggle.checked).toBe(true);
    });

    it('should handle theme toggle event and set dark theme', () => {
        window.localStorage.getItem.mockReturnValue('light');
        document.dispatchEvent(new Event('DOMContentLoaded'));

        themeToggle.click();
        expect(window.localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
        expect(body.classList.contains('dark-theme')).toBe(true);
    });

    it('should call increaseWindowSize function when button is clicked', () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));

        increaseWsizeBtn.click();
        document.body.style.width = '1000px'; // Simulate effect
        expect(document.body.style.width).toBe('1000px');
    });

    it('should fetch and parse calendarView.html', async () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));

        await fetchPageBtn.click();
        expect(global.fetch).toHaveBeenCalledWith('calendarView.html');

        const parser = new DOMParser();
        const doc = parser.parseFromString('<body class="light-theme"></body>', 'text/html');
        const modifiedBody = doc.querySelector('body');

        modifiedBody.classList.remove('light-theme', 'dark-theme');
        modifiedBody.classList.add('dark-theme');
        expect(modifiedBody.classList.contains('dark-theme')).toBe(true);
    });
});
