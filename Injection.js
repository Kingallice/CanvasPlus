function CanvasGradeOverlays() {
	function httpGet()
	{
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", window.location.href+'/api/v1/users/self/courses?include[]=total_scores&enrollment_state=active&per_page=20', false ); // false for synchronous request
		xmlHttp.send( null );
		getParts(xmlHttp.response);
	}
	function getParts(response){
		response = JSON.parse(response);
		response.forEach(function t(x){
			if(x["enrollments"][0]["computed_current_score"] != null){
				setGrade(x["name"],x["enrollments"][0]["computed_current_score"] + "%");
			}
			else {
				setGrade(x["name"],"N/A");
			}
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
	overlay.className = "CanvasGrades-element";
	overlay.onload = httpGet();

	return overlay
}

const init = function(){
	// inject = document.createElement("div");
	// inject.className = "CanvasGrades-element";
	// inject.onload = httpGet();
	document.body.appendChild(CanvasGradeOverlays());
	console.log("Injection Complete");
}
init();