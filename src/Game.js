import React from "react";
import './Game.css';
import user from "./user.png";

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: {
                1: this._newPlayer(1),
                2: this._newPlayer(2),
            },
        };

        this.handleAttempt = this.handleAttempt.bind(this);
        this.handleSurrender = this.handleSurrender.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
    }

    _newPlayer(id) {
        return {
            id: id,
            name: "Player " + id,
            number: null,
            target: null,
            attempts: [],
            isPlaying: false,
            isFinished: false,
        }
    }

    handleAttempt(playerID, attempt) {
        if (!this._isValidNumber(attempt) || this.state.players[playerID].isFinished) {
            return;
        }

        const result = this._checkNumber(attempt, this.state.players[playerID].target);

        const players = JSON.parse(JSON.stringify(this.state.players));
        players[playerID].attempts.push({
            number: attempt,
            result: result,
        });
        players[playerID].isFinished = result[0] === 4;

        // Change turn to next player
        const playingOpponent = Object.values(players)
            .find(player => player.id !== playerID && !player.isFinished);
        if(playingOpponent) {
            players[playerID].isPlaying = false;
            playingOpponent.isPlaying = true;
        }

        this.setState({
            players: players
        });
    }

    _generateNumber() {
        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let number = "";
        for (let i = 0; i < 4; i++) {
            const digitIndex = Math.floor(Math.random() * validDigits.length);
            number += validDigits[digitIndex];
            validDigits.splice(digitIndex, 1);
        }

        return number;
    }

    _isValidNumber(number) {
        if (number.length !== 4) {
            return false;
        }

        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        for (let i = 0; i < 4; i++) {
            const digit = number[i];
            const digitIndex = validDigits.findIndex((element) => element === digit);
            if (digitIndex < 0) {
                return false;
            }
            validDigits.splice(digitIndex, 1);
        }

        return true;
    }

    _checkNumber(attempt, target) {
        const result = [0, 0];

        for (let i = 0; i < 4; i++) {
            const attemptDigit = attempt[i];
            for (let j = 0; j < 4; j++) {
                const targetDigit = target[j];
                if (attemptDigit === targetDigit) {
                    if (i === j) {
                        result[0]++;
                    } else {
                        result[1]++;
                    }
                }
            }
        }

        return result;
    }

    handleSurrender(playerID) {
        const players = JSON.parse(JSON.stringify(this.state.players));
        players[playerID].isFinished = true;

        this.setState({
            players: players
        });
    }

    handleNameChange(playerID, newName) {
        // TODO: Validate is empty.
        const players = JSON.parse(JSON.stringify(this.state.players));
        players[playerID].name = newName;

        this.setState({
            players: players
        });
    }

    handleNumberChange(playerID, newNumber) {
        // TODO: Validate is empty.
        const players = JSON.parse(JSON.stringify(this.state.players));

        Object.values(players).forEach(player => {
            if(player.id === playerID) {
                player.number = newNumber;
                player.isPlaying = false;
            } else {
                player.target = newNumber;
                player.isPlaying = true;
            }
        });

        this.setState({
            players: players
        });
    }

    renderBoards() {
        return Object.keys(this.state.players).map((id) => {
            const player = this.state.players[id];
            const isUserEnabled =  !player.name
                || !player.number
                || (player.target && player.isPlaying);
            const isUserFinished = player.isFinished;

            return (
                <div className={'col board-container ' + (isUserEnabled && !isUserFinished ? '' : 'disabled')}>
                    <GameBoard
                        player={player}
                        onAttempt={this.handleAttempt}
                        onSurrender={this.handleSurrender}
                        onNameChange={this.handleNameChange}
                        onNumberChange={this.handleNumberChange}
                        enabled={isUserEnabled && !isUserFinished}
                    />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container game-container">
                <div className="row text-center">
                    {this.renderBoards()}
                </div>
            </div>
        );
    }
}

class GameBoard extends React.Component {

    render() {
        const player = this.props.player;
        return(
            <div className={'board'}>
                <GameBar
                    player={player}
                    onSurrender={() => this.props.onSurrender(player.id)}
                    onNameChange={this.props.onNameChange}
                />
                {this.props.enabled && player.name && !player.number &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <p title="Your opponent will have to guess it">Set your number</p>
                            <NumberInput onSubmit={(number) => this.props.onNumberChange(player.id, number)}/>
                            {/* TODO: Allow user to choose a random number. */}
                        </div>
                    </div>
                }
                {!this.props.enabled && player.name && player.number && !player.target &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <p>Waiting for the other player to choose a number.</p>
                        </div>
                    </div>
                }
                {player.name && player.number && player.target &&
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
            </div>
        );
    }

}

class GameBar extends React.Component {

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
        if(!this.props.player.target) {
            return "____";
        } else if(!this.props.player.isFinished) {
            return "####";
        } else {
            return this.props.player.target;
        }
    }

    renderName() {
        if(this.props.player.name) {
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
                <div className='col-2'>
                    <img className="profile-picture rounded-circle" src={user}/>
                </div>
                <div className='col-6 text-left'>
                    <div className='pl-2'>{this.renderName()}</div>
                </div>
                <div
                    className='col-4 text-right number target-number'
                    onClick={this.props.onSurrender}
                    title="Click to surrender and reveal the target number."
                >{this.renderTargetNumber()}</div>
            </div>
        );
    }

}

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
                />
            </form>
        );
    }

}

class History extends React.Component {

    render() {
        const items = this.props.attempts.map((value, index) => {
            return (
                <li key={index} className="number">
                    {value.number}
                    <span
                        className={'badge badge-pill ' + (value.result[0] > 0 ? 'badge-success' : 'disabled')}>{value.result[0]}B</span>
                    <span
                        className={'badge badge-pill ' + (value.result[1] > 0 ? 'badge-primary' : 'disabled')}>{value.result[1]}R</span>
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