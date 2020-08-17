import React from 'react';
import './App.css';
import Game from './Game';
import MultiplayerGameService from './services/MultiplayerGameService';
import OnlineGameService from "./services/OnlineGameService";

export default class App extends React.Component {

    static GAME_MODES = {
        SINGLEPLAYER: 'singleplayer',
        LOCAL: 'local',
        ONLINE: 'online',
    };

    constructor(props) {
        super(props);
        this.state = {
            gameService: null,
        }

        this.handleSetGameMode = this.handleSetGameMode.bind(this);
    }

    handleSetGameMode(gameMode, roomId) {
        if (App.GAME_MODES.SINGLEPLAYER === gameMode) {

        } else if (App.GAME_MODES.LOCAL === gameMode) {
            this.setState({
                gameService: new MultiplayerGameService()
            });
        } else if (App.GAME_MODES.ONLINE === gameMode) {
            this.setState({
                gameService: new OnlineGameService(roomId)
            });
        }
    }

    render() {
        return (
            <div className="container">
                {!this.state.gameService &&
                <GameModeMenu onSetGameMode={this.handleSetGameMode}/>
                }
                {this.state.gameService &&
                <Game gameService={this.state.gameService}/>
                }
            </div>
        );
    }
}

class GameModeMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showRoomInput: false,
            roomId: "",
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSetGameMode(App.GAME_MODES.ONLINE, this.state.roomId);
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-auto text-center game-menu">
                    <h2 className="text-uppercase">Select game mode</h2>
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {this.props.onSetGameMode(App.GAME_MODES.SINGLEPLAYER)}}
                            >SinglePlayer</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {this.props.onSetGameMode(App.GAME_MODES.LOCAL)}}
                            >2 Local Players</button>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col">
                            <button
                                type="button"
                                className="btn text-nowrap"
                                onClick={() => {this.props.onSetGameMode(App.GAME_MODES.ONLINE)}}
                            >Start online match</button>
                        </div>
                        <div className={"col"}>
                            {!this.state.showRoomInput &&
                            <button
                                type="button"
                                className={"btn"}
                                onClick={() => {
                                    this.setState({showRoomInput: true})
                                }}
                            >Join online match</button>
                            }
                            {/* TODO: Focus input after click */}
                            {this.state.showRoomInput &&
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    className="form-control btn"
                                    placeholder="Match ID"
                                    value={this.state.roomId}
                                    onChange={(event => {
                                        this.setState({roomId: event.target.value})
                                    })}
                                />
                            </form>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}