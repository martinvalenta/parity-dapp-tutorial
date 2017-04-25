import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash} from 'oo7-react';
import {formatBlockNumber, formatBalance} from 'oo7-parity';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

export class App extends React.Component {
	render() {
		return (
			<div>
				Default account:&nbsp;
				<Rspan>
					{parity.bonds.accountsInfo[parity.bonds.me].name}
				</Rspan>
				&nbsp;<Hash value={parity.bonds.me} />
				<br/>With a balance of&nbsp;
				<Rspan>
					{parity.bonds.balance(parity.bonds.me).map(formatBalance)}
				</Rspan>
			</div>
		);
	}
}
