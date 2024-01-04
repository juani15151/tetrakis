# Tetrakis

This is the digitalization of the paper game "Tetrakis" done as a way to experiment with technologies and with user to 
user interactions.

## Game rules
* Both players start by choosing a 4 digit secret number, each digit should be unique (non-repeteable).
* Now each player has to guess the number of the other one. On each round a player sends a guess, 
and the other player will respond with the amount of (C)orrect / *"(B)ien"* digits and 
the amount of (R)egular digits in the guess.
  * A Regular digit occurs when the digit of the guess number is present in the secret number, in any position, e.g. 
  secret 4567 and guess 1234 will produce 1 Regular (the number 4).   
  * A Correct digit is a regular digit that also is in the same position, e.g. secret 7654 and guess 1234 have 
  will produce 1 Correct digit (the number 4).
  * (i) Players know the amount of Correct and Regular, but they don't know which digits of their guess are the corrects, regulars, or not present.
* The game ends when a player correctly guesses all 4 digits of the opponent in the correct order (4 Corrects), the player
with the lower amount of guesses wins.

## About the project

This project consists of a client-server architecture where the server is only required to enforce the game rules on multiplayer games.

As an experimentation project **it aims to be over-commented** for future reference.

The front-end was built using **React.js** and can be run independently of the backend, allowing to run single-pc game modes.
It has a simple architecture with 2 components:
* The main component is the GameService (client/src/services/GameService.js) which is basically the game engine and has 
subclasses for each game mode done (and any possible future modes).
* An independent secondary component is the NumbersSheet (client/src/NumbersSheet.js) which displays a board that players
can use to aid themselves during the guessing.

Error handling has been kept to a basic level only (i.e. using alerts) as most issues shouldn't be possible to trigger from the standard UI.

The backend was built using **Node.js** and the objective is to keep it completely stateless (and possibly moved from Node.js 
to AWS Lambda or similar).

When each player chooses their number, it's encrypted and sent to the other player, then they can do guesses and the server 
can easily decrypt the number and calculate the correct and regular numbers without requiring any persistence. When doing so,
it can also uses a NotificationService (currently based on a WebSocket) to inform the other player about the progress.

**WARNING**: This is an experimentation project and there are security issues that won't be addressed, so only expose the Node.js 
backend on trusted networks as it can be easily circumvented to be used for remote code execution on the other player's computer.

### Technologies involved
* React.js
* Websockets
* Bootstrap
* Node.js
  * express and express-ws (for API and WebSocket)
  * crypto (for secret number encryption)
* Swagger [ToDo]
* Docker [ToDo]
* ngrok (for local deployments)

## How to run

### Development
* Start the server going to /api and running `npm start` 
  * Port configuration is handled through environment variables (Work in Progress).
* To start the client first set the server paths in a client/.env file and the run `npm start` in the /client folder.


### Docker
* [ToDo]


----
Original bundle data, kept until docker setup is done.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
