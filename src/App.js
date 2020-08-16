import React from 'react';
import './App.css';
import user from './user.png'
import {SinglePlayerGame} from './engines/GameEngine';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.game = new SinglePlayerGame();
        this.game.initialize({
            id: 1,
            name: "Juani",
        });
        this.state = {
            players: this.game.getPlayers(),
        };
    }

    handleAttempt(playerID, attempt) {
        this.game.onAttempt(playerID, attempt);
        this.setState({
            players: this.game.getPlayers()
        });
    }

    render() {
        const boards = Object.keys(this.state.players).map((id) => {
            return (
                <div className="col board-container">
                    <Board player={this.state.players[id]} onAttempt={(attempt) => {
                        this.handleAttempt(id, attempt)
                    }}/>
                </div>
            );
        });

        return (
            <div className="container">
                <div className="row vertical-divider text-center boards-container">
                    {boards}
                </div>
            </div>
        );
    }
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userInput: "",
            hint: "####",
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
        this.setState({
            userInput: value,
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if(!this._canSubmit()) {
            return;
        }
        this.props.onAttempt(this.state.userInput);

        this.setState({
            userInput: "",
        });
        this.userInput.selectionStart = 0;
        this.userInput.selectionEnd = 0;
    }

    _canSubmit() {
        return this.state.userInput && this.state.userInput.length === 4;
    }

    onRevealTarget() {
        this.setState({
            hint: this.props.player.target
        });
    }

    render() {
        const player = this.props.player;
        return (
            <div>
                <div className="board">
                    {/* Username & Hint */}
                    <div className="row align-items-center justify-content-around">
                        <div className='col-auto'>
                            <img className="profile-picture rounded-circle" src={user}/>
                        </div>
                        <div className='col-auto'>
                            <h2 className="cover-heading">{player.name}</h2>
                        </div>
                        <div className='col-6'/>
                        <div
                            className='col-auto text-right number target-number'
                            onClick={() => {this.onRevealTarget()}}
                            title="Click to reveal the target number"
                        >{this.state.hint}</div>
                    </div>

                    {/* User input */}
                    <form onSubmit={this.handleSubmit}>
                        <div className="row justify-content-center attempt-form">
                            <div className="col-auto">
                                <input
                                    type="text"
                                    placeholder="____"
                                    className="form-control number"
                                    onChange={this.handleChange}
                                    value={this.state.userInput}
                                    ref={(number) => this.userInput = number}/>
                            </div>
                            <div className="col-auto">
                                <button type="submit" className={'btn btn-dark'} disabled={!this._canSubmit()}>Try!</button>
                            </div>
                        </div>
                    </form>

                    {/* User attemps */}
                    <History attempts={player.attempts}/>
                </div>
            </div>
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
            <ul className="numberList">
                {items}
            </ul>
        );
    }

}