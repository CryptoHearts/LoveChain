const LoveShop = artifacts.require('./LoveShop.sol')
contract('LoveShop', function (accounts) {

  it('fetches the items', function () {
    LoveShop.deployed().then(function(instance) {
      return instance.items(0);
    })
    .then(function(result) {
      assert.equal(result.length, 4);
    })
    .catch(function(err) {
      console.log(err);
    });
  });

  it('purchases and withdraws the value from the contract', function() {
    var LoveShopInstance;
    var originalBalance = web3.fromWei(web3.eth.getBalance(accounts[0]), 'ether');

    LoveShop.deployed().then(function(instance) {
      LoveShopInstance = instance;
      return instance.purchaseToken(
        0,
        {from: accounts[1], value: web3.toWei('0.01')}
      );

    })
    .then(function(res) {
      return LoveShopInstance.withdraw({from: accounts[0]});
    })
    .then(function(res) {
      var newBalance = web3.eth.getBalance(accounts[0]);
      assert.isBelow(parseFloat(originalBalance.toString()), parseFloat(web3.fromWei(newBalance, 'ether').toString()));
    })
    .catch(function(err) {
      console.log(err);
    });
  });

});
