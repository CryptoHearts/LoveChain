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

    App.getAllItems();
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#createItem', App.createItem);
  },

  createItem: function(event) {
    event.preventDefault();
    console.log('CLICKED!!!');
    var loveShopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.LoveShop.deployed().then(function(instance) {
        loveShopInstance = instance;
        var name = $('#name').val().toLowerCase().trim();
        var description = $('#description').val().toLowerCase().trim();
        var supply = $('#supply').val().toLowerCase().trim();
        var price = $('#price').val().toLowerCase().trim();
        return loveShopInstance.createItem(
          name,
          description,
          supply,
          web3.toWei(price),
          {from: account}
        );
      }).then(function(result) {
        alert('Creation successful!');
        return App.getAllItems();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getAllItems: function() {
    console.log('Getting items...');

    var loveShopInstance;

    App.contracts.LoveShop.deployed().then(function(instance) {
      loveShopInstance = instance;
      return loveShopInstance.items(1);
    }).then(function(result) {
      console.log(result);
      var itemsRow = $('#itemsRow');
      var itemTemplate = $('#itemTemplate');

      itemTemplate.find('.item-name').text(result[0]);
      itemTemplate.find('.item-description').text(result[1]);
      itemTemplate.find('.item-supply').text(result[2]);
      itemTemplate.find('.item-price').text(result[3]);

      itemsRow.append(itemTemplate.html());

    }).catch(function(err) {
      console.log(err.message);
    });

  }

};
