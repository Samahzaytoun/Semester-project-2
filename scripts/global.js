var request = {
  get: get,
  post: post,
  put: put,
  delete: deleteReq,
};
var user = null;
var profileHolder = document.getElementById("profile-holder");

try {
  user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    request
      .get(`https://api.noroff.dev/api/v1/auction/profiles/${user.name}`)
      .then((res) => {
        user = {
          ...user,
          ...res,
        };
        localStorage.setItem("user", JSON.stringify(user));
        UpdateProfile();
      })
      .catch((e) => {
        console.log(e);
      });
  }
} catch (error) {
  console.log(error);
  // window.location.href = "login.html";
}

UpdateProfile();
function UpdateProfile() {
  if (profileHolder && user) {
    profileHolder.innerHTML = `
     <div class="flex gap-2 items-center">
      <button onclick="handleLogout()" class="button text-sm">Logout</button>
      <div class="bg-green-500/10 rounded-md border border-green-500 text-green-500 py-1 px-3">${
        user.credits
      }$</div>
      <div class="flex gap-2 items-center font-medium">
      <button onclick="handleProfileUpdate()" class="w-10 h-10 bg-gray-100 border rounded-full overflow-hidden flex items-center 
      justify-center text-3xl overflow-hidden">
        ${
          user.avatar
            ? `<img class="w-full h-full object-cover" src="${user.avatar}" />`
            : "🙎"
        }
      </button>
      </div>
     </div>
    `;
  }
}

// if (
//   !user &&
//   window.location.pathname != "/login.html" &&
//   window.location.pathname != "/register.html"
// ) {
//   try {
//     user = JSON.parse(localStorage.getItem("user"));

//     if (!user) {
//       window.location.href = "/login.html";
//     }
//   } catch (error) {
//     window.location.href = "login.html";
//   }
// }

async function get(url, headers) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(JSON.parse(this.responseText));
        }
      }
    };

    xhttp.open("GET", url, true);

    xhttp.setRequestHeader("content-type", "application/json");

    if (user) {
      xhttp.setRequestHeader("Authorization", `Bearer ${user.accessToken}`);
    }

    if (headers) {
      for (var key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
      }
    }

    xhttp.send();
  });
}

async function post(url, data, headers) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(JSON.parse(this.responseText));
        }
      }
    };

    xhttp.open("POST", url, true);

    xhttp.setRequestHeader("content-type", "application/json");

    if (user) {
      xhttp.setRequestHeader("Authorization", `Bearer ${user.accessToken}`);
    }

    if (headers) {
      for (var key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
      }
    }

    xhttp.send(JSON.stringify(data));
  });
}

async function put(url, data, headers) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(this.responseText));
        } else {
          reject(JSON.parse(this.responseText));
        }
      }
    };

    xhttp.open("PUT", url, true);

    xhttp.setRequestHeader("content-type", "application/json");

    if (user) {
      xhttp.setRequestHeader("Authorization", `Bearer ${user.accessToken}`);
    }

    if (headers) {
      for (var key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
      }
    }

    xhttp.send(JSON.stringify(data));
  });
}

async function deleteReq(url, data, headers) {
  return new Promise((resolve, reject) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status >= 200 && this.status < 300) {
          // resolve(JSON.parse(this.responseText));
          resolve(true);
        } else {
          reject(JSON.parse(this.responseText));
        }
      }
    };

    xhttp.open("DELETE", url, true);

    xhttp.setRequestHeader("content-type", "application/json");

    if (user) {
      xhttp.setRequestHeader("Authorization", `Bearer ${user.accessToken}`);
    }

    if (headers) {
      for (var key in headers) {
        xhttp.setRequestHeader(key, headers[key]);
      }
    }

    xhttp.send(JSON.stringify(data));
  });
}

function handleLogout() {
  localStorage.removeItem("user");
  window.location.reload();
}

function handleProfileUpdate() {
  const url = prompt("Please enter your new avatar URL");

  if (!url) return;

  request
    .put(`https://api.noroff.dev/api/v1/auction/profiles/${user.name}/media`, {
      avatar: url,
    })
    .then(() => {
      window.location.reload();
    })
    .catch((e) => {
      console.log(e);
    });
}
