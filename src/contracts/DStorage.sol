pragma solidity ^0.5.0;

contract DStorage {
  string public name = "DStorage";
  uint public fileCount = 0;
  mapping(uint=> File) public files;


  // Struct
  struct File {
    uint fileId;
    string fileHash;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    uint funds;
    uint views;
    uint viewPrice;
    address payable uploader;
    address payable owner;

  }


  // Event
  event FileUploaded(
    uint fileId,
    string fileHash,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    uint funds,
    uint views,
    uint viewPrice,
    address payable uploader,
    address payable owner
  );

  event FundsDonated(
    uint fileId,
    string fileHash,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    uint funds,
    uint views,
    uint viewPrice,
    address payable uploader,
    address payable owner
  );

  constructor() public {
  }

  function fundsDonated(uint _id) public payable {
    File memory _file = files[_id];


    address payable _creator = _file.owner;

        //Make sure the product has a valid id
        require(_file.fileId > 0 && _file.fileId <= fileCount);
        //Require there is enough ether in the transaction
        require(msg.value > 0);
        require(_file.owner != msg.sender);

        //Pay the seller by sending them ether
        if(_file.owner!=_file.uploader)
        {
          address(_file.owner).transfer(msg.value*80/100);
          address(_file.uploader).transfer(msg.value*20/100);
        }
        else
        {
          address(_file.owner).transfer(msg.value);
        }
        
        _file.funds = _file.funds + (msg.value);

        //Update the Product
        files[_id] = _file;

        //Trigger an event
        emit FundsDonated(fileCount,_file.fileHash,_file.fileType,_file.fileName,_file.fileDescription,_file.uploadTime,_file.funds,_file.views,_file.viewPrice, _file.uploader,_file.owner);

  }

  function viewed(uint _id) public payable {
    File memory _file = files[_id];


    address payable _creator = _file.owner;

        //Make sure the product has a valid id
        require(_file.fileId > 0 && _file.fileId <= fileCount);
        //Require there is enough ether in the transaction
        require(msg.value > 0);
        require(_creator != msg.sender);

        _file.views++;
        if(_file.views<20)
        {
          _file.viewPrice = 10;
        }
        else if(_file.views>=20 && _file.views<100)
        {
          _file.viewPrice = 20;
        }
        else if(_file.views>=100 && _file.views<250)
        {
          _file.viewPrice = 30;
        }
        else if(_file.views>=250 && _file.views<500)
        {
          _file.viewPrice = 40;
        }
        else
        {
           _file.viewPrice = 50;
        }


        //Pay the seller by sending them ether
        if(_file.owner!=_file.uploader)
        {
          address(_file.owner).transfer(msg.value*80/100);
          address(_file.uploader).transfer(msg.value*20/100);
        }
        else
        {
          address(_file.owner).transfer(msg.value);
        }
        _file.funds = _file.funds + (msg.value);

        //Update the Product
        files[_id] = _file;

        //Trigger an event
        emit FundsDonated(fileCount,_file.fileHash,_file.fileType,_file.fileName,_file.fileDescription,_file.uploadTime,_file.funds,_file.views,_file.viewPrice, _file.uploader,_file.owner);

  }

  function reDistribute(uint _id) public payable {
    File memory _file = files[_id];

    address payable _creator = _file.owner;

        //Make sure the product has a valid id
        require(_file.fileId > 0 && _file.fileId <= fileCount);
        //Require there is enough ether in the transaction
        require(msg.value > 0);
        require(_creator != msg.sender);


        //Pay the seller by sending them ether
        if(_file.owner!=_file.uploader)
        {
          address(_file.owner).transfer(msg.value*80/100);
          address(_file.uploader).transfer(msg.value*20/100);
        }
        else
        {
          address(_file.owner).transfer(msg.value);
        }
        
        _file.funds = _file.funds + (msg.value);

        //Update the Product
        files[_id] = _file;

        //Trigger an event
        emit FundsDonated(fileCount,_file.fileHash,_file.fileType,_file.fileName,_file.fileDescription,_file.uploadTime,_file.funds,_file.views,_file.viewPrice, _file.uploader,_file.owner);

  }


function sold(uint _id) public payable {
    File memory _file = files[_id];

    address payable _creator = _file.owner;

        //Make sure the product has a valid id
        require(_file.fileId > 0 && _file.fileId <= fileCount);
        //Require there is enough ether in the transaction
        require(msg.value > 0);
        require(_creator != msg.sender);


        //Pay the seller by sending them ether
        address(_file.owner).transfer(msg.value);
        _file.owner = msg.sender;
        
        _file.funds = _file.funds + (msg.value);

        //Update the Product
        files[_id] = _file;

        //Trigger an event
        emit FundsDonated(fileCount,_file.fileHash,_file.fileType,_file.fileName,_file.fileDescription,_file.uploadTime,_file.funds,_file.views,_file.viewPrice, _file.uploader,_file.owner);

  }


// Upload File function
function uploadFile(string memory _fileHash, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure file type exists
    require(bytes(_fileType).length > 0);
    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);
    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash,_fileType, _fileName, _fileDescription, now,0,0,10, msg.sender, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileType, _fileName, _fileDescription, now,0,0,10, msg.sender,msg.sender);
  }
  
}