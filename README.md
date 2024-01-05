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

This project consists of a client-server architecture where the server is only required to enforce the game rules on 
multiplayer games.

As an experimentation project **it aims to be over-commented** for future reference.

The front-end was built using **React.js** and can be run independently of the backend, allowing to run single-pc game modes.
It has a simple architecture with 2 components:
* The main component is the GameService (client/src/services/GameService.js) which is basically the game engine and has 
subclasses for each game mode (and any possible future modes).
* An independent secondary component is the NumbersSheet (client/src/NumbersSheet.js) which displays a board that players
can use to aid themselves during the guessing.

Error handling has been kept to a basic level only (i.e. using alerts and a few general ErrorBoundaries) as most issues 
shouldn't be possible to trigger from the standard UI.

The backend was built using **Node.js** and express for handling API endpoints, with the help of single-key encryption.

When each player chooses their number, it's encrypted and sent to the other player, then they can do guesses and the server 
can easily decrypt the number and calculate the correct and regular numbers without requiring any persistence. When doing so,
it can also uses a NotificationService (currently based on a WebSocket) to inform the other player about the progress.

## Design notes
* Game modes: This game can be expanded by adding new game modes with custom rules (e.g. different number format, time-based win)
and with different amount of players (N-Player game).
  * To prepare for this, we use a single Interface for all game modes, that can be easily extended by new modes without 
  having to override existing behavior nor refactor other modes.
* Stateful vs Stateless: As part of the experimentation, different game modes have been implemented with different patterns.
  * SinglePlayer mode communicates with the server in a completely stateless manner.
  * 2-Local Players mode is completely isolated from the server.
  * Multiplayer mode is stateful, although the server can safely use an in-memory database.
    * (!) Current implementation uses a local in-memory database, which is not shared among backend servers, which would limit horizontal escalation.
* Next steps:
  * It might be possible to make the current multiplayer mode stateless:
    * Players can store the state, but it would be signed by the server to avoid custom modifications.
    * It would need a P2P Websocket or some similar alternative.
  * The plan is to eventually move the application to the cloud (AWS).
    * Use either AWS Amplify, AWS S3 or AWS ECS + LoadBalancer for the static front-end. 
    * Use AWS Lambda for the backend of stateless game modes.
    * Use AWS Websockets APIs (API Gateway) for the stateful game mode + DynamoDB to keep rooms state.
      * Will have to add some periodic cleanup of old rooms.
    * Use AWS Route53 to register and manage a domain. 

**WARNING**: This is an experimentation project and there are security issues that won't be addressed, so only expose the Node.js 
backend on trusted networks as it can be easily circumvented to be used for remote code execution on the other player's computer.

### Technologies involved
* React.js
  * bootstrap
  * websocket
* Node.js
  * express and express-ws (for API and WebSocket)
  * crypto (for secret number encryption)
* Swagger [ToDo]
* Docker
  * nginx (for React.js production deployment) 
* ngrok (for local deployments)

## How to run

### Development
* Start the server going to /api and running `npm start` 
  * Port configuration is handled through environment variables (Work in Progress).
* To start the client first set the server paths in a client/.env file and the run `npm start` in the /client folder.

### Docker (Production)
* Run docker-compose in the root folder to build and run both frontend and backend.
  * If deployed to AWS, each Dockerfile can be deployed independently to scale as needed.
