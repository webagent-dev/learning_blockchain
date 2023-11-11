// what to do in this exchange

// Deposit & withdraw funds
// manage orders - make or cancel
//  handle trade - charge fees

// TODO
// [ ] Set the fee account
//[ ] Deposit Ether
// [ ] Withdraw Ether
// [ ] Deposit Ether
// [ ] Withdraw tokens
// [ ] Check Balances
// [ ] Make order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './Token.sol';
contract Exchange {
   using SafeMath for uint;
  // state variable
  address public feeAccount;
  uint256 public feePercent;
  address constant ETHER = address(0);
// mapping
mapping(address => mapping(address => uint256)) public tokens;
//events
event Deposit (address token, address user, uint256 amount, uint256 balance);
event Withdraw (address token, address user, uint256 amount, uint256 balance);
  // constructor
  constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
  }
  // functions

  function depositEther () payable public {
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
     emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }
  function withdrawEther (uint _amount) public {
    require(tokens[ETHER][msg.sender] >= _amount);
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }
  function depositToken (address _token, uint256 _amount) public {
      require(_token != ETHER);
      require(Token(_token).transferFrom(msg.sender, address(this), _amount));
      tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
      emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
  function withdrawToken (address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(tokens[_token][msg.sender] >= _amount);
    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
    require(Token(_token).transfer(msg.sender, _amount));
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
}