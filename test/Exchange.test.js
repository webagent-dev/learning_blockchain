const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')
require('chai')
.use(require('chai-as-promised'))
.should()
const { tokens, rejectedError, ether, ETHER_ADDRESS_ZERO } = require('../helpers/helper')


contract('Exchange', ([deployer, feeAccount, user1]) => {
      let exchange, result, token;
        const feePercent = 10
            beforeEach(async () => {
                token = await Token.new()
                token.transfer(user1, tokens(100), {from: deployer})
                exchange = await Exchange.new(feeAccount, feePercent)
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
    describe('fallback function check', () => {
        it('revert mistaken transaction', async() => {
            await exchange.sendTransaction({value: ether(1), from: user1})
        })
    })
    describe('deposit ETHER', () => {
        describe('success deposit', ()=> {

        })
        describe('failure deposit', ()=> {
            
        })
    })
    describe('deposit token', () => {
        describe('success deposit', () => {
               beforeEach(async () => {
                await token.approve(exchange.address, amount, {from: user1})
                 result = await exchange.depositToken(token.address, amount, {from: user1})
            })
              const amount = tokens(10)
                  let balanceOf;
                it('check token deposit amount', async () => {
                        balanceOf = await token.balanceOf(exchange.address)
                        balanceOf.toString().should.equal(amount.toString())
                     balanceOf = await exchange.tokens(token.address, user1)
                     balanceOf.toString().should.equal(amount.toString())
                })
                it('it emit deposit event', async () => {
                    const log = result.logs[0]
                 log.event.should.equal('Deposit')
                 const event = log.args

                 event.token.should.equal(token.address, ' token address is correct')
                  event.user.should.equal(user1, ' user  is correct')
                   event.amount.toString().should.equal(tokens(10).toString(), ' amount is correct')
                    event.balance.toString().should.equal(tokens(10).toString(), ' balance  is correct')
                })

        })
        describe('failure deposit', () => {
            it('reject ether deposit', async () => {
                await exchange.depositToken(ETHER_ADDRESS_ZERO, tokens(10), {from: user1}).should.be.rejectedWith(rejectedError)
            })
            it('check if no token approved', async () => {
                await exchange.depositToken(token.address, tokens(10), { from: user1}).should.be.rejectedWith(rejectedError)
            })
        })
    })
})