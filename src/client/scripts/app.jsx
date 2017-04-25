import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg, RRaisedButton, ReactiveComponent} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import {TransactionProgressBadge} from 'parity-reactive-ui';
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
		this.state = { tx: null };
		this.voted = this.counter.hasVoted(parity.bonds.me);
	}
	render () {
		var votingEnabled = Bond.all([this.voted, this.state.tx]).map(([v, t]) => !v && (!t || !!t.failed));
		return (<div>
			{Options.map((n, i) => (<div key={i}><VoteOption
				label={n}
				votes={this.counter.votes(i)}
				vote={() => this.setState({tx: this.counter.vote(i)})}
				enabled={votingEnabled}
			/></div>))}
			<div style={{marginTop: '1em'}}>
				<TransactionProgressBadge value={this.state.tx}/>
			</div>
		</div>);
	}
}

class VoteOption extends ReactiveComponent {
	constructor () {
		super(['votes', 'enabled']);
	}
	readyRender () {
		var s = {float: 'left', minWidth: '3em'};
		if (!this.state.enabled)
			s.cursor = 'not-allowed';
		return (<span style={{ borderRight:
			`${1 + this.state.votes * 10}px black solid` }}>
			<a
				style={s}
				href='#'
				onClick={this.state.enabled && this.props.vote}>
				{this.props.label}
			</a>
		</span>);
	}
}
