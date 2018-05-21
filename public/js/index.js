var socket = io();
function stripHtml(inputText){
  //-- remove BR tags and replace them with line break
  returnText = inputText;
  returnText=returnText.replace(/<br>/gi, "\n");
  returnText=returnText.replace(/<br\s\/>/gi, "\n");
  returnText=returnText.replace(/<br\/>/gi, "\n");

  //-- remove P and A tags but preserve what's inside of them
  returnText=returnText.replace(/<p.*>/gi, "\n");
  returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

  //-- get rid of more than 2 spaces:
  returnText = returnText.replace(/ +(?= )/g,'');

  //-- get rid of html-encoded characters:
  returnText=returnText.replace(/&nbsp;/gi," ");
  returnText=returnText.replace(/&amp;/gi,"&");
  returnText=returnText.replace(/&quot;/gi,'"');
  returnText=returnText.replace(/&lt;/gi,'<');
  returnText=returnText.replace(/&gt;/gi,'>');
  return returnText;
};

socket.on('load-feed', function(data){
  var loading_text = document.getElementById("loading_text")
  loading_text.parentNode.removeChild(loading_text);
  for(let i = 0; i < data.feeds.length; i++){
      console.log("Adding", i);
      var newArticle = document.createElement("article");
      var title = document.createElement("h3");
      var a = document.createElement("a");
      a.href = stripHtml(data.feeds[i].link[0]);
      a.textContent = stripHtml(data.feeds[i].title[0]);
      title.appendChild(a);
      newArticle.appendChild(title);
      var desc = document.createElement("p");
      desc.textContent = stripHtml(data.feeds[i].description[0]);
      newArticle.appendChild(desc);
      document.getElementById("feed-container").appendChild(newArticle);
  }
});
