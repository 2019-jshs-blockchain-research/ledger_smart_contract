App = {
  web3Provider: null,
  contracts: {},


  init: function() {
    $.getJSON('../pay/school-ledger.json', function(data) {
      var list = $('#list');
      var template = $('#template');
      for (i = 0; i < data.length; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.name').text(data[i].name);
        template.find('.area').text(data[i].area);
        template.find('.count').text(data[i].count);
        template.find('.price').text(data[i].price);

        list.append(template.html());
      }
    })

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
	  $.getJSON('SchoolLedger.json', function(data) {
      App.contracts.SchoolLedger = TruffleContract(data);
      App.contracts.SchoolLedger.setProvider(App.web3Provider);
      App.listenToEvents();
    });
  },

  lendSchoolLedger: function() {
    var id = $('#id').val();
    var grade = $('#grade').val();
    var kclass = $('#class').val();
    var date = $('#date').val();
    var kcount = $('#count').val();
    var name = $('#name').val();
    var price = $('#price').val();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contracts.SchoolLedger.deployed().then(function(instance) {
        var nameUtf8Encoded = utf8.encode(name);
        return instance.lendSchoolLedger(id, grade, kclass, date, kcount, web3.toHex(nameUtf8Encoded), { from: account, value: price*date*count });
      }).then(function() {
        $('#grade').val('');
        $('#class').val('');
        $('#date').val('');
        $('#count').val('');
        $('#name').val('');
        $('#lendModal').modal('hide');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  loadSchoolLedgers: function() {
    App.contracts.SchoolLedger.deployed().then(function(instance) {
      return instance.getAllLenders.call();
    }).then(function(lenders) {
      for (i = 0; i < lenders.length; i++) {
        if (lenders[i] !== '0x0000000000000000000000000000000000000000') {
          var imgType = $('.panel-schoolLedger').eq(i).find('img').attr('src').substr(7);

          switch(imgType) {
            case '0.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/0.jpg')
              break;
            case '1.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/1.jpg')
              break;
            case '2.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/2.jpg')
              break;
            case '3.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/3.jpg')
              break;
            case '4.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/4.jpg')
              break;
            case '5.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/5.jpg')
              break;
            case '6.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/6.jpg')
              break;
            case '7.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/7.jpg')
              break;
            case '8.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/8.jpg')
              break;
            case '9.jpg':
              $('.panel-schoolLedger').eq(i).find('img').attr('src', 'images/9.jpg')
              break;

          }

          $('.panel-schoolLedger').eq(i).find('.btn-lend').text('반납').attr('disabled', true);
          $('.panel-schoolLedger').eq(i).find('.btn-lenderInfo').removeAttr('style');
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    })
  },

  listenToEvents: function() {
    App.contracts.SchoolLedger.deployed().then(function(instance) {
      instance.LogLendSchoolLedger({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
        if (!error) {
          $('#events').append('<p>' + event.args._lender + ' 계정에서 ' + names[event.args._id] + '을(를) 구입하였습니다.' + '</p>');
          counts[event.args._id]=counts[event.args._id]-1
        } else {
          console.error(error);
        }
        App.loadSchoolLedgers();
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  $('#lendModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });

  $('#lenderInfoModal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).parent().find('.id').text();

    App.contracts.SchoolLedger.deployed().then(function(instance) {
      return instance.getLenderInfo.call(id);
    }).then(function(lenderInfo) {
      $(e.currentTarget).find('#lenderAddress').text(lenderInfo[0]);
      $(e.currentTarget).find('#lenderName').text(web3.toUtf8(lenderInfo[1]));
      $(e.currentTarget).find('#lenderGrade').text(lenderInfo[2]);
      $(e.currentTarget).find('#lenderClass').text(lenderInfo[3]);
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});
