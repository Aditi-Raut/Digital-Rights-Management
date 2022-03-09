pragma solidity ^0.5.0;

contract DStorage {
  string public name = "DStorage";
  uint public fileCount = 0;
  mapping(uint=> File) public files;


  // Struct
  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    uint funds;
    uint views;
    address payable uploader;
    address payable owner;

  }


  // Event
  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    uint funds,
    uint views,
    address payable uploader,
    address payable owner
  );

  event FundsDonated(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    uint funds,
    uint views,
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
        //Update the Product
        files[_id] = _file;

        //Pay the seller by sending them ether
        address(_file.owner).transfer(msg.value);
        
        _file.funds = _file.funds + (msg.value);

        //Trigger an event
        emit FundsDonated(fileCount,_file.fileHash,_file.fileSize,_file.fileType,_file.fileName,_file.fileDescription,_file.uploadTime,_file.funds,_file.views, _file.uploader,_file.owner);

  }

// Upload File function
function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
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
    require(_fileSize>0);

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now,0,0, msg.sender, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now,0,0, msg.sender,msg.sender);
  }
  
}