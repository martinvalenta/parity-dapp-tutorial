import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg, RRaisedButton} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

export class App extends React.Component {
	constructor() {
		super();
		this.name = new Bond;
		this.recipient = parity.bonds.registry.lookupAddress(this.name, 'A');
		this.state = { current: null };
	}
	render() {
		return (
			<div>
				My balance: <Rspan>
					{parity.bonds.balance(parity.bonds.me).map(formatBalance)}
				</Rspan>
				<br />
				<TextBond bond={this.name} floatingLabelText='Name of recipient' />
				<RRaisedButton
					label={this.name.map(n => `Give ${n} 100 Finney`)}
					disabled={this.recipient.map(isNullData)}
					onClick={this.give.bind(this)}
				/>
				<Rspan>{this.state.current && this.state.current.map(JSON.stringify)}</Rspan>
			</div>
		);
	}
	give () {
	this.setState({
		current: parity.bonds.post({
			to: this.recipient,
			value: 100 * 1e15
			})
		})
	}
}
