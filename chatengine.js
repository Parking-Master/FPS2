typeof Parse == "undefined" && import("https://unpkg.com/parse@3.4.4/dist/parse.min.js");
Parse.initialize("gwlM6egCi027TOsKb5f1jznv32JyWtrvfqin5v4W", "ZJQWbKcGrD8iWwSeMR71Y7wAh0yMBo3Ph2bGEDsm");
Parse.serverURL = "https://parseapi.back4app.com/";
ChatHistory = new Parse.Object.extend("Chat");
chatHistory = {};
(async () => {
chatHistory.add = function() {
  function getHistory() {
    return new Promise(function(resolve, reject) {
      (async() => {
        let e = !1;
        const t = Parse.Object.extend("ChatHistory");
        const n = new Parse.Query(t);
        const s = await n.find();
        for (let t = 0; t < s.length; t++) {
          const n = Parse.Object.extend("ChatHistory");
          new Parse.Query(n).get(s[t].id).then((t => {
            resolve(t);
          }));
        }
      })();
    });
  }
  getHistory().then((chistory) => {
    let prefix = !chistory.get("history") ? "" : ",";
    let message = prefix + encodeURIComponent(arguments[0].toString().trim());
    chistory.set("history", chistory.get("history") + message);
    chistory.save();
  });
}
chatHistory.get = function(callback) {
  (async() => {
    let e = !1;
    const t = Parse.Object.extend("ChatHistory");
    const n = new Parse.Query(t);
    const s = await n.find();
    for (let t = 0; t < s.length; t++) {
      const n = Parse.Object.extend("ChatHistory");
      new Parse.Query(n).get(s[t].id).then((t => {
        callback(t.get("history"));
      }));
    }
  })();
}
})();
