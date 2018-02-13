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

    return App.getAllItems();
  },

  getAllItems: function() {
    console.log('Getting items...');

    var loveShopInstance;

    App.contracts.LoveShop.deployed().then(function(instance) {
      loveShopInstance = instance;
      console.log(loveShopInstance);
      var items = [];
      for (var i = 0; i < 14; i++) {
        items.push(loveShopInstance.items(i));
      }
      return Promise.all(items);
    }).then(function(result) {
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        var itemsRow = $('#itemsRow');
        var itemTemplate = $('#itemTemplate');

        itemTemplate.find('.item-name').text(result[i][0]);
        itemTemplate.find('.item-description').text(result[i][1]);
        itemTemplate.find('.item-supply').text(result[i][2]);
        itemTemplate.find('.item-price').text(result[i][3]);
        itemTemplate.find('.item-link').attr('href', '/purchase/' + i);

        itemsRow.append(itemTemplate.html());
      }

    }).catch(function(err) {
      console.log(err.message);
    });

  }

};
