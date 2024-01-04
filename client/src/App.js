import React from 'react';
import './App.css';
import Game from './Game';
import MultiplayerGameService from './services/MultiplayerGameService';
import OnlineGameService from "./services/OnlineGameService";
import ErrorBoundary from "./utils/ErrorBoundary";
import SinglePlayerOnlineService from "./services/SinglePlayerOnlineService";

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
        this.handleExit = this.handleExit.bind(this);
    }

    handleSetGameMode(gameMode, roomId) {
        if (App.GAME_MODES.SINGLEPLAYER === gameMode) {
            this.setState({
                gameService: new SinglePlayerOnlineService()
            });
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

    handleExit() {
        if(this.state.gameService) {
            this.state.gameService.destroy();
            this.setState({
                gameService: null,
            })
        }
    }

    render() {
        return (
            <div>
                <ErrorBoundary>
                    {!this.state.gameService &&
                    <GameModeMenu onSetGameMode={this.handleSetGameMode}/>
                    }
                    {this.state.gameService &&
                    <Game
                        gameService={this.state.gameService}
                        onExit={this.handleExit}
                    />
                    }
                </ErrorBoundary>
            </div>
        );
    }
}

class GameModeMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuPosition: "root", // "root" / "local" / "online"
            showRoomInput: false,
            roomId: "",
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJoinRoomClick = this.handleJoinRoomClick.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSetGameMode(App.GAME_MODES.ONLINE, this.state.roomId);
    }

    handleJoinRoomClick() {
        this.setState({showRoomInput: true});
    }

    goTo(position) {
        this.setState({
            menuPosition: position || "root"
        });
    }

    render_root() {
        return (
            <div className="row justify-content-around">
                <div className="col-6">
                    <button
                        type="button"
                        className="btn text-nowrap w-100"
                        onClick={() => this.goTo("local")}
                    >Local</button>
                </div>
                <div className="col-6">
                    <button
                        type="button"
                        className="btn text-nowrap w-100"
                        onClick={() => this.goTo("online")}
                    >Online</button>
                </div>
            </div>
        )
    }

    render_local() {
        return (
            <div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <button
                            type="button"
                            className="btn w-100"
                            onClick={() => {this.props.onSetGameMode(App.GAME_MODES.SINGLEPLAYER)}}
                        >1 Player</button>
                    </div>
                </div>
                <div className="row mt-3 justify-content-center">
                    <div className="col-12">
                        <button
                            type="button"
                            className="btn w-100"
                            onClick={() => {this.props.onSetGameMode(App.GAME_MODES.LOCAL)}}
                        >2 Players</button>
                    </div>
                </div>
                <hr className="mt-3"/>
                <div className="row justify-content-center">
                    <div className="col-8">
                        <button
                            type="button"
                            className="btn w-100"
                            onClick={() => {this.goTo()}}
                        >Back</button>
                    </div>
                </div>
            </div>
        );
    }

    render_online() {
        return (
            <div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        <button
                            type="button"
                            className="btn text-nowrap w-100"
                            onClick={() => {this.props.onSetGameMode(App.GAME_MODES.ONLINE)}}
                        >Create game</button>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row mt-3 justify-content-center">
                        <div className="col-7 col-sm-8">
                                <input
                                    className="form-control btn"
                                    placeholder="Enter code"
                                    value={this.state.roomId}
                                    onChange={(event => {
                                        this.setState({roomId: event.target.value})
                                    })}
                                    autoFocus={true}
                                />
                        </div>
                        <div className="col-5 col-sm-4">
                            <input
                                className="btn w-100"
                                type="submit"
                                value="Join"
                                disabled={!this.state.roomId}
                            />
                        </div>
                    </div>
                </form>
                <hr className="mt-3"/>
                <div className="row justify-content-center">
                    <div className="col-8">
                        <button
                            type="button"
                            className="btn w-100"
                            onClick={() => {this.goTo()}}
                        >Back</button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div className="col-auto text-center game-menu">
                    <h2 className="text-uppercase">Select game mode</h2>
                    {this["render_" + this.state.menuPosition]()}
                </div>
            </div>
        );
    }
}