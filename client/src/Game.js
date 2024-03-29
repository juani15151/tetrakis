import React from "react";
import './Game.css';
import user from "./images/user.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ErrorBoundary from "./utils/ErrorBoundary";
import NumbersSheet from "./NumbersSheet";

/**
 * The main component once a game mode has been selected, it wraps everything in the UI and connects to the GameService.
 */
export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.props.gameService.getState();

        this.onAttempt = this.onAttempt.bind(this);
        this.handleSurrender = this.handleSurrender.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handlePlayAgain = this.handlePlayAgain.bind(this);
    }

    componentDidMount() {
        const scope = this;
        this.stateListener = this.props.gameService.registerStateListener((state) => {
            scope.setState(state);
        });
    }

    componentWillUnmount() {
        this.props.gameService.removeStateListener(this.stateListener);
    }

    onAttempt(playerID, attempt) {
        this.props.gameService.actionAttempt(playerID, attempt);
    }

    handleSurrender(playerID) {
        this.props.gameService.actionSurrender(playerID);
    }

    handleNumberChange(playerID, newNumber) {
        this.props.gameService.actionSetNumber(playerID, newNumber);
    }

    handlePlayAgain(playerID) {
        this.props.gameService.actionPlayAgain(playerID);
    }

    getTitle() {
        if(this.state.roomId) {
            return "Game code: " + this.state.roomId;
        } else {
            return "Local Game";
        }
    }

    playerFoundNumber(player) {
        return player.isFinished
            && player.attempts.slice(-1)[0].result[0] === 4; // Last attempt found.
    }

    playerWon(player, opponent) {
        return this.playerFoundNumber(player)
            && (!opponent
                || (opponent.isFinished && !this.playerFoundNumber(opponent))
                || opponent.attempts.length > player.attempts.length
            );
    }

    renderBoard(playerID) {
        const player = this.state.players[playerID];
        const opponent = this.props.gameService.getOpponent(player);
        if (!player) {
            return null; // TODO: Render waiting msg.
        }
        const isUserEnabled = this.props.gameService.isPlayerEnabled(player);
        const isLocalPlayer = this.props.gameService.isLocalPlayer(player);
        const isUserFinished = player.isFinished;

        return (
            <div className="row">
                <div
                    className={'board-container '
                        + (isLocalPlayer ? 'col-8 ' : 'col-12 ')
                        + (this.playerWon(player, opponent) ? 'winner '
                                : isUserEnabled && !isUserFinished ? '' : 'disabled '
                        )}
                >
                    <GameBoard
                        player={player}
                        opponent={opponent}
                        onAttempt={this.onAttempt}
                        onSurrender={this.handleSurrender}
                        onNumberChange={this.handleNumberChange}
                        onPlayAgain={this.handlePlayAgain}
                        enabled={isUserEnabled && !isUserFinished}
                    />
                </div>
                {isLocalPlayer &&
                <div className="col-4 p-0">
                    <NumbersSheet/>
                </div>
                }
            </div>
        );
    }

    render() {
        let playerIDs = Object.keys(this.state.players);

        // Current game modes allow up to 2 players, but it might be extended with new modes.
        let playerBoards = playerIDs.map(playerID => (
            <div className={playerIDs.length > 1 ? "col-6" : "col-12"}>
                {this.renderBoard(playerID)}
            </div>
        ));

        return (
            <div className="container game-container">
                <GameBar
                    title={this.getTitle()}
                    onExit={this.props.onExit}
                />
                <ErrorBoundary>
                    <div className="row text-center">
                        {playerBoards}
                    </div>
                </ErrorBoundary>
            </div>
        );
    }
}

/**
 * A top bar visible during gameplay.
 *
 * It displays game mode title and allows to exit the game at any time.
 */
class GameBar extends React.Component {
    render() {
        return (
            <div className="row game-bar">
                <div className="col-2 d-none d-sm-block">

                </div>
                <div className="col text-left text-sm-center">
                    {this.props.title}
                </div>
                <div className="col-2 text-right">
                    <FontAwesomeIcon icon={faTimesCircle} onClick={this.props.onExit} className="cursor-pointer"/>
                </div>
            </div>
        );
    }
}

/**
 * The board where each player takes guesses and sees the results.
 */
class GameBoard extends React.Component {

