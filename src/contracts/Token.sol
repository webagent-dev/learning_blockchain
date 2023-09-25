pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token{
    using SafeMath for uint;

    string public name = 'Dapp Token';
    string public symbol = 'Dapp';
    uint256 public decimal = 18;
    uint256 public totalSupply;

// mapping
mapping(address => uint256 ) public balanceOf;

// events
event Transfer(address from, address to, uint256 value);
// constructor
    constructor () public {
        totalSupply = 1000000 * (10 ** decimal);
        balanceOf[msg.sender] = totalSupply;
    }

// transfer function
function transfer (address _to, uint256 _value) public returns (bool success){
    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    return true;
}

}