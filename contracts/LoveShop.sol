pragma solidity ^0.4.17;

contract LoveShop {

  struct Item {
    string name;
    string description;
    uint supply;
    uint price;
  }

  struct Purchase {
    uint itemID;
    uint price;
  }

  address public owner;
  mapping (uint => Item) public items;
  mapping (address => Purchase) public purchases;

  function LoveShop() public {
    owner = msg.sender;

    items[0] = Item({
      name: 'diamond ring',
      description: 'beautiful nice ring',
      supply: 1000,
      price: 10000000
    });

    items[1] = Item({
      name: 'beach house',
      description: 'a pretty beach house',
      supply: 1000,
      price: 10000000
    });
  }

  function purchaseToken(uint itemID) public payable returns (bool) {
    if (msg.value == items[itemID].price) {

      msg.sender.transfer(this.balance);

      purchases[msg.sender] = Purchase({
        itemID: itemID,
        price: msg.value
      });

      return true;
    } else {
      return false;
    }
  }

  function withdraw() public returns (bool) {
    require(msg.sender == owner);
    owner.transfer(this.balance);
    return true;
  }

  function getBalance() constant public returns (uint) {
    return this.balance;
  }

}
