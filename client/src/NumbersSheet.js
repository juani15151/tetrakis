import React from "react";
import './NumberSheet.css';

/**
 * Independent component that lets user mark numbers to aid him in the guessing logic.
 * e.g. When player thinks a digit is not present, they can put "X" on the entire row for that digit.
 *
 * A table that has all possible digits and positions, then lets the player cycle through "marks" for each combination.
 */
export default class NumbersSheet extends React.Component {

    tileRows(rowCount) {
        return Array.from({length: rowCount}, (_, index) => {
           return (<TileRow header={index}/>);
        });
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

class TileRow extends React.Component {

    static CHARS = [null, "O", "X", "."]
    constructor(props) {
        super(props);

        const lastCharId = TileRow.CHARS.length - 1;
        this.rowSize = props.rowSize || 4;

        this.state = {
            valuesByTile: Array(this.rowSize).fill(lastCharId)
        };

        this.header = props.header;
        this.nextChar = this.nextChar.bind(this);
    }

    nextChar(tilePosition) {
        let valuesByTile;
        if (typeof tilePosition !== "number") {
            const firstValueId = this.state.valuesByTile[0];
            console.log("First value is " + firstValueId);
            valuesByTile = Array(this.rowSize).fill(firstValueId - 1 || TileRow.CHARS.length - 1);
        } else {
            valuesByTile = this.state.valuesByTile.map((letterId, position) => {
                return position === tilePosition
                    ? letterId - 1 || TileRow.CHARS.length - 1 // Reverse iteration that goes back to end when reaching zero.
                    : letterId;
            });
        }

        this.setState({
            valuesByTile: valuesByTile
        });
    }
    render() {
        const tiles = Array(this.rowSize).fill(1).map((_, index) => {
            const value = TileRow.CHARS[this.state.valuesByTile[index]];
            return (
                <td
                    className={"tile " + (value === "." ? 'hide-char' : '')}
                    onClick={this.nextChar.bind(this, index)}>
                    {value}
                </td>
            )
        })
        return (
            <tr>
                { /* Clicking on the column header triggers the 'click' action on all tiles of the row */ }
                <th className="tile" onClick={this.nextChar.bind(this, null)}>{this.header}</th>
                {tiles}
            </tr>
        );
    }
}