pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
contract Token{
    using SafeMath for uint;
    // DataType
    string public name = 'Dapp Token';
    string public symbol = 'Dapp';
    uint256 public decimal = 18;
    uint256 public totalSupply;

    // mapping
    mapping(address => uint256 ) public  balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    //event
    event Transfer (address indexed _from, address indexed _to, uint256 _value );
    event Approve (address indexed _owner, address indexed _spender, uint256 _value );
    // constructor
    constructor () public {
        totalSupply = 100000 * (10 ** decimal);
        balanceOf[msg.sender] = totalSupply;
    }
    // internal function
    function _transfer (address _from, address _to, uint256 _value) internal {
         require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }
    // approve function
    function approve(address _spender, uint256 _value) public returns(bool success){
            require(_spender != address(0));
            allowance[msg.sender][_spender] = _value;
            emit Approve(msg.sender, _spender, _value);
            return true;
    }
    // transfer function
    function transfer(address _to, uint256 _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value);
         _transfer(msg.sender, _to, _value);
        return true;
    }

    // transferFrom
    function transferFrom (address _from, address _to, uint256 _value ) public returns(bool success){
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}