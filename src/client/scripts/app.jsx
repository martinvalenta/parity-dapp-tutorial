import {Bond, TimeBond} from 'oo7';
import {TextBond, Rspan, Hash, HashBond, Rimg, RRaisedButton, ReactiveComponent} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData} from 'oo7-parity';
import {TransactionProgressBadge, AccountIcon} from 'parity-reactive-ui';
import React from 'react';
import styles from "../style.css";

const computeColor = t => t.match(/^[0-9]+$/) ? {color: 'red'} : {color: 'black'}
const format = ([msg, t]) => `${new Date(t)}: ${msg}`

const CounterCode = '0x6060604052341561000c57fe5b5b6102748061001c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630121b93f1461005157806309eef43e146100715780635df81330146100bf575bfe5b341561005957fe5b61006f60048080359060200190919050506100f3565b005b341561007957fe5b6100a5600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610210565b604051808215151515815260200191505060405180910390f35b34156100c757fe5b6100dd6004808035906020019091905050610230565b6040518082815260200191505060405180910390f35b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561014a57610000565b60006000828152602001908152602001600020600081548092919060010191905055506001600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550803373ffffffffffffffffffffffffffffffffffffffff167f4d99b957a2bc29a30ebd96a7be8e68fe50a3c701db28a91436490b7d53870ca460405180905060405180910390a35b50565b60016020528060005260406000206000915054906101000a900460ff1681565b600060205280600052604060002060009150905054815600a165627a7a723058202cccc8011e9ec04f9987c54d8513d9f68a40e75c746013ea9cc7ff1e36f4ffb40029';
const CounterABI = [{"constant":false,"inputs":[{"name":"_option","type":"uint256"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hasVoted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":true,"name":"option","type":"uint256"}],"name":"Voted","type":"event"}];
const Options = ['Red', 'Green', 'Blue'];

export class App extends React.Component {
	constructor () {
		super();
		this.state = { tx: null, counter: null };
		this.deploy = this.deploy.bind(this);
	}

	deploy () {
		let tx = parity.bonds.deployContract(CounterCode, CounterABI);
		this.setState({tx});
		tx.done(s => this.setState({ counter: s.deployed }));
	}

	render () {
		return (<div>
				{!!this.state.counter
					? <Counter contract={this.state.counter} />
					: <div>
						<RRaisedButton label='Deploy' onClick={this.deploy}/>
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
