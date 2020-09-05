import React from "react";
import './NumberSheet.css';

export default class NumbersSheet extends React.Component {

    tileRows(rowCount) {
        let rows = [];

        for (let i = 0; i < rowCount; i++) {
            rows.push(
                <tr key={"row-" + i}>
                    <th>{i}</th>
                    <Tile/>
                    <Tile/>
                    <Tile/>
                    <Tile/>
                </tr>
            );
        }

        return rows;
    }

    render() {
        let rows = this.tileRows(10);

        return (
            <table className="numbersSheet table table-striped table-bordered">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

}

class Tile extends React.Component {

    static CHARS = [null, "O", "X", "."]

    constructor(props) {
        super(props);

        this.state = {
            letterId: Tile.CHARS.length - 1
        };

        this.nextChar = this.nextChar.bind(this);
    }

    nextChar() {
        this.setState({
            // Will loop back to end when reaches 0.
            letterId: this.state.letterId - 1 || Tile.CHARS.length - 1
        });
    }

    render() {
        let currentLetter = Tile.CHARS[this.state.letterId];

        return (
            <td
                className={currentLetter === "." ? 'hide-char' : ''}
                onClick={this.nextChar}>
                {currentLetter}
            </td>
        );
    }

}