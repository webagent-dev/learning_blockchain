// what to do in this exchange

// Deposit & withdraw funds
// manage orders - make or cancel
//  handle trade - charge fees

// TODO
// [X] Set the fee account
// [X] Deposit Ether
// [X] Withdraw Ether
// [X] Deposit Ether
// [X] Withdraw tokens
// [X] Check Balances
// [X] Make order
// [X] Cancel order
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
mapping(uint256 => _Order) public orders;
uint256 public orderCount;
//events
event Deposit (address token, address user, uint256 amount, uint256 balance);
event Withdraw (address token, address user, uint256 amount, uint256 balance);
event Order (uint id, address user, address tokenGet, uint256 amountGet, address tokenGive, uint256 amountGive, uint256 timestamp);
// struct
struct _Order {
  uint id;
  address user;
  address tokenGet;
  uint256 amountGet;
  address tokenGive;
  uint256 amountGive;
  uint256 timestamp;
}
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

  function checkBalance(address _token, address _user) public view returns(uint256){
    return tokens[_token][_user];
  }

  function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
    orderCount = orderCount.add(1);
    orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, now);
    
  }
}