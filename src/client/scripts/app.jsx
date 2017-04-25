import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg, RRaisedButton} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

const CounterABI = [{"constant":false,"inputs":[{"name":"_option","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"option","type":"uint256"}],"name":"Voted","type":"event"}];
const Options = ['Red', 'Green', 'Blue'];

export class App extends React.Component {
	constructor() {
		super();
		this.counter = parity.bonds.makeContract('0x83d85eEB38A2dC37EAc0239c19b343a7653d8F79', CounterABI);

	}
	render () {
		return (<div>
			{Options.map((n, i) => (<div key={i}>
				<Rspan style={{
					borderRight: this.counter
						.votes(i)
						.map(v => `${1 + v * 10}px black solid`)
				}}>
					<span style={{float: 'left', minWidth: '3em'}}>
						{n}
					</span>
				</Rspan>
			</div>))}
		</div>);
	}
}
