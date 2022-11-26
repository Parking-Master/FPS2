userMan = {};
userMan.isLoggedIn = false;
if (!!localStorage["userman-name"] && !!localStorage["userman-pass"]) {
  userMan.isLoggedIn = true;
}
setInterval(() => {
  if (!!localStorage["userman-name"] && !!localStorage["userman-pass"]) {
    userMan.isLoggedIn = true;
  }
}, 1000);
userMan.errorCodes = {
  101: "Information is wrong",
  200: "Error parsing input",
  201: "Values are missing"
};
userMan.logIn = function logIn(username, password, callback, err, additionalRows = null, redirectTo = null) {
  callback("Hold on, we're working on it...");
  let user = Parse.User.logIn(username, password).then(function(user) {
    callback("Logged in. Redirecting...");
    localStorage.setItem("userman-name", username);
    localStorage.setItem("userman-pass", password);
    if (additionalRows) {
      additionalRows.forEach(x => {
        localStorage.setItem("userman-" + x.trim(), user.get(x));
      });
    }
    setTimeout(() => {
      if (redirectTo) return location.replace(redirectTo.toString());
      parent.postMessage("reload", "*");
      parent.document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }, 1000);
  }).catch(function(error) {
    console.log(error);
    err("Error: Failed to login. Check your password and try again.\n\nError Code: " + error.code + " (" + userMan.errorCodes[error.code] + ")");
  });
}
userMan.logOut = function logOut(reload = true) {
  Parse.User.logOut();
  Object.keys(localStorage).forEach(x => x.startsWith("userman-") && localStorage.removeItem(x));
  sessionStorage.clear();
  reload && location.reload(true);
}
userMan.signUp = async function signUp(username, password, extraRows, callback, err, loginPath) {
  if (!username) {
    return err("Please enter a username.");
  }
  if (!password) {
    return err("Please enter a password.");
  }
  if (password.length < 8) {
    return err("Please enter a password longer than 7 characters.");
  }
  if (password.length > 20) {
    return err("Please enter a password shorter than 20 characters.");
  }
  if (username.length < 3) {
    return err("Please enter a username longer than 2 characters.");
  }
  if (username.length > 12) {
    return err("Please enter a username shorter than 12 characters.");
  }
  if (/[\ \#\$\%\^\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\.\,]|[^\u0000-\u00ff]/.test(password)) {
    return err("Password contains invalid characters!");
  }
  if (/[\#\%\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\,]|[^\u0000-\u00ff]/.test(username)) {
    return err("Username contains invalid characters!");
  }
  let user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  Object.keys(extraRows).forEach(x => {
    user.set(x.toString().trim(), extraRows[x]);
  });
  try {
    user = await user.save();
    if (user !== null) {
      callback({
        text: "Success! You will need to log in now.",
        button: "Log in"
      }).then(() => parent == window ? location.replace(loginPath || "login.html") : parent.postMessage("login", "*"));
    }
  } catch (error) {
    error.code == 202 ? err("Error: A user already exists with that username.") : err(error.message);
    console.log(error);
  }
}
userMan.get = function(row) {
  return localStorage["userman-" + row.trim().replace("user", "").replace("word", "")];
}
userMan.set = function(key, value, callback) {
  if (key == "password") {
    return;
  }
  let username = userMan.get("username");
  let password = userMan.get("password");
  Parse.User.logOut();
  let user = Parse.User.logIn(userMan.get("username"), userMan.get("password")).then(function(user) {
    user.set(key.toString().trim(), value);
    user.save();
    Object.keys(localStorage).forEach(x => (x.startsWith("userman-") && x != "userman-pass" && callback(x, user.get(x.split("-")[1].replace(/\bpass\b/, "password").replace(/\bname\b/, "username")), localStorage.setItem(x, user.get(x.split("-")[1].replace(/\bname\b/, "username"))))));
  });
}
userMan.update = function() {
  let username = userMan.get("username");
  let password = userMan.get("password");
  Object.keys(localStorage).forEach(key => {
    if (!key.startsWith("userman")) return;
    Parse.User.logOut();
    let user = Parse.User.logIn(username, password).then(function(user) {
      localStorage[key] = key.includes("pass") ? password : user.get(key.split("-")[1].replace(/\bpass\b/, "password").replace(/\bname\b/, "username"));
    });
  });
}