var socket = io();
socket.on('load-feed', function(data){
  for(let i = 0; i < data.feeds.length; i++){
      console.log("Adding", i);
      var newArticle = document.createElement("article");
      var title = document.createElement("h3");
      var a = document.createElement("a");
      a.href = data.feeds[i].link[0];
      a.textContent = data.feeds[i].title[0];
      title.appendChild(a);
      newArticle.appendChild(title);
      var desc = document.createElement("p");
      desc.textContent = data.feeds[i].description[0];
      newArticle.appendChild(desc);
      document.getElementById("feed-container").appendChild(newArticle);
  }
});
