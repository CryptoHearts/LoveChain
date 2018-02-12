App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('LoveShop.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var LoveShopArtifact = data;
      App.contracts.LoveShop = TruffleContract(LoveShopArtifact);

      // Set the provider for our contract.
      App.contracts.LoveShop.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getAllItems();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#createItem', App.createItem);
  },

  createItem: function(event) {
    event.preventDefault();

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
      console.log(instance);
      return loveShopInstance.items(0);
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

$(function() {
  $(window).load(function() {
    App.init();
  });
});
