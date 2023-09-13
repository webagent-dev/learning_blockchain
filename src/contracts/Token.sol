
pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
 contract Token {
  using SafeMath for uint;
   // variables in smart contract
    string  public name = 'Dapp Token';
    string public symbol = 'Dapp';
    uint256 public decimals = 18;
    uint256 public totalSupply;

//mapping 
mapping(address => uint256) public balanceOf;

// contructors
    constructor() public {     
       totalSupply = 1000000 * (10 ** decimals);
       balanceOf[msg.sender] = totalSupply;
    } 
    // transfer function
    function transfer(address _to, uint256 _value) public returns (bool sucess){
      balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
      balanceOf[_to] = balanceOf[_to].add(_value);
    }
 }