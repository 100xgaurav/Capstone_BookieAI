chrome.browserAction.onClicked.addListener(function() {
  chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
    var bookmarks = [];
    var processNode = function(node) {
      if(node.url) bookmarks.push(node.url);
      if(node.children) node.children.forEach(processNode);
    };
    bookmarkTreeNodes.forEach(processNode);
    
    // Send bookmarks to your Streamlit app
    fetch('http://localhost:5000/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmarks),
    }).then(response => {
      if (response.ok) {
        chrome.browserAction.setBadgeText({text: "✓"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#4CAF50"});
        alert('Bookmarks sent successfully! You can now return to the Streamlit app.');
      } else {
        throw new Error('Network response was not ok.');
      }
    }).catch(error => {
      console.error('Error sending bookmarks:', error);
      chrome.browserAction.setBadgeText({text: "X"});
      chrome.browserAction.setBadgeBackgroundColor({color: "#F44336"});
      alert('Error sending bookmarks. Make sure the Streamlit app is running and try again.');
    });
  });
});
