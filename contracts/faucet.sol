// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract owned {
    address owner; //address variable named "owner" for clarity

    constructor() {
        owner = msg.sender; //address that creates the contract is assigned ownership
    }

modifier onlyOwner {
    require(msg.sender == owner);
    _; //can be applied to functions restricted to be called by the owner
}



}

contract mortal is owned {
    
    function destroy() public onlyOwner{
        selfdestruct(payable(owner)); //destroys the contract and sends funds to owner
}

}

contract faucet is mortal {

    event Withdrawal(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);
    
    function withdraw(uint withdraw_amount) payable public {
        require(withdraw_amount <= 1 ether);
        require(address(this).balance >= withdraw_amount, "Insufficient balance in faucet");
        payable(msg.sender).transfer(withdraw_amount);
        emit Withdrawal(msg.sender, msg.value);
    }

    function deposit() payable external {
        emit Deposit(msg.sender, msg.value);
    }
}