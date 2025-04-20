document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed: settings");

    const themeToggle = document.getElementById('dark-mode');
    const body = document.body;

    // Load the saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    console.log("Theme was saved as: "+savedTheme);
    if (savedTheme == 'light'){
        document.getElementById("dark-mode").checked = false;
    } else {
        document.getElementById("dark-mode").checked = true;
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
        console.log(body.classList)
        let newTheme;
        if (currentTheme == 'dark'){
            newTheme = 'light';
        } else {
            newTheme = 'dark'
        }
        console.log("setting theme to: "+newTheme);
        // Save the new theme to localStorage
        localStorage.setItem('theme', newTheme);
    
        // Apply the new theme
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        body.classList.remove('light-theme', 'dark-theme');
        body.classList.add(`${theme}-theme`);
        document.getElementById("settings-section").classList.remove('light-theme', 'dark-theme');
        document.getElementById("settings-section").classList.add(`${theme}-theme`);
    }


    document.getElementById('increaseWsize')?.addEventListener('click', function(event) {
        increaseWindowSize(event);
    });



    document.getElementById('fetchPage').addEventListener('click', async () => {
        const response = await fetch('calendarView.html');
        const htmlText = await response.text();

        // Step 2: Parse the HTML string into a document
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Step 3: Modify the document
        const body = doc.querySelector('body');
        if (body) {
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(`dark-theme`);
        }
    });
});



function increaseWindowSize(){
    document.body.style.width = "1000px";
}

