pragma solidity ^0.4.24;

contract MyContract {
   struct Student {
       string studentName;
       uint8 grade;
       uint8 class;
       uint32 balance;
   }
   
   struct Teacher{
       string name;
   }
   
   struct Item {
       string location;
       uint32 cost;
       uint32 count;
   }
  
   
   mapping(uint256 => Student) studentInfo;
   mapping(uint256 => Teacher) teacherInfo;
   mapping(string => Item) itemInfo;
   
   function setStudentInfo(uint _studentId, string _name, uint8 _grade, uint8 _class, uint32 _balance) public {
       Student storage student = studentInfo[_studentId];
       student.studentName = _name;
       student.grade = _grade;
       student.class = _class;
       student.balance = _balance;
   }
   
   function getStudentInfo(uint256 _studentId) public view returns (string, uint8, uint8, uint32) {
       return (studentInfo[_studentId].studentName, studentInfo[_studentId].grade, studentInfo[_studentId].class, studentInfo[_studentId].balance);
   }
   
   function setTeacherInfo(uint _teacherId, string _name) public {
       Teacher storage teacher = teacherInfo[_teacherId];
       teacher.name = _name;
   }
   
   function getTeacherInfo(uint256 _teacherId) public view returns (string) {
       return (teacherInfo[_teacherId].name);
   }
   
   function setItemInfo(string _name, string _location, uint32 _cost, uint32 _count) public {
       Item storage item = itemInfo[_name];
       item.location = _location;
       item.cost = _cost;
       item.count = _count;
   }
   
   function getItemInfo(string _name) public view returns (string, string, uint32, uint32) {
       return (itemInfo[_name].name, itemInfo[_name].location, itemInfo[_name].cost, itemInfo[_name].count);
   }
   
   function apply(uint _studentId, uint _itemId){
       require(studentInfo[_studentId].balance >= itemInfo[_itemId].cost);
       studentInfo[_studentId].balance -= itemInfo[_itemId].cost;
       itemInfo[_itemId].count--;
   }
}