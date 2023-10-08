const Exchange = artifacts.require('./Exchange')
const { tokens, rejectedError } = require('../helpers/helper')
require('chai')
.use(require('chai-as-promised'))
.should()


contract("Exchange", ([deployer, feeAccount]) => {
        let exchange;
        const feePercent = 10;
        beforeEach(async() => {
            exchange = await Exchange.new(feeAccount, feePercent)
        })
        
        describe('exchange development', () => {
            it('checks fee account', async () => {
                const result = await exchange.feeAccount()
                result.should.equal(feeAccount)
            })
             it('checks fee percent', async () => {
                const result = await exchange.feePercent()
                result.toString().should.equal(feePercent.toString())
            })
        })
})