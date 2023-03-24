// https://docs.ethers.org/v6/getting-started/
let signer = null;
let provider = null;
let wallet = null;
let contract = null;

// functions
function short_addr(addr) {
  return addr.substr(0, 5) + '...' + addr.slice(-4);
}

// connect wallet
$('.btn-connect').click(async e => {
  if ($(e.target).hasClass('is-disabled')) return;

  // connect metamask
  provider = new ethers.BrowserProvider(window.ethereum)
  signer = await provider.getSigner();

  // check current chain
  let { chainId } = await provider.getNetwork();
  chainId = parseInt(chainId);
  let config = CONTRACT_CONFIG[chainId];
  if (!config) {
    alert('Switch network to [Optimism] or [Arbitrum One]');
    return;
  }

  // load contract
  contract = new ethers.Contract(config.token_addr, CONTRACT_ABI, signer);

  // hide anon
  $('.anon').addClass('d-none');

  // show wallet address
  wallet = signer.address;
  $('.address').removeClass('d-none');
  $('.address').html(short_addr(wallet));

  // hide connect button
  $('.btn-connect').addClass('d-none');

  // show token info
  $('.delegate-info').removeClass('d-none');
  $('.btn-delegate').removeClass('d-none').html('Loading...');
  let dec = await contract.decimals();
  let votes = await contract.getFunction('getVotes').staticCall(ZONIC_ADDR);
  let delegated_addr = await contract.getFunction('delegates').staticCall(wallet);
  let k_votes = parseInt(votes) / Math.pow(10, parseInt(dec)+3); // 1_000 -> 3
  $('.delegate-info h5').html(`${config.title} ${k_votes.toFixed(2)}K votes`);

  // show delegate button
  $('.btn-delegate').html('Delegate⚡');
  if (delegated_addr == GENESIS_ADDR) { // not delegate
  }
  else if (delegated_addr != ZONIC_ADDR) { // delegated not zonic
    $('.delegate-msg')
      .removeClass('d-none')
      .html(`Already delegated ${short_addr(delegated_addr)}`);
  }
  else if (delegated_addr == ZONIC_ADDR) { // delegated zonic
    $('.btn-delegate')
      .addClass('is-disabled')
      .html('Complete');
  }

  // show sign-out button
  $('.sign-out').removeClass('d-none');

  /* TODO
  // query claim amount
  $('.btn-claim').text('Checking $ARB...');
  contract.getFunction('claimableTokens').staticCall(wallet)
    .then(amount => {
      claim_amount = parseInt(amount)/1_000_000_000_000_000_000; //18
      let txt = claim_amount > 0 ? `Claim ${claim_amount} $ARB` : 'No $ARB to claim';
      $('.btn-claim').text(txt);
      $('.btn-claim').removeClass('is-disabled');
    })
    .catch(e => { alert(e); })
  */
});

/*
// claim
$('.btn-claim').click(e => {
  let target = e.target;
  if ($(target).hasClass('is-disabled')) return;
  if (claim_amount <= 0) return;
  $(target).addClass('is-disabled');
  contract.getFunction('claim').send()
    .then(_ => {
      alert('Claim Success! Check your txn.')
    })
    .catch(e => {
      alert(e);
      $(target).removeClass('is-disabled');
    })
});

// sign out
$('.sign-out').click(_ => {
  $('.address').addClass('d-none');
  $('.btn-connect').removeClass('d-none');
  $('.btn-claim').addClass('d-none');
  $('.sign-out').addClass('d-none');
});
*/

// metamask events
window.ethereum.on('accountsChanged', function (accounts) {
  $('.sign-out').click();
  $('.btn-connect').click();
})
window.ethereum.on('chainChanged', function (networkId) {
  $('.sign-out').click();
  $('.btn-connect').click();
})
