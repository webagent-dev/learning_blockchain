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
    describe('fallback check', () => {
        it('revert unknown transaction', async() => {
            await exchange.sendTransaction({from: user1, value: ether(1)}).should.be.rejectedWith(rejectedError)
        })
        
    })
    describe('deposit ether', () => {
       describe('success deposit', () => {
        amount = ether(1)
        beforeEach(async () => {
            result = await exchange.depositEther({from: user1, value: amount})
        })
        it('check deposit token', async() => {
            const balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })
        it('emit ether deposit event', async() => {
             const log = result.logs[0]
             log.event.should.equal("Deposit")
             const event = log.args
             event.token.should.equal(ETHER_ADDRESS, 'token is correct')
             event.user.should.equal(user1, 'user is correct')
             event.amount.toString().should.equal(amount.toString(), 'amount is correct')
             event.balance.toString().should.equal(amount.toString(), 'balance is correct')
        })
    })
    describe('failure deposit', () => {
        
    })
    })
})