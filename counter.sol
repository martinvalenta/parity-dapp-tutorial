pragma solidity ^0.4.0;

contract Counter {
	event Voted(address indexed who, uint indexed option);

	function vote(uint _option, uint8 _v, bytes32 _r, bytes32 _s)
		only_signed(msg.sender, _v, _r, _s)
	{
		if (hasVoted[msg.sender]) throw;
		votes[_option]++;
		hasVoted[msg.sender] = true;
		Voted(msg.sender, _option);
	}

	modifier only_signed(address who, uint8 v, bytes32 r, bytes32 s) { if (ecrecover(STATEMENT_HASH, v, r, s) == who) _; else throw; }

	bytes32 constant public STATEMENT_HASH = sha3(STATEMENT);

	string constant public STATEMENT = "\x19Ethereum Signed Message:\n22I am eligible to vote!";

	mapping (uint => uint) public votes;
	mapping (address => bool) public hasVoted;
}