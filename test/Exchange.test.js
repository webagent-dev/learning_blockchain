const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')
require('chai')
.use(require('chai-as-promised'))
.should()
const { tokens, ether, ETHER_ADDRESS, rejectedError } = require('../helpers/helper')

contract("Exchange", ([deployer, feeAccount, user1]) => {
    let token, exchange, amount, result;
    const feePercent = 10;
    beforeEach(async() => {
        token = await Token.new();
        exchange = await Exchange.new(feeAccount, feePercent);
    })
    describe('development', () => {
        it('check feeAccount', async() => {
            result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })
        it('check feePercent', async() => {
            result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
    })
})