# CS321 Task Tracker
CS 321 group 2 class project: Task Tracker Chrome Extension.

## How to install
- To run this extension, click the green button on the right half with the text "<> code" and then select download zip from the resultant dropdown. 
- You will then want to unzip the folder and ensure that the manifest.json is in the base folder. 
- You can then go to your desired browser and traverse to the manage extensions page by inputing the url "chrome://extensions" into the header. (If you are in a browser aside from chrome, this should still work but you can manually replace chrome with the name of your browser if that doesn't happen automatically.)
- You will then want to turn on developer mode if it is not already on, and click the option to load unpacked and select your unzipped folder you downloaded.
- The extension should then be among your extensions, running locally.

### Authors:
Evan Bellino,
Joseph Gery,
Bin Jiang,
Nelson Nguyen,
Giancarlo Jaramillo Rojas,
Stephen Rhoades,
David Schmidle

### Testing Using Jest:
1. Install Node.js

2. Install jest: `npm install --save-dev jest`

3. Install jsdom: `npm install --save-dev jest-environment-jsdom`

4. Make sure you are in CS321 directory when running the tests, path should look similar to this: `C:\Users\You\Documents\GitHub\CS321>`

5. Run tests: `npx jest --coverage --testMatch "<rootDir>/scripts/jest/**/*Coverage.js"`

6. If "No tests found, exiting with code 1" pops up, add or modify the dependency below into package.json file.    
    "jest": {
    "testEnvironment": "jsdom",
    "testMatch": ["<rootDir>/scripts/jest/**/*Coverage.js"],
    "collectCoverage": true
    },




### Testing Not Using Jest:
Some tests do not use jest to run. For these manual console testing is used. To run these tests:

1. Download branch as a zip and unpack.
2. Uncomment the test scripts you want to run in the top of the relevant html file and save.
3. Enter google chrome extensions and select "Load unpacked" on top left of page.
4. Select the unpacked branch file
5. Select "Task Tracker" extension.
6. Inspect the extension and review the console logging to view testing results.