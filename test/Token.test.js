const Token = artifacts.require('./Token')
require('chai')
.use(require('chai-as-promised'))
.should()
contract('Token', ([deployer, receiver]) => {
    let token;
    const name = 'Dapp Token'
    const symbol = 'Dapp'
    const decimals = '18' 
    const totalsupply =  '1000000000000000000000000'
    beforeEach( async() => {
        token = await Token.new()
    })
    // variable test
    describe("development", () => { 
        // check for name
        it("track the name", async () => {
           const result = await token.name()
           result.should.equal(name)
        })
        // check for symbol
        it('tracks the symbol', async() => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })
        // check for decimals
         it('tracks the decimals', async() => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })
        // check for total supply
         it('tracks the total supply', async() => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalsupply)
        })
        it('it assign total supply to deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalsupply)
        })
    })
    //transfer of token tested
     describe('transfer of token', () => {
          it('it show token balance', async () => {
            let balanceOf;
            // before transfer
            balanceOf = await token.balanceOf(deployer)
            console.log('deployer before balence', balanceOf.toString())
            balanceOf = await token.balanceOf(receiver)
            console.log('receiver before balence', balanceOf.toString())
            // transfer
            await token.transfer(receiver, '100000000000000000000',{from: deployer})
            // after transfer
             balanceOf = await token.balanceOf(deployer)
            console.log('deployer after balence', balanceOf.toString())
            balanceOf = await token.balanceOf(receiver)
            console.log('receiver after balence', balanceOf.toString())
        })
      })

})