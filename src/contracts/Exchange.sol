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

contract Exchange {

    // state Variable
     address public feeAccount; // the account that receives exchange
     uint256 public feePercent; // the fee percentage

     // constructor
     constructor (address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
     }
}