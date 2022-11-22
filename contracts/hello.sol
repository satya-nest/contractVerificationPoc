// File: transfer.sol

pragma solidity 0.8.17;
   

contract HelloByHarsh{


    //mapping keytyape=> datatype
    mapping(address => uint) bal;

    
    // event for adding the balance into the account
    event depositDone(uint amount, address depositedTo);

    // event for transferring balance
    event transferDone(uint amount, address towhom);

    
    //adding balance to address or changing value of the address
    function deposit() public payable returns(uint){

        bal[msg.sender] += msg.value;

        //emitting the event balanceadded to notify the frontend that balance is added
        emit depositDone(msg.value, msg.sender);

        
        return bal[msg.sender];
    }

    // retriving the data
    function getbalance() public view returns(uint){
        return bal[msg.sender];
    }

    // this public will call all the function from private and will run
    function transfer(address receip, uint amount) public {

        //check if the balance of msg sender is greater than or equal to the amount he is sending
        require(bal[msg.sender] >= amount);

        //check if the msg sender is also not the receipeint
        require(msg.sender != receip);

        // check the previous balance
        uint prevbalofSender = bal[msg.sender];

        _transfer(msg.sender, receip, amount);// calls the private function and passes the data from it

        //emitting the event balanceadded to notify the frontend that balance is transfered
        emit transferDone(amount, receip);


        // check the balance after transfer happens that it should be equal to previous bal minus the amount transfered
        assert(bal[msg.sender] == prevbalofSender - amount);
    }

    //private function
    function _transfer(address from, address to, uint amount) private{
        bal[from] -= amount;
        bal[to] += amount;
    }
}