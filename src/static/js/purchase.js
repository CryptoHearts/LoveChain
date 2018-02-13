App = {
  web3Provider: null,
  contracts: {},

  init: function(contract) {
    return App.initWeb3(contract);
  },

  initWeb3: function(contract) {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract(contract);
  },

  initContract: function(contract) {
    App.contracts.LoveShop = TruffleContract(contract);
    // Set the provider for our contract.
    App.contracts.LoveShop.setProvider(App.web3Provider);

    App.getItem();
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#purchaseButton', App.purchaseItem);
    $(document).on('click', '#withdrawButton', App.withdraw);
  },

  withdraw: function() {
    var loveShopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.LoveShop.deployed().then(function(instance) {
        loveShopInstance = instance;
        var id = window.location.pathname.split('/')[2];
        return loveShopInstance.withdraw({ from: account });
      }).then(function(result) {
        return App.getBalance();
      }).then(function(res) {
        alert('Withdraw Successful! Contract Balance: ' + web3.fromWei(res, 'ether').toString());
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  purchaseItem: function() {

    var loveShopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.LoveShop.deployed().then(function(instance) {
        loveShopInstance = instance;
        var id = window.location.pathname.split('/')[2];
        return loveShopInstance.purchaseToken(
          id,
          {from: account, value: web3.toWei('0.01')}
        );
      }).then(function(result) {
        alert('Purchase successful!');
        return App.getItem();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  getItem: function() {

    var loveShopInstance;

    App.contracts.LoveShop.deployed().then(function(instance) {
      loveShopInstance = instance;
      var id = window.location.pathname.split('/')[2];
      return loveShopInstance.items(id);
    }).then(function(result) {
      var itemTemplate = $('#purchaseTemplate');

      itemTemplate.find('.item-name').text(result[0]);
      itemTemplate.find('.item-description').text(result[1]);
      itemTemplate.find('.item-supply').text(result[2]);
      itemTemplate.find('.item-price').text(result[3]);

    }).catch(function(err) {
      console.log(err.message);
    });

  }

};
