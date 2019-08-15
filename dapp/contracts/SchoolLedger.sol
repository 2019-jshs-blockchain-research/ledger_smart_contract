pragma solidity ^0.4.23;

contract SchoolLedger {
    struct Lender {
        address lenderAddress;
        uint grade;
        uint class;
        uint date;
        uint count;
        bytes32 name;
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

    function lendSchoolLedger(uint _id, uint _grade, uint _class, uint _date, uint _count, bytes32 _name) public payable {
        require(_id >= 0 && _id <= 9);
        lenders[_id] = msg.sender;
        lenderInfo[_id] = Lender(msg.sender, _grade, _class, _date, _count, _name);

        owner.transfer(msg.value);
        emit LogLendSchoolLedger(msg.sender, _id);
    }

    function getLenderInfo(uint _id) public view returns (address, uint, uint, uint, uint, bytes32) {
        Lender memory lender = lenderInfo[_id];
        return (lender.lenderAddress, lender.grade, lender.class, lender.date, lender.count, lender.name);
    }

    function getAllLenders() public view returns (address[10]) {
        return lenders;
    }
}
