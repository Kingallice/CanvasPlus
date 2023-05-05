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

function CanvasGradeOverlays() {
	try {
		if(window.location.href.split('/').length > 4)
			return;
		function httpGet()
		{
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", mainCanvasURL+'/api/v1/users/self/courses?include[]=total_scores&enrollment_state=active&per_page=20', false ); // false for synchronous request
			xmlHttp.send( null );
			getParts(xmlHttp.response);
		}
		function getParts(response){
			response = JSON.parse(response);
			response.forEach(function t(x){
				temp = getGradeText(x)
				setGrade(temp[0], temp[1])
			});
		}
		function setGrade(name, grade){
			elementArr = document.getElementsByClassName("ic-DashboardCard");
			for(let i = 0; i < elementArr.length; i++){
				x = elementArr[i];
				if(name == x.getAttribute("aria-label")){
					a = x.children[0];
					b = a;
					node = document.createElement("div");
					text = document.createTextNode(grade);
					node.appendChild(text);
					node.className = 'grade-overlay'
					//node.style = "position:absolute; top:0; left:0; text-align:center; font-size:15pt; color:white; padding:10px; background-color:black; border-radius: 0 0 25px 0; width: 75px;";
					b.appendChild(node);
				}
			}
		}

		overlay = document.createElement("div");
		overlay.className = "CanvasPlus-element";
		overlay.onload = httpGet();

		document.body.appendChild(overlay);
	}
	catch(e){
		//console.log(e)
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

function getCourses(){
	let data = []
	let i = 0
	while(true){
		i++;
	//for(let i = 1; i < 5; i++){
		let xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", mainCanvasURL+'/api/v1/users/self/courses?include[]=total_scores&enrollment_state=active&per_page=20&page='+i, false);
		/*
		if(event.target.readyState == 4){
					let temp = JSON.parse(event.target.response);
					if(temp.length > 0)
						temp.forEach(element => {
							canvasData["courses"].push(JSON.stringify(element));
						})
				}
			}*/
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

function getCourseDataByID(courseID){
	for(let i = 0; i < CanvasData["courses"].length; i++){
		if (CanvasData["courses"][i]["id"] == courseID)
			return CanvasData["courses"][i];
	}
	return false
}
function getCourseDataByCode(courseCode){
	for(let i = 0; i < CanvasData["courses"].length; i++){
		if (CanvasData["courses"][i]["course_code"] == courseCode)
			return CanvasData["courses"][i];
	}
	return false
}

const init = function(){
	CanvasGradeOverlays();
	CanvasClassGrade();

	CanvasData["courses"] = getCourses();

	listObj = document.getElementsByClassName("ic-DashboardCard__header-subtitle")
	for(let i = 0; i < listObj.length; i++){
		console.log(getCourseDataByCode(listObj[i].innerHTML))
	}
	//console.log(getCourseDataByCode("CYBR-435-01.1231"));
	// inject = document.createElement("div");
	// inject.className = "CanvasGrades-element";
	// inject.onload = httpGet();
	
	console.log("Injection Complete");
}
try {
	init();
}
catch(e){
	console.log(e);
}