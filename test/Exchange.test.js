const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')
require('chai')
.use(require('chai-as-promised'))
.should()


contract("Exchange", ([deployer, feeAccount, user1]) => {
    let token, exchange, amount, result;
    const feePercent = 10;
    beforeEach(async() => {
        amount = tokens(100)
        token = await Token.new();
        await token.transfer(user1, amount, {from: deployer})
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
    describe('fallback', () => {
        it('check transaction sent by mistake', async() => {
            await exchange.sendTransaction({value: ether(1), from: user1}).should.be.rejectedWith(rejectedError)
        })
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
    describe('withdraw ether', () => {
        beforeEach(async() => {
            amount = ether(1)
            await exchange.depositEther({from: user1, value: amount})
        })
        describe('success withdraw', () => {
            beforeEach(async() => {
                amount = ether(1)
                result = await exchange.withdrawEther(amount, {from: user1})
            })
            it('check ether withdraw', async() => {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })
            it('emit a withdraw event',async() => {
                const log = result.logs[0]
                log.event.should.equal("Withdraw")
                const event = log.args
                event.token.should.equal(ETHER_ADDRESS, 'token is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(ether(1).toString(), 'amount is correct')
                event.balance.toString().should.equal('0', 'balance is correct')
            })
        })

        describe('failure withdraw', () => {
            it('withdraw invalid amount',async() => {
                await exchange.withdrawEther(ether(100), {from: user1}).should.be.rejectedWith(rejectedError)
            })
        })
    })
    describe('deposit token', () => {
        describe('success deposit', () => {
            beforeEach(async() => {
                amount = tokens(10)
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositToken(token.address, amount, {from: user1})
            })
            it('check token balance', async () => {
                const balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
            })
            it('track token balance', async () => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })
            it('emit token transfer event', async () => {
                const log = result.logs[0]
                log.event.should.equal("Deposit")
                const event = log.args
                event.token.should.equal(token.address, 'token is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal(amount.toString(), 'balance is correct')
            })
        })
        describe('failure deposit', () => {
            it('reject ether deposit', async() => {
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(rejectedError)
            })
            it('fail when no tokens approved', async() => {
                await exchange.depositToken(token.address, tokens(10), {from: user1}).should.be.rejectedWith(rejectedError)
            })
        })
    })
    describe('withdraw token', () => {
        describe('suceess withdraw', () => {
            beforeEach(async() => {
                amount = tokens(10)
                await token.approve(exchange.address, amount, {from: user1})
                await exchange.depositToken(token.address, amount, {from: user1})
                result = await exchange.withdrawToken(token.address, amount, {from: user1})
            })
            it('track widthraw token', async() => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })
            it('emit widthdraw token event',async() => {
                const log = result.logs[0]
                log.event.should.equal("Withdraw")
                const event = log.args
                event.token.should.equal(token.address, 'token is correct')
                event.user.should.equal(user1, 'user is correct')
                event.amount.toString().should.equal(amount.toString(), 'amount is correct')
                event.balance.toString().should.equal('0', 'balance is correct')
            })
           
        })
        describe('failure withdraw', () => {
            it('reject Ether withdraw', async() => {
                await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(rejectedError)
            })
            it('fails for insufficient amount', async() => {
                await exchange.withdrawToken(token.address, tokens(10), {from: user1}).should.be.rejectedWith(rejectedError)
            })
     })
    })
})