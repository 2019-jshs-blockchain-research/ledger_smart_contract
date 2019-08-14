pragma solidity ^0.4.23;

contract SchoolLedger {
    struct Lender {
        address lenderAddress;
        bytes32 name;
        uint grade;
        uint class;
    }

    mapping (uint => Lender) public lenderInfo;
    address public owner;
    address[10] public lenders;

    event LogLendSchoolLedger(
        address _lender,
        uint _id
    );

    constructor() public {
        owner = msg.sender;
    }

    function lendSchoolLedger(uint _id, uint grade, uint class, bytes32 _name) public payable {
        require(_id >= 0 && _id <= 9);
        lenders[_id] = msg.sender;
        lenderInfo[_id] = Lender(msg.sender, _grade, _class, _name);

        owner.transfer(msg.value);
        emit LogBuySchoolLedger(msg.sender, _id);
    }

    function getLenderInfo(uint _id) public view returns (address, uint, uint, bytes32) {
        Lender memory lender = lenderInfo[_id];
        return (lender.lenderAddress, lender.grade, lender.class, lender.name);
    }

    function getAllLenders() public view returns (address[10]) {
        return lenders;
    }
}
