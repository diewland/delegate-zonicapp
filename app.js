// https://docs.ethers.org/v6/getting-started/
let signer = null;
let provider = null;
let wallet = null;
let contract = null;

// connect wallet
$('.btn-connect').click(async e => {
  if ($(e.target).hasClass('is-disabled')) return;

  // connect metamask
  provider = new ethers.BrowserProvider(window.ethereum)
  signer = await provider.getSigner();

  // recheck arbitrum one network
  let { chainId } = await provider.getNetwork();
  chainId = parseInt(chainId);
  console.log(chainId); // TODO
  /*
  if (chainId != BigInt(ARB_CHAIN_ID)) {
    alert('Switch Metamask Network to [Arbitrum One]');
    return;
  }
  */

  /*
  // load contract
  contract = new ethers.Contract(CONTRACT_ADDR, CONTRACT_ABI, signer);
  */

  // show wallet address
  wallet = signer.address;
  $('.address').removeClass('d-none');
  $('.address').html(wallet.substr(0, 5) + '...' + wallet.slice(-4));

  // hide connect button
  $('.btn-connect').addClass('d-none');

  /* TODO
  // show claim, sign-out buttons
  $('.btn-claim').removeClass('d-none');
  $('.sign-out').removeClass('d-none');

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

// metamask events
window.ethereum.on('accountsChanged', function (accounts) {
  $('.sign-out').click();
  $('.btn-connect').click();
})
window.ethereum.on('chainChanged', function (networkId) {
  $('.sign-out').click();
  $('.btn-connect').click();
})
*/
