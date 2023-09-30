const Token = artifacts.require('./Token')
import { tokens, rejectedError } from '../helpers/helper'
require('chai')
.use(require('chai-as-promised'))
.should()
contract("Token", ([deployer, receiver, exchange]) => {

    let token;
    const name = 'Dapp Token';
    const sym = 'Dapp'
    const dec = '18';
    const supply =tokens(1000000).toString();

    describe("development", () => {
        it('checks var name', async () => {
            token = await Token.new();
            const result = await token.name();
            result.should.equal(name);
        })
          it('checks var symbol', async () => {
            token = await Token.new();
            const result = await token.symbol();
            result.should.equal(sym);
        }) 
         it('checks var decimal', async () => {
            token = await Token.new();
            const result = await token.decimal();
            result.toString().should.equal(dec);
        })
          it('checks var totalSupply', async () => {
            token = await Token.new();
            const result = await token.totalSupply();
            result.toString().should.equal(supply);
        }) 
         it('checks var balanceOf', async () => {
            token = await Token.new();
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(supply);
        })
         
    })
    //transfer token test
    describe("transfer token ", () => {
        it('it check token balance', async () => {
            let balanceOf;
            const token = await Token.new();
            await token.transfer(receiver, tokens(100), {from: deployer})
            balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString());
             balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString());

})
    describe('check for success', () => {
            it('event logs', async () => {
                const token = await Token.new();
                const amount = tokens(100).toString()
               const result =  await token.transfer(receiver, amount, {from: deployer});
                const log = result.logs[0];
                log.event.should.equal('Transfer');

              const event = log.args
              event.from.toString().should.equal(deployer, 'from is correct')
              event.to.toString().should.equal(receiver, 'to is correct')
              event.value.toString().should.equal(amount.toString(), 'value is correct')

            })
})
    describe('check for failure', () => {
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
        it('it check for invalid address', async () => {
            const token = await Token.new();
            const amount = tokens(10);
            await token.transfer(0x0, amount, {from: deployer}).should.be.rejected
        })
})
    })
  describe('allow someone to transfer token', () => {
    describe('approve token', () => {
        describe('success', () => {
            let result;
            let amount;
                it('allocates an allowance for delegated token spending on exchange', async () => {
                    const token = await Token.new()
                    amount = tokens(100);
                    result = await token.approve(exchange, amount, {from: deployer})
                        const allowance = await token.allowance(deployer, exchange)
                        allowance.toString().should.equal(amount.toString())
                })
                it('it check approver event', async () => {
                    const token = await Token.new();
                    amount = tokens(100)
                   const result =  await token.approve(exchange, amount, {from: deployer})
                   const log = result.logs[0]
                   log.event.should.equal('Approve')
                   const event = log.args
                   event.owner.toString().should.equal(deployer, 'owner is correct')
                   event.spender.should.equal(exchange, 'spender is correct')
                //    event.value.toString().should.equal(amount.toString(), 'value is correct')
                })
        })
         describe('failure', () => {
            let amount;
                it('check invalid address', async () => {
                    const token = await Token.new()
                   amount = tokens(100);
                    await token.approve(0x0, amount, {from: deployer}).should.be.rejected
                })
        })
    })
  })
})
