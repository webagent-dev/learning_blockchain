pragma solidity ^0.5.0;

 contract Token {
   // variables in smart contract
    string  public name = 'Dapp Token';
    string public symbol = 'Dapp';
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() public {
      totalSupply = 1000000 * (10 ** decimals);
    }
 }