const Token = artifacts.require('./Token')
require('chai')
.use(require('chai-as-promised'))
.should()
contract('Token', (accounts) => {
    let token;
    const name = 'Dapp Token'
    const symbol = 'Dapp'
    const decimals = '18'
    const totalsupply =  '1000000000000000000000000'
    beforeEach( async() => {
        token = await Token.new()
    })
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
    })
})