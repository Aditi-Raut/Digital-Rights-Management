const DStorage = artifacts.require('./DStorage.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DStorage', ([deployer, uploader, subscriber]) => {
  let dstorage

  before(async () => {
    dstorage = await DStorage.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await dstorage.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await dstorage.name()
      assert.equal(name, 'DStorage')
    })
  })

  describe('file', async () => {
    let result, fileCount
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'TypeOfTheFile'
    const fileName = 'NameOfTheFile'
    const fileDescription = 'DescriptionOfTheFile'

    before(async () => {
      result = await dstorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await dstorage.fileCount()
    })

    //check event
    it('upload file', async () => {
      // SUCESS
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id is correct')
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.fileDescription, fileDescription, 'Description is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')
      assert.equal(event.owner, uploader, 'Uploader is correct')

      // FAILURE: File must have hash
      await dstorage.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have size
      await dstorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;
      
      // FAILURE: File must have type
      await dstorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have name
      await dstorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have description
      await dstorage.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })

    //check from Struct
    it('lists file', async () => {
      const file = await dstorage.files(fileCount)
      assert.equal(file.fileId.toNumber(), fileCount.toNumber(), 'id is correct')
      assert.equal(file.fileHash, fileHash, 'Hash is correct')
      assert.equal(file.fileSize, fileSize, 'Size is correct')
      assert.equal(file.fileName, fileName, 'Size is correct')
      assert.equal(file.fileDescription, fileDescription, 'description is correct')
      assert.equal(file.uploader, uploader, 'uploader is correct')
      assert.equal(file.funds, 0, 'uploader is correct')
      assert.equal(file.owner, uploader, 'uploader is correct')
    })


    it('donates funds', async () => {

      //Track seller balance before purchase
      let oldOwnerBalance 
      oldOwnerBalance= await web3.eth.getBalance(uploader);
      oldOwnerBalance = new web3.utils.BN(oldOwnerBalance);

      //Success: Buyer makes purchase
      result = await dstorage.fundsDonated(fileCount,{ from: subscriber, value: web3.utils.toWei('1','Ether') });

      //Check logs
      const event = result.logs[0].args
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.fileDescription, fileDescription, 'Description is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')
      assert.equal(event.owner, uploader, 'Uploader is correct')
      assert.equal(event.funds, web3.utils.toWei('1','Ether'), 'Funds is correct')
      //Check if seller received funds
      let newOwnerBalance 
      newOwnerBalance= await web3.eth.getBalance(uploader);
      newOwnerBalance = new web3.utils.BN(newOwnerBalance);



      let price
      price = web3.utils.toWei('1','Ether');
      price = new web3.utils.BN(price);

      const expectedBalance = oldOwnerBalance.add(price);

      assert.equal(newOwnerBalance.toString(),expectedBalance.toString());


      //Failure:Tries to buy a product that does not exist i.e product must have valid id
      await dstorage.fundsDonated(99,{ from: subscriber, value: web3.utils.toWei('1','Ether')  }).should.be.rejected;
      //Failure: Tries to buy with not enough ether
      await dstorage.fundsDonated(fileCount,{ from: subscriber, value: web3.utils.toWei('0','Ether')  }).should.be.rejected;
      //Failure Buyer can't be the seller
      await await dstorage.fundsDonated(fileCount,{ from: uploader, value: web3.utils.toWei('1','Ether')  }).should.be.rejected;


    })


  })
})