import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan} from 'oo7-react';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

export class App extends React.Component {
	constructor() {
		super();
		this.bond = new Bond();
		this.time = new TimeBond();
	}
	render() {
		return (
		<div>
			<TextBond bond={this.bond} floatingLabelText="Go ahead and type some text"/>
			<Rspan style={this.bond.map(computeColor)}>
				{Bond.all([this.bond, this.time]).map(format)}
			</Rspan>
		</div>);
	}
}
