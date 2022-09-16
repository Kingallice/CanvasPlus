try{
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		if(changeInfo.status == "complete"){
			chrome.scripting.executeScript({
				files: ['Injection.js'],
				target: {tabId: tab.id}
			});
			chrome.scripting.insertCSS({
				target: { tabId: tab.id },
				files: ['Styles.css']
			});
		}
	});
}catch(e){
	console.log(e);
}