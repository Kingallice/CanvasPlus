try{
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if(changeInfo.status == "complete"){
			chrome.scripting.executeScript({
				files: ['WebRequest.js'],
				target: {tabId: tab.id}
			});
			chrome.scripting.insertCSS({
				target: { tabId: tab.id },
				files: ["style.css"]
			});
		}
	});
}catch(e){
	console.log(e);
}