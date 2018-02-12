const LoveShop = artifacts.require('./LoveShop.sol')
contract('LoveShop', function (accounts) {

  it('fetches the items', function () {
    LoveShop.deployed().then(function(instance) {
      return instance.items(0);
    })
    .then(function(result) {
      assert.equal(result.length, 4);
    });
  });

  it('creates an item', function () {
    LoveShop.deployed().then(function(instance) {
      var p1 = instance.createItem(
        'diamond ring',
        'a pretty ring',
        1000,
        web3.toWei('0.01'),
        {from: accounts[0]}
      );
      var p2 = instance.createItem(
        'beach house',
        'a pretty house',
        1000,
        web3.toWei('0.01'),
        {from: accounts[0]}
      );
      return Promise.all([p1, p2]);
    })
    .then(function(res1) {
      LoveShop.deployed().then(function(inst2) {
        var p3 = inst2.items(0);
        var p4 = inst2.items(1);
        return Promise.all([p3, p4]);
      })
      .then(function(res2) {
        assert.equal(res2[0][0], 'diamond ring');
        assert.equal(res2[1][0], 'beach house');
      });
    });
  });

});
