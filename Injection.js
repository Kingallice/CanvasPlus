mainCanvasURL = 'https://'+window.location.href.split('/')[2];
var CanvasData = {}

function getGradeText(jsonResponse){
	if(jsonResponse["enrollments"][0]["computed_current_score"] != null){
		return[jsonResponse["name"],jsonResponse["enrollments"][0]["computed_current_score"] + "%"];
	}
	else {
		return [jsonResponse["name"],"N/A"];
	}
}

function CanvasClassGrade() {
	try {
		if(!window.location.href.includes('courses'))
			return;
		
		function httpGet(id)
		{
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", mainCanvasURL+'/api/v1/courses/'+id+'?include[]=total_scores', false ); // false for synchronous request
			xmlHttp.send( null );
			return xmlHttp.response;
		}
		courseID = window.location.href.split('/')
		courseID = courseID[courseID.indexOf('courses')+1]
		console.log(getGradeText(JSON.parse(httpGet(courseID))))
		div = document.createElement('div')
		text = document.createTextNode(getGradeText(JSON.parse(httpGet(courseID)))[1])
		div.appendChild(text)
		div.className = 'current-grade';
		document.getElementsByClassName('ic-app-nav-toggle-and-crumbs')[0].insertBefore(div.cloneNode(true), document.getElementsByClassName('right-of-crumbs')[0]);
		document.getElementsByClassName('mobile-header-space')[0].appendChild(div.cloneNode(true))
		
	}
	catch(e){
		console.log(e)
	}
}

//Adds all courses of the user to an array as json objects and returns it
function getCourses(){
	let data = []
	let i = 0
	while(true){
		i++;
		let xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", mainCanvasURL+'/api/v1/users/self/courses?include[]=total_scores&enrollment_state=active&per_page=20&page='+i, false);
		xmlHttp.send();
		temp = JSON.parse(xmlHttp.response)
		if(temp.length <= 0)
			break;
		for(let j = 0; j < temp.length; j++){
			data.push(temp[j])
		}
	}
	return data;
}

//Gets course data of user using a course id
function getCourseDataByID(courseID){
	for(let i = 0; i < CanvasData["courses"].length; i++){
		if (CanvasData["courses"][i]["id"] == courseID)
			return CanvasData["courses"][i];
	}
	return false
}
//Gets course data of user using a course code
function getCourseDataByCode(courseCode){
	for(let i = 0; i < CanvasData["courses"].length; i++){
		if (CanvasData["courses"][i]["course_code"] == courseCode)
			return CanvasData["courses"][i];
	}
	return false
}

//Goes through all current cards on the dashboard and grabs data to add to card.
//1. Adds current grade percentage to the card if enrolled as student and grade exists, if grade is unavailable, then N/A will be shown
function addToCards(){
	listObj = document.getElementsByClassName("ic-DashboardCard__header-subtitle")
	for(let i = 0; i < listObj.length; i++){
		temp = getCourseDataByCode(listObj[i].innerHTML)
		if (temp && Object.keys(temp).indexOf("enrollments") != -1){
			for(let j = 0; j < Object.keys(temp["enrollments"]).length; j++){
				enrollData = temp["enrollments"][j]
				if(Object.keys(enrollData).indexOf('type') != -1
					&& enrollData["type"] == "student"
					&& Object.keys(enrollData).indexOf('computed_current_score') != -1)
				{
					addGradeToCard(listObj[i].parentElement.parentElement.parentElement, enrollData["computed_current_score"])
					break;
				}
			}
		}
	}

}
//Adds a grade overlay to the obj with the value of grade
function addGradeToCard(obj, grade){
	div = document.createElement('div')
	text = document.createTextNode("N/A")
	if(grade)
		text = document.createTextNode(grade + "%")
	div.appendChild(text)
	div.className = 'grade-overlay';
	obj.appendChild(div)
}

function removeSurveyPrompt(){
	button = document.getElementsByClassName("ek-widget-btn-primary")
	if (button.length > 0){
		evalhref = document.getElementsByClassName("ek-widget-btn-primary")[0].href
		evalLink = document.createElement('a')
		evalText = document.createTextNode("Student Evals")
		evalLink.appendChild(evalText)
		evalLink.href = evalhref
		document.getElementById("footer-links").appendChild(evalLink)
		document.body.removeChild(document.getElementById("ek-modal"))
		document.body.removeChild(document.getElementById("ek-overlay"))
	}
}

const init = function(){
	//CanvasGradeOverlays();
	CanvasClassGrade();

	CanvasData["courses"] = getCourses();//Sets CanvasData["courses"] to an array of all of the user courses

	addToCards(); //Adds features to dashboard cards
	removeSurveyPrompt(); //Removes the prompt to do course evaluations
	console.log("Injection Complete");
}
try {
	init();
}
catch(e){
	console.log(e);
}