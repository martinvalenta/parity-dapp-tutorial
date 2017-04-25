import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg} from 'oo7-react';
import {formatBlockNumber, formatBalance} from 'oo7-parity';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

export class App extends React.Component {
	constructor() {
		super();
		this.bond = new Bond;
		this.GithubHint = parity.bonds.makeContract(parity.bonds.registry.lookupAddress('githubhint', 'A'), parity.api.abi.githubhint);
	}
	render() {
		return (
			<div>
				<TextBond bond={this.bond} floatingLabelText='Name' />
				<Rimg src={this.GithubHint.entries(parity.bonds.registry.lookupData(this.bond, 'IMG'))[0]} />
			</div>
		);
	}
}
