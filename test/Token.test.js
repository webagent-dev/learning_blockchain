const Token = artifacts.require('./Token')
import { tokens } from '../helpers/helper'
require('chai')
.use(require('chai-as-promised'))
.should()
contract("Token", ([deployer, receiver]) => {

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
  describe("transfer Token", () => {
    it('it check transfered token', async () => {
        let balanceOf;
        const token = await Token.new();
        await token.transfer(receiver, tokens(100), {from: deployer})
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(receiver)
        balanceOf.toString().should.equal(tokens(100).toString())
    })
  })
})