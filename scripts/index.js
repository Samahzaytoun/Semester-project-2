getMyListings();

function getMyListings() {
  request
    .get(
      "https://api.noroff.dev/api/v1/auction/listings?_seller=true&sort=created&sortOrder=desc"
    )
    .then((res) => {
      let auctionListElement = document.getElementById("auction-list");
      auctionListElement.innerHTML = "";

      res.map((auction) => {
        let auctionCard = `
        <a
        href="auction.html?id=${auction.id}"
        class="w-full overflow-hidden relative bg-gray-50 rounded-lg border"
      >
        <img
          class="w-full h-[250px] object-fit overflow-hidden rounded-lg"
          src=${auction.media[0]}
          alt=""
        />
        <div class="p-2">
          <div class="flex gap-2 items-center font-medium">
            <div class="w-10 h-10 bg-black rounded-full overflow-hidden">
              <img class="w-full h-full object-cover" src="${auction?.seller?.avatar}" />
            </div>
            <div>${auction?.seller?.name}</div>
          </div>
        </div>
      </a>`;
        auctionListElement.insertAdjacentHTML("beforeend", auctionCard);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
