import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg, RRaisedButton, ReactiveComponent} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import {TransactionProgressBadge, AccountIcon} from 'parity-reactive-ui';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

const CounterCode = '0x6060604052341561000c57fe5b5b61017c8061001c6000396000f300606060405263ffffffff60e060020a6000350416630121b93f811461003757806309eef43e1461004c5780635df813301461007c575bfe5b341561003f57fe5b61004a6004356100a1565b005b341561005457fe5b610068600160a060020a0360043516610129565b604080519115158252519081900360200190f35b341561008457fe5b61008f60043561013e565b60408051918252519081900360200190f35b600160a060020a03331660009081526001602052604090205460ff16156100c757610000565b60008181526020818152604080832080546001908101909155600160a060020a03331680855292819052818420805460ff191690911790555183927f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca491a35b50565b60016020526000908152604090205460ff1681565b600060208190529081526040902054815600a165627a7a72305820c46de129e4ce714b358b0c0e1738e16a8f312832f34d1b6458a36902b3eab7b40029';
const CounterABI = [{"constant":false,"inputs":[{"name":"_option","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"option","type":"uint256"}],"name":"Voted","type":"event"}];
const CounterCodeHash = '0xd2e1805684ab9cfe40edbe67669c7d4872ffcc69a3bb9a98f824853476b965f2';
const Options = ['Red', 'Green', 'Blue'];

export class App extends React.Component {
	constructor () {
		super();
		this.addr = new Bond;
		this.addr.then(v => {
			window.localStorage.counter = v;
			let counter = parity.bonds.makeContract(v, CounterABI);
			this.state({ tx: null, counter});
		});
		this.state = { tx: null, counter: window.localStorage.counter
			? parity.bonds.makeContract(window.localStorage.counter, CounterABI)
			: null };
		this.deploy = this.deploy.bind(this);
	}

	deploy () {
		let tx = parity.bonds.deployContract(CounterCode, CounterABI);
		this.setState({tx});
		tx.done(s => {
			this.setState({ tx: null, counter: s.deployed });
			window.localStorage.counter = s.deployed.address;
		});
	}

	render () {
		return (<div>
				{!!this.state.counter
					? <Counter contract={this.state.counter} />
					: <div>
						<RRaisedButton label='Deploy' onClick={this.deploy}/>
						<span style={{margin: '2em'}}>OR</span>
						<TextBond bond={this.addr} validator={v => v.startsWith('0x') && v.length == 42 && parity.bonds.code(v).map(_ => parity.api.util.sha3(_) == CounterCodeHash)}/>
						<TransactionProgressBadge value={this.state.tx}/>
					</div>
				}
		</div>);
	}
}

class Counter extends React.Component {
	constructor() {
		super();
		this.state = { tx: null, counter: null };
	}
	
	componentWillMount () { this.componentWillReceiveProps(this.props); }
	componentWillReceiveProps (props) {
	this.voted = this.props.contract.hasVoted(parity.bonds.me);
	this.prevVote = this.props.contract.Voted({ who: parity.bonds.me });
	this.prevVotes = this.props.contract.Voted({ who: parity.bonds.accounts });
	}

	render () {
		var votingEnabled = Bond.all([this.voted, this.state.tx]).map(([v, t]) => !v && (!t || !!t.failed));
		return (<div>
			{Options.map((n, i) => (<div key={i}><VoteOption
				label={n}
				votes={this.props.contract.votes(i)}
				vote={() => this.setState({tx: this.props.contract.vote(i)})}
				enabled={votingEnabled}
				already={this.prevVotes.map(a => a.filter(x => x.option == i).map(x => x.who))}
			/></div>))}
			<Rspan>
				{this.prevVote.map(v => v.length > 0 ? `Already voted for ${Options[v[0].option]}` : '')}
			</Rspan>
			<div style={{marginTop: '1em'}}>
				<TransactionProgressBadge value={this.state.tx}/>
			</div>
			<div style={{fontSize: 'small'}}>
				Using contract at {this.props.contract.address}.
			</div>
		</div>);
	}
}

class VoteOption extends ReactiveComponent {
	constructor () {
		super(['votes', 'enabled', 'already']);
	}
	readyRender () {
		var s = {float: 'left', minWidth: '3em'};
		if (!this.state.enabled)
			s.cursor = 'not-allowed';
		return (<span style={{ borderLeft:
			`${1 + this.state.votes * 10}px black solid` }}>
			<a
				style={s}
				href='#'
				onClick={this.state.enabled && this.props.vote}>
				{this.props.label}
			</a>
			{this.state.already.map(a => (<AccountIcon
				style={{width: '1.2em', verticalAlign: 'bottom', marginLeft: '1ex'}}
				key={a}
				address={a}
			/>))}
		</span>);
	}
}
