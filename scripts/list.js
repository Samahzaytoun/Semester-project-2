if (!user) {
  window.location.href = "login.html";
}

getMyListings();

function getMyListings() {
  request
    .get(
      `https://api.noroff.dev/api/v1/auction/profiles/${user.name}/listings?_seller=true&sort=created&sortOrder=desc`
    )
    .then((res) => {
      var auctionListElement = document.getElementById("auction-list");

      if (res.length === 0) {
        auctionListElement.innerHTML = "You have no listings";
        return;
      }

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
        <div class="p-2 flex justify-between items-center">
          <div class="flex gap-2 items-center font-medium">
            <div class="w-10 h-10 bg-black rounded-full overflow-hidden">
              <img class="w-full h-full object-cover" src="${auction?.seller?.avatar}" />
            </div>
            <div>${auction?.seller?.name}</div>
          </div>
          <div onclick="handleListDeletion(event,'${auction.id}')"><button class="w-8 h-8 bg-gray-50 border shadow rounded-md">❌</button></div>
        </div>
      </a>`;
        auctionListElement.insertAdjacentHTML("beforeend", auctionCard);
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

function handleListDeletion(event, id) {
  event.preventDefault();

  if (confirm("Are you sure you want to delete this listing?")) {
    request
      .delete(`https://api.noroff.dev/api/v1/auction/listings/${id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