    render() {
        const player = this.props.player;
        return(
            <div className="board p-1 p-sm-2">
                <BoardBar
                    player={player}
                    opponent={this.props.opponent}
                    onSurrender={() => this.props.onSurrender(player.id)}
                    onNameChange={this.props.onNameChange}
                />
                {player.isBot &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto alert alert-info">
                            Waiting for another player to connect...
                        </div>
                    </div>
                }
                {!player.isBot && !player.number &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <p title="Your opponent will have to guess it">Set your number</p>
                            <NumberInput
                                onSubmit={(number) => this.props.onNumberChange(player.id, number)}
                                disabled={!this.props.enabled}
                            />
                            {/* TODO: Allow user to choose a random number. */}
                        </div>
                    </div>
                }
                {!player.isBot && player.number && !player.target &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto alert alert-info">
                            Waiting for the other player to choose a number...
                        </div>
                    </div>
                }
                {!player.isBot && player.number && player.target &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <p>Guess the number</p>
                            <NumberInput
                                onSubmit={(number) => this.props.onAttempt(player.id, number)}
                                disabled={!this.props.enabled}
                            />
                        </div>
                    </div>
                }
                <History attempts={player.attempts}/>
                {player.isFinished &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-8">
                            <button
                                type="button"
                                className="btn w-100"
                                onClick={() => this.props.onPlayAgain(player.id)}
                                disabled={player.wantsReplay}
                            >Play Again</button>
                        </div>
                    </div>
                }
            </div>
        );
    }

}

/**
 * Displays player information (avatar, name, secret number).
 */
class BoardBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            usernameInput: "",
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({
            usernameInput: event.target.value
        });
    }

    handleUsernameSubmit(event) {
        event.preventDefault();
        if(this.state.usernameInput) {
            this.props.onNameChange(this.props.player.id, this.state.usernameInput);
        }
    }

    renderTargetNumber() {
        if (this.props.opponent && this.props.opponent.isFinished) {
            return this.props.player.number;
        } else if (this.props.player.number) {
            return "####";
        } else {
            return "____";
        }
    }

    renderName() {
        if (this.props.player.name) {
            return <h2 className="cover-heading">{this.props.player.name}</h2>;
        } else {
            return (
                <form onSubmit={this.handleUsernameSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={this.handleUsernameChange}
                        value={this.state.usernameInput}
                    />
                </form>
            );
        }
    }

    render() {
        return (
            <div className="row align-items-center justify-content-around">
                <div className="col-12 col-xl-8">
                    <div className="row align-items-center">
                        <div className='col-12 col-lg-4'>
                            <img className="profile-picture rounded-circle" src={user}/>
                        </div>
                        <div className='col-12 col-lg-8 text-center'>
                            <div className="row">
                                <div className='col'>{this.renderName()}</div>
                            </div>
                            <div className="row">
                                <div className="col number">{this.renderTargetNumber()}</div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

/**
 * A number input that validates the number against the game rules and prevents the user from writing invalid ones.
 *
 * TODO: Validate the number against the GameService to allow custom digit-format rules.
 */
class NumberInput extends  React.Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.state = {
            userText: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        // Validate
        if(value.length > 4) {
            return;
        }

        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        for(let i = 0; i < value.length; i++) {
            const digit = value[i];
            const digitIndex = validDigits.findIndex((element) => element === digit);
            if (digitIndex < 0) {
                return;
            }
            validDigits.splice(digitIndex, 1);
        }

        // New value is valid
        // TODO: Keep the placeholder chars.
        this.setState({
            userText: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if(!this.state.userText || this.state.userText.length !== 4) {
            return;
        }
        const userText = this.state.userText;
        this.setState({
            userText: "",
        });
        this.inputRef.current.selectionStart = 0;
        this.inputRef.current.selectionEnd = 0;

        this.props.onSubmit(userText);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="____"
                    className="form-control number"
                    onChange={this.handleChange}
                    value={this.state.userText}
                    ref={this.inputRef}
                    disabled={this.props.disabled}
                    autoFocus={true}
                />
            </form>
        );
    }

}

/**
 * A list with all the player guess attempts and their result.
 */
class History extends React.Component {

    render() {
        const items = this.props.attempts.map((value, index) => {
            return (
                <li key={index} className="number">
                    {value.number}
                    <span
                        className={'badge badge-pill ' + (value.result[0] > 0 ? 'badge-success' : 'badge-secondary')}>{value.result[0]}B</span>
                    <span
                        className={'badge badge-pill ' + (value.result[1] > 0 ? 'badge-primary' : 'badge-secondary')}>{value.result[1]}R</span>
                </li>
            );
        });

        return (
            <div className="row justify-content-center history">
                <div className="col">
                    <ul>
                        {items}
                    </ul>
                </div>
            </div>
        );
    }

}