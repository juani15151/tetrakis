import React from "react";
import './Game.css';
import user from "./user.png";

export default class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = this.props.gameService.getState();

        this.onAttempt = this.onAttempt.bind(this);
        this.handleSurrender = this.handleSurrender.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
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

    renderBoards() {
        return Object.keys(this.state.players).map((id) => {
            const player = this.state.players[id];
            if(!player) {
                return null; // TODO: Render waiting msg.
            }
            const isUserEnabled = this.props.gameService.isPlayerEnabled(player);
            const isUserFinished = player.isFinished;

            return (
                <div
                    className={'col board-container ' + (isUserEnabled && !isUserFinished ? '' : 'disabled')}
                    key={id}
                >
                    <GameBoard
                        player={player}
                        onAttempt={this.onAttempt}
                        onSurrender={this.handleSurrender}
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
                {this.state.roomId &&
                    <p>Room ID: {this.state.roomId}</p>
                }
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
                {!player.number &&
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
                {player.number && !player.target &&
                    <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                            <p>Waiting for the other player to choose a number.</p>
                        </div>
                    </div>
                }
                {player.number && player.target &&
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
                <div className='col-12 col-lg-2'>
                    <img className="profile-picture rounded-circle" src={user}/>
                </div>
                <div className='col-12 col-lg-6 text-center text-lg-left'>
                    <div className='pl-2'>{this.renderName()}</div>
                </div>
                <div
                    className='col-12 col-lg-4 text-center text-lg-right'
                    onClick={this.props.onSurrender}
                    title="Click to surrender and reveal the target number."
                ><div className="number">{this.renderTargetNumber()}</div></div>
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