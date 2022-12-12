const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

let main = document.getElementById("main");
let auctionData = null;

if (!id) {
  window.location.href = "/index.html";
}

getAuctionData();

function getAuctionData() {
  request
    .get(
      `https://api.noroff.dev/api/v1/auction/listings/${id}?_seller=true&_bids=true`
    )
    .then((res) => {
      auctionData = res;
      main.innerHTML = "";
      renderAuction();
    })
    .catch((e) => {
      console.log(e);
    });
}

function renderAuction() {
  let data = `
  <div class="flex gap-5 md:flex-col">
  <div class="w-[50%] md:w-full shrink-0">
    <div class="w-full bg-gray-100 h-[500px] rounded-xl overflow-hidden">
      <img
        id="main-image"
        class="w-full h-full object-cover"
        src="${auctionData.media[0]}"
        alt=""
      />
    </div>
    <div
      class="mt-2 bg-gray-100 w-full p-2 rounded-xl flex gap-2 overflow-auto"
    >
      ${auctionData.media
        .map((media, index) => {
          return `
        <img
        class="w-24 h-14 rounded-md object-cover"
        src="${media}"
        alt=""
      />
        `;
        })
        .join("")}
    </div>
  </div>
  <div class="w-full">
    <h1 class="text-4xl font-bold">${auctionData.title}</h1>

    <p class="text-gray-400 mt-3">
      ${auctionData.description}
    </p>

    <div class="${auctionData.tags.length ? "mt-3" : ""} flex gap-1 flex-wrap">
      ${auctionData.tags
        .map((tag) => {
          return `<div class="py-1 px-3 rounded-full bg-blue-500 text-white text-sm">
        ${tag}
      </div>`;
        })
        .join("")}
    </div>

    <div class="my-5">
      <div class="font-medium">Seller</div>
      <div class="flex gap-2 items-center mt-2">
        <div class="w-10 h-10 rounded-full bg-gray-100">
          <img
            class="w-full h-full object-cover rounded-full"
            src="${auctionData.seller.avatar}"
            alt=""
          />
        </div>
        <div class="flex flex-col">
          <div>${auctionData.seller.name}</div>
          <div class="text-sm text-gray-400">${auctionData.seller.email}</div>
        </div>
      </div>
    </div>

    <div class="">
      <div class="font-medium">Bidders (${auctionData._count.bids})</div>

      <div class="flex flex-wrap gap-2 mt-2">
        ${auctionData.bids
          .sort((a, b) => b.amount - a.amount)
          .map((bid, index) => {
            return `<div class="py-1 px-3 rounded-md bg-${
              index === 0
                ? "green"
                : index === 1
                ? "blue"
                : index === 2
                ? "red"
                : "gray"
            }-100">
          ${
            bid.bidderName
          } <span class="opacity-20">|</span> <span class="font-bold">${
              bid.amount
            }$</span>
        </div>`;
          })
          .join("")}
      </div>
    </div>

    <div id="count-down" class="mt-10 text-2xl font-bold"></div>
    
    <form class="flex mt-3">
      <input
        min="${
          auctionData.bids.sort((a, b) => b.amount - a.amount)[0]?.amount + 1
        }"
        name="amount"
        required
        step="10"
        class="input w-[120px] rounded-tr-none rounded-br-none"
        type="number"
        placeholder="Amount"
      />
      <button
        onclick="handleBid(event)"
        class="button w-full rounded-tl-none rounded-bl-none"
      >
        Place Bid
      </button>
    </form>
  </div>
</div>
`;

  main.innerHTML = data;
  createCountDown();
}

let countDownElement;
let countDown;

function createCountDown() {
  countDownElement = document.getElementById("count-down");
  countDown = new Date(auctionData.endsAt).getTime();

  calculateRemainingTime();

  setInterval(function () {
    calculateRemainingTime();
  }, 1000);
}

function calculateRemainingTime() {
  let now = new Date().getTime();
  let distance = countDown - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countDownElement.innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s " + "left";

  if (distance < 0) {
    countDownElement.innerHTML = "AUCITON HAS ENDED";
  }
}

function handleBid(event) {
  event.preventDefault();

  if (!user) {
    window.location.href = "login.html";
  }

  const amount = document.querySelector('input[name="amount"]').value;

  request
    .post(
      `https://api.noroff.dev/api/v1/auction/listings/${auctionData.id}/bids`,
      {
        amount: Number(amount),
      }
    )
    .then((res) => {
      console.log(res);
      window.location.reload();
      // getAuctionData();
    })
    .catch((e) => {
      for (let error of e.errors) {
        alert(error.message);
      }
    });
}
