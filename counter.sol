pragma solidity ^0.4.0;

contract Counter {
	event Voted(address indexed who, uint indexed option);

	function vote(uint _option) {
		if (hasVoted[msg.sender]) throw;
		votes[_option]++;
		hasVoted[msg.sender] = true;
		Voted(msg.sender, _option);
	}

	mapping (uint => uint) public votes;
	mapping (address => bool) public hasVoted;
}