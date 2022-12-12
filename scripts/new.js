if (!user) {
  window.location.href = "login.html";
}

let mediaManager = document.getElementById("media-manager");
let mediaManagerInput = document.getElementById("image-input");
let mediaHolder = document.getElementById("media-holder");

let tagManager = document.getElementById("tags-manager");
let tagManagerInput = document.getElementById("tag-input");
let tagHolder = document.getElementById("tags-holder");

let medias = [];
let tags = [];

function handleAddMedia() {
  let value = mediaManagerInput.value;

  if (!value) {
    return alert("Please enter an image url");
  }

  let regex = new RegExp(
    "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
    "i"
  );

  if (!regex.test(value)) {
    return alert("Please enter a valid url");
  }

  medias.push(value);
  UpdateMediaRender();
}

function UpdateMediaRender() {
  if (!medias.length) {
    mediaHolder.classList.add("hidden");
  } else {
    mediaHolder.classList.remove("hidden");
  }

  mediaHolder.innerHTML = "";
  medias.map((media, index) => {
    let mediaCard = `
    <button onclick="handleImageDelete(${index})" class="w-1/4 h-40 bg-gray-50 rounded-lg border overflow-hidden shrink-0">
      <img class="w-full h-full object-cover" src="${media}" />
    </button>
    `;
    mediaHolder.insertAdjacentHTML("beforeend", mediaCard);
  });

  mediaManagerInput.value = "";
}

function handleImageDelete(index) {
  medias.splice(index, 1);
  UpdateMediaRender();
}

function handleAddTag() {
  let value = tagManagerInput.value;

  if (!value) {
    return alert("Please enter a tag");
  }

  tags.push(value);
  UpdateTagRender();
}

function UpdateTagRender() {
  if (!tags.length) {
    tagHolder.classList.add("hidden");
  } else {
    tagHolder.classList.remove("hidden");
  }

  tagHolder.innerHTML = "";
  tags.map((tag, index) => {
    let tagCard = `
    <button onclick="handleTagDelete(${index})" class="px-2 py-1 bg-gray-100 rounded-lg border overflow-hidden shrink-0 hover:bg-red-200 hover:text-white">
      ${tag}
    </button>
    `;
    tagHolder.insertAdjacentHTML("beforeend", tagCard);
  });

  tagManagerInput.value = "";
}

function handleTagDelete(index) {
  tags.splice(index, 1);
  UpdateTagRender();
}

function handleNewListing(event) {
  event.preventDefault();

  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let endsAt = document.getElementById("endsAt").value;

  request
    .post("https://api.noroff.dev/api/v1/auction/listings", {
      title,
      description,
      endsAt,
      media: medias,
      tags,
    })
    .then((res) => {
      window.location.href = "auction.html?id=" + res.id;
    })
    .catch((e) => {
      for (let key in e.errors) {
        alert(e.errors[key].message);
      }
    });
}
