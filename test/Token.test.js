const Token = artifacts.require('./Token')
const { tokens, rejectedError } = require('../helpers/helper')
require('chai')
.use(require('chai-as-promised'))
.should()
// contract testing function
contract('Token', ([deployer, receiver, exchange]) => {
    describe('development', () => {
        const name = 'Dapp Token';
        const decimal = '18'
        const sym = 'Dapp'
        const supply = tokens(100000).toString()
        it('checks name', async () => {
            const token = await Token.new()
            const result = await token.name()
              result.should.equal(name)
        })
          it('checks decimal', async () => {
            const token = await Token.new()
            const result = await token.decimal()
              result.toString().should.equal(decimal)
        })
          it('checks symbol', async () => {
            const token = await Token.new()
            const result = await token.symbol()
              result.should.equal(sym)
        })
          it('checks totalSupply', async () => {
            const token = await Token.new()
            const result = await token.totalSupply()
              result.toString().should.equal(supply)
        })

       
        })
         describe("transfer", () => {
            const supply = tokens(100000).toString()
            describe('success transfer', () => {
                it('check balance', async() => {
                    const token = await Token.new()
                    const result = await token.balanceOf(deployer)
                    result.toString().should.equal(supply);
                })
                it('check transferd token', async () => {
                    const token = await Token.new();
                    let balanceOf;
                    await token.transfer(receiver, tokens(100), {from: deployer})
                    balanceOf = await token.balanceOf(deployer)
                    balanceOf.toString().should.equal(tokens(99900).toString())
                    balanceOf = await token.balanceOf(receiver)
                    balanceOf.toString().should.equal(tokens(100).toString())
                })
                it('transfer event check', async() => {
                  const token = await Token.new();
                  const amount = tokens(100).toString()
                  const result = await token.transfer(receiver, amount, {from: deployer})
                  const log = result.logs[0]
                  log.event.should.equal('Transfer')
                  const event = log.args
                  event._from.toString().should.equal(deployer,  ' from is correct')
                  event._to.should.equal(receiver,  'to is correct')
                  event._value.toString().should.equal(amount.toString(), 'value is correct')
                })
            })
             describe('failure transfer', () => {
                 it('check for insufficient amount', async () => {
             const invalidAmount = tokens(100000000);
             const token = await Token.new();
            await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(rejectedError);
        })
                  it('check for invalid amount', async () => {
            const invalidAmount = tokens(10);
            const token = await Token.new();
        await token.transfer(deployer, invalidAmount, {from: receiver}).should.be.rejectedWith(rejectedError);
        })
                it('check invalid address', async() => {
                  const token = await Token.new()
                  const amount = tokens(100).toString()
                  await token.transfer(0x0, amount, {from: deployer}).should.be.rejected
                })
            })
    })
        describe('approve token for delegate transfer', () => {
              it('check approve success', async () => {
                const token = await Token.new()
                const amount = tokens(100).toString()
                await token.approve(exchange, amount, {from: deployer})
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.equal(amount.toString())
              })
              it('it emit approve event', async () => {
                const token  = await Token.new()
                const amount = tokens(100);
                const result = await token.approve(exchange, amount, {from: deployer})
                const log = result.logs[0]
                log.event.should.equal('Approve')
                const event = log.args
                event._owner.toString().should.equal(deployer, 'from is correct')
                event._spender.should.equal(exchange, 'spender is correct')
                event._value.toString().should.equal(amount.toString(), 'value is correct')
              })
              it('check approve failure', async () => {
                  const token = await Token.new()
                  const amount = tokens(100).toString()
                  await token.approve(0x0, amount, {from: deployer}).should.be.rejected
              })
        })
        describe('transferFrom function test', () => {
          it('it check success transferFrom', async () => {
            const token = await Token.new()
            const amount = tokens(100)
            let balance;
            await token.approve(exchange, amount, {from: deployer})
            await token.transferFrom(deployer, receiver, amount, { from: exchange})
            balance = await token.balanceOf(deployer)
            balance.toString().should.equal(tokens(99900).toString())
            balance = await token.balanceOf(receiver)
            balance.toString().should.equal(tokens(100).toString())
          })
          it('reset allowance', async () => {
            const token = await Token.new()
            const allowance = await token.allowance(deployer, exchange)
            allowance.toString().should.equal('0')
          })
          it('emit transferFrom Event', async () => {
              const token = await Token.new()
              const amount = tokens(100).toString()
              await token.approve(exchange, amount, {from: deployer})
              const result = await token.transferFrom(deployer, receiver, amount, {from: exchange})
              const log = result.logs[0]
              log.event.should.equal('Transfer')
              const event = log.args
              event._from.should.equal(deployer, 'from is correct')
              event._to.should.equal(receiver, 'to is correct')
              event._value.toString().should.equal(amount.toString(), 'value is correct')
          })
            describe('it check failure transferFrom', () => {
                it('reject invalid and insufficient amount', async () => {
                    const token = await Token.new()
                    const amount = tokens(100000000)
               
                    await token.transferFrom(deployer, receiver, amount, {from: exchange}).should.be.rejectedWith(rejectedError)
                  })

                  it('it check invalid address', async () => {
                    const token = await Token.new()
                    const amount = tokens(100);
          
                    await token.transferFrom(deployer, 0x0, amount, {from: exchange}).should.be.rejected
                  })
          })
        })
})