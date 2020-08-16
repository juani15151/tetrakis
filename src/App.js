import React from 'react';
import './App.css';
import user from './user.png'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentGoesFirst: true,
            players: {
                current: {
                    name: "Juani",
                    target: "????",
                    attempts: [
                        {number: "9801", result: [1,1]},
                        {number: "9801", result: [0,1]},
                        {number: "9801", result: [1,0]},
                        {number: "9801", result: [1,1]},
                        {number: "9801", result: [1,1]},
                        {number: "9801", result: [1,1]},
                    ],
                },
                opponent: {
                    name: "Juani 2",
                    target: "2047",
                    attempts: [
                        {number: "8763", result: [1,1]},
                        {number: "8763", result: [1,1]},
                        {number: "8763", result: [1,1]},
                        {number: "8763", result: [1,1]},
                        {number: "8763", result: [1,1]},
                        {number: "8763", result: [1,1]},
                    ],
                }
            },
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row vertical-divider text-center">
                    <div className="col-6 board-container board-left">
                        <Board player={this.state.players.current}/>
                    </div>
                    <div className="col-6 board-container board-right disabled">
                        <Board player={this.state.players.opponent}/>
                    </div>
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        const player = this.props.player;
        return (
            <div>
                <div className="board">
                    <div className={'row align-items-center'}>
                        <div className='col-auto'>
                            <img className={'profile-picture rounded-circle'} src={user}/>
                        </div>
                        <div className='col-auto'>
                            <h2 className="cover-heading">{player.name}</h2>
                        </div>
                    </div>

                    <h3 className="number">{player.target}</h3>
                    <History attempts={player.attempts}/>

                    <div className="progress">
                        <div className="progress-bar bg-warning" role="progressbar" style={{width: '75%'}}
                             aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
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
                    <span className={'badge badge-pill ' + (value.result[0] > 0 ? 'badge-success' : 'disabled')}>{value.result[0]}B</span>
                    <span className={'badge badge-pill ' + (value.result[1] > 0 ? 'badge-primary' : 'disabled')}>{value.result[1]}R</span>
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

export default App;
