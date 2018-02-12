pragma solidity ^0.4.17;

contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

contract LoveShop is Ownable {

  struct Item {
    string name;
    string description;
    uint supply;
    uint price;
  }

  uint balance;
  uint numItems;
  mapping (address => Item) ownerships;
  mapping (uint => Item) public items;

  function createItem(string _name, string _description, uint _supply, uint _price) public onlyOwner returns (uint) {
    require(_supply > 0);
    require(_supply <= 1000);
    require(_price > 0);

    uint itemID = numItems++;
    items[itemID] = Item({
      name: _name,
      description: _description,
      supply: _supply,
      price: _price
    });

    return itemID;
  }



}
