## Welcome to Driver Data!

### Demo: 

To get started, click the Analyze Data Link in the main nav bar.  You can only upload txt files in the following format:

Driver Dan
Driver Lauren
Driver Kumi
Trip Dan 07:15 07:45 17.3
Trip Dan 06:12 06:32 21.8
Trip Lauren 12:01 13:16 42.0
Trip Britt 12:00 12:16 22.0

This app will generate a chart of driver data based on the file you select.  It will arrange drivers by most miles driven to least.  Note that any trip that averages a speed less than 5 mph or greater than 100 mph will be discarded.

You can click on a drivers name to see a breakdown of each trip that makes up their overall driver summary. 


This app was bootsrapped from create-react

## Tech Stack
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is deployed on [AWS S3](https://aws.amazon.com/s3/).

[MobX-State-Tree](https://github.com/mobxjs/mobx-state-tree) is bring used to handle state management 

All styling is done so by [Bulma](https://bulma.io/) and [SASS](https://sass-lang.com/)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.