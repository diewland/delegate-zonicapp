// https://docs.ethers.org/v6/getting-started/
let signer = null;
let provider = null;
let wallet = null;
let contract = null;
let config = null;

// common
function short_addr(addr) {
  return addr.substr(0, 5) + '...' + addr.slice(-4);
}

// init
function init(validate_chain) {

  // connect wallet
  $('.btn-connect').click(async e => {
    if ($(e.target).hasClass('is-disabled')) return;

    // connect metamask
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner();

    // check current chain
    let { chainId } = await provider.getNetwork();
    chainId = parseInt(chainId);
    if (!validate_chain(chainId)) return;

    // show delegate info
    $('.delegate-info').removeClass('d-none');
    $('.delegate-info h5').html(TEXT_LOADING);

    // hide anon
    $('.anon').addClass('d-none');

    // show wallet address
    wallet = signer.address;
    $('.address').removeClass('d-none');
    $('.address').html(short_addr(wallet));

    // hide connect button
    $('.btn-connect').addClass('d-none');

    // prepare submit button
    $('.btn-delegate')
      .html(TEXT_LOADING)
      .removeClass('d-none')
      .addClass('is-disabled');

    // load contract info (await)
    contract = new ethers.Contract(config.token_addr, CONTRACT_ABI, signer);
    let dec = await contract.decimals();
    let votes = await contract.getFunction('getVotes').staticCall(ZONIC_ADDR);
    let delegated_addr = await contract.getFunction('delegates').staticCall(wallet);
    let k_votes = parseInt(votes) / Math.pow(10, parseInt(dec)+3); // 1_000 -> 3
    let token_balance = await contract.getFunction('balanceOf').staticCall(wallet);
    token_balance = parseInt(token_balance) / Math.pow(10, parseInt(dec));

    // update delegate info
    $('.delegate-info h5').html(`${config.title} ${k_votes.toFixed(2)}K votes`);

    // update wallet info
    $('.address').append(`/${token_balance.toFixed(2)} ${config.token}`);

    // update submit button
    if (delegated_addr == GENESIS_ADDR) { // not delegate
      $('.btn-delegate')
        .html('Delegate⚡')
        .removeClass('is-disabled');
    }
    else if (delegated_addr != ZONIC_ADDR) { // delegated not zonic
      $('.btn-delegate')
        .html('Delegate⚡')
        .removeClass('is-disabled');
      $('.delegate-msg')
        .html(`You already delegated ${short_addr(delegated_addr)}`)
        .removeClass('d-none');
    }
    else if (delegated_addr == ZONIC_ADDR) { // delegated zonic
      $('.btn-delegate').html('Complete');
    }

    // show sign-out button
    $('.sign-out').removeClass('d-none');
  });

  // claim
  $('.btn-delegate').click(e => {
    let target = e.target;
    if ($(target).hasClass('is-disabled')) return;
    $(target).addClass('is-disabled');
    contract.getFunction('delegate').send(ZONIC_ADDR)
      .then(_ => {
        $('.btn-delegate').html('Complete');
        alert('Delegate Success! Check your txn.')
      })
      .catch(e => {
        alert(e);
        $(target).removeClass('is-disabled');
      })
  });

  // sign out
  $('.sign-out').click(_ => {
    $('.delegate-info').addClass('d-none');
    $('.anon').removeClass('d-none');
    $('.address').addClass('d-none');
    $('.btn-connect').removeClass('d-none');
    $('.delegate-msg').addClass('d-none');
    $('.btn-delegate').addClass('d-none');
    $('.sign-out').addClass('d-none');
  });

  // metamask events
  window.ethereum.on('accountsChanged', function (accounts) {
    $('.sign-out').click();
    $('.btn-connect').click();
  });
  window.ethereum.on('chainChanged', function (networkId) {
    $('.sign-out').click();
    $('.btn-connect').click();
  });

}
function init_chain(chain_id) {
  config = CONTRACT_CONFIG[chain_id];
  if (!config) {
    alert(`Not support Chain ID ${chain_id}`)
    return;
  }
  init(cur_chain_id => {
    if (cur_chain_id != chain_id) {
      alert(`Switch network to [${config.title}]`);
      return false;
    }
    return true;
  });
}
