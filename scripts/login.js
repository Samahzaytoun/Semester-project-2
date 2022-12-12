function handleLogin(event) {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  request
    .post("https://api.noroff.dev/api/v1/auction/auth/login", {
      email: email,
      password: password,
    })
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res));
      user = res;
      window.location.href = "index.html";
    })
    .catch((e) => {
      if (e.errors) {
        for (let key in e.errors) {
          alert(e.errors[key].message);
        }
      }
    });
}
