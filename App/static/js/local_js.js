function encodeQueryData(data) {
	//encodes a dict to an HTTP GET string
	const ret = [];
	for (let d in data)
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	return ret.join('&');
 }


//this is messing up, giving + for a space!!!
 function findGetParameter(param) {
	let url = new URL(window.location.href);
	let result = url.searchParams.get(param);
    return result;
}
 

 $(document).ready(function() {
	//these are the regex page selectors to isolate js code to specific pages
	let regex = {};
	regex["admin_summary"] = /\/admin_summary\.html/i;
	regex["edit_quiz"] = /\/edit_quiz\.html/i;
	regex["student_summary"] = /\/student_summary\.html/i;
	regex["take_quiz"] = /\/take_quiz\.html/i;
	regex["admin_stats"] = /\/admin_stats\.html/i;
	regex["student_stats"] = /\/student_stats\.html/i;
		

	if (window.location.pathname.search(regex["admin_stats"]) != -1) {
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');

		//update the username in the header
		$("#username").text(username);
	}
	if (window.location.pathname.search(regex["student_stats"]) != -1) {
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');

		//update the username in the header
		$("#username").text(username);
	}
	
	
	//##########################3
	//Admin summary page
	//This will go to the admin_summary page which shows a summary table of all quizes
    //this page allows the admin to click on a quiz to edit it, or use the bulk import/export/delete buttons
	if (window.location.pathname.search(regex["admin_summary"]) != -1) {
		//this builds the table of quizes to administer
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');

		//Do the Ajax Request here to fetch the admin summary table data (qset_summary)
		$.ajax({
			type: 'POST',
			url: '/admin_summary_json',
			data: JSON.stringify({"u_id":u_id}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				build_admin_summary(u_id, username, data["data"]);
			},
		});
	} 



	//student_summary page
	//This will go to the student quiz summary page, the student can see the staus of the quizes and select a quiz t take
	if (window.location.pathname.search(regex["student_summary"]) != -1) {
		//this builds the table of quizes to take
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');

		//Do the Ajax Request here to fetch the student summary table data (qset_summary)
		$.ajax({
			type: 'POST',
			url: '/student_summary_json',
			data: JSON.stringify({'u_id':u_id}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				build_student_summary(u_id, username, data["data"]);
			},
		});
	} 



	//Take Quiz page
	//This loads the selected quiz and allows the student to answer the questions, the student can save as they go, the link for final commit is the top left nav bar
	if (window.location.pathname.search(regex["take_quiz"]) != -1) {
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');
		let qset_id = findGetParameter('qset_id');

		//Do the Ajax Request here to fetch the take_quiz data
		$.ajax({
			type: 'POST',
			url: '/take_quiz_json',
			data: JSON.stringify({"u_id":u_id,"qset_id":qset_id}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				build_take_quiz(u_id, username, data["data"]);
			},
		});
	}



	//edit_quiz page
	//This allows the admin to edit a quiz: adjust the order of text/image elements, set the answer type, add/delete text/image elements, import new .quiz spec to overwrite
	if (window.location.pathname.search(regex["edit_quiz"]) != -1) {
		//the user id comes form the previous page
		let u_id = findGetParameter('u_id');
		let username = findGetParameter('username');
		let qset_id = findGetParameter('qset_id');

		//Do the Ajax Request here to fetch the take_quiz data
		$.ajax({
			type: 'POST',
			url: '/edit_quiz_json',
			data: JSON.stringify({"u_id":u_id,"qset_id":qset_id}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				build_edit_quiz(u_id, username, data["data"]);
			},
		});
	} //end of the edit_quiz code
}); //end of the on_load section




//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
function build_admin_summary(u_id, username, qset_summary) {
	//this does the html table building				
	//update the username in the header
	$("#username").text(username);

	//does the table header
	let html_text = ""; 
	html_text = '<table class="table table-hover table-striped table-responsive" id="quiz-admin-table">' + '\n';
	html_text +='	<thead>' + '\n';
	html_text +='		<tr>' + '\n';
	html_text +='          <th scope="col">#</th>' + '\n';
	for (header_item of qset_summary[0]) {
		html_text +='          <th scope="col">'+ header_item +'</th>' + '\n';
	}
	html_text +='     	</tr>' + '\n';
	html_text +='   </thead>' + '\n';

	//does the table body
	html_text +='   <tbody>' + '\n';
	for (x = 1; x < qset_summary.length; x++){
		let ind = Number(x);
		html_text +='       <tr class="click-enable">' + '\n';
		html_text +='	       <td>' + ind + '</td>' + '\n';
		html_text +='	       <td id="qset-id">' + qset_summary[ind][0] + '</td>' + '\n';
		for (y = 1; y < qset_summary[ind].length; y++){
			let ind_inner = Number(y);
			html_text +='	       <td>' + qset_summary[ind][ind_inner] + '</td>' + '\n';
		}
		html_text +='       </tr>' + '\n';
	}
	html_text +='   </tbody>' + '\n';
	html_text += '</table>' + '\n';
	
	//append to the DOM
	$("#p-quiz-admin-table").append(html_text);

	//runs the datatable plugin on the table to make it sortable etc...
	$('#quiz-admin-table').DataTable({
		//"paging":true,"ordering":true,columnDefs: [{"orderable": false,"targets":0}],"order": [] 
	});

	//assigns a click listener to the table rows
	$("#quiz-admin-table tbody tr.click-enable").click(function() {
		//This is temporary for now
		let qset_id = $(this).find("td#qset-id").text();
		
		alert("we need to GET 'take_quiz.html' with params:\nqset_id: " + qset_id + "\nu_id: " + u_id + "\nusername: " + username);

		//build the target url
		let query_data = encodeQueryData({"qset_id":qset_id,
										"u_id":u_id,
										"username":username});
		window.location = "./edit_quiz.html" + "?" + query_data;
	});



	//###############################
	//This controls the export and delete collapse areas so only one is showing at a time
	//#################################################################################
	$("#btn-delete").on("click", function() {
		$('#import-config').collapse('hide');
		$('#export-config').collapse('hide');
	});

	$("#btn-export").on("click", function() {
		$('#import-config').collapse('hide');
		$('#delete-config').collapse('hide');
	});


	//###############################
	//Handles the delete button
	//#################################################################################
	$("#btn-delete-submit").on("click", function() {
		// here you need to request that the server deletes the given quiz ids
		//##############################################
		let qset_id_text = $.trim($("#delete-config-text").val()).split(",");
		
		//get the current set of qs_ids
		let qset_id_db = [];
		for (qset of qset_summary.slice(1,)) {
			qset_id_db.push(qset[0]);
		}
		//get the clean set of requested qs_ids
		let qset_id_req = [];
		for (qset of qset_id_text) {
			if (qset_id_db.includes(qset)){
				qset_id_req.push(qset);
			}
		}

		if (qset_id_req.length != 0) {
			//alert("ajax req to delete the given subset of the qs_ids from the DB:\n" + JSON.stringify(qs_id_req,null,2));
		}
		else{
			alert("no valid quiz ids were given")
			return
		}

		//Do the Ajax Request here to send the delte list to the server
		$.ajax({
			type: 'POST',
			url: '/delete_quiz',
			data: JSON.stringify({"qset_id_req":qset_id_req}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				//for testing
				//alert(JSON.stringify(data,null,2));
				//give a status msg
				//$("#btn-delete-submit").after("<span>&nbsp&nbspStatus: " + JSON.stringify(data) + "</span>");
				$("#span-delete-submit").text("Status: " + data["Status"] + ", msg: " + data["msg"]);
			},
		});
		
	});
	

	//###############################
	//Handles the export button
	//#################################################################################
	$("#btn-export-submit").on("click", function() {
		// here you need to request the quiz data in json format from the server
		//it is using qset_summary whihc is the json object coming in to populate the table in this page
		//##############################################33
		let qset_id_text = $.trim($("#export-config-text").val()).split(",");
		
		//get the current set of qs_ids
		let qset_id_db = [];
		for (qset of qset_summary.slice(1,)) {
			qset_id_db.push(qset[0]);
		}
		//get the clean set of requested qs_ids
		let qset_id_req = [];
		for (qset of qset_id_text) {
			if (qset_id_db.includes(qset)){
				qset_id_req.push(qset);
			}
		}

		if (qset_id_text[0].search(/all/i) != -1) {
			//alert("ajax req to export all quizes:\n" + JSON.stringify(qset_id_db,null,2));
			qset_id_req = qset_id_db;
		}
		else if (qset_id_req.length == 0) {
			alert("no valid quiz ids were given");
			return;
		}

		//Do the Ajax Request here to fetch the desired question sets
		$.ajax({
			type: 'POST',
			url: '/download_quiz',
			data: JSON.stringify({"qset_id_req":qset_id_req}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				//give a status msg
				$("#span-export-submit").text("Status: " + data["Status"] + ", msg: " + data["msg"]);
				//write this to the DOM and trigger the download, then delete from the DOM
				for (qset of data["data"]) {
					let filename = "export_qset_id_" + String(qset[0]["qset_id"]) + ".quiz";
					let el = document.getElementById('a-export');
					let href_text = "data:application/xml;charset=utf-8,";
					href_text += JSON.stringify(qset, null, 2);
					el.setAttribute("href", href_text);
					el.setAttribute("download", filename);
					el.click();
					el.setAttribute("href", "");
					el.setAttribute("download", "");
				}
			},
		});
	});
	



	//###############################
	//Handles the import button
	//#################################################################################
	//assign the onclick event listener to the import button whihc in turn triggers a click on the hidden input button to launch the file dialog
	$("#btn-import").on("click", function() {
		$('#export-config').collapse('hide');
		$('#delete-config').collapse('hide');
		$('#import-config').collapse('show');

		//this resets the control
		document.getElementById("input-import").value = "";

		$("#import-config").text("");
		document.getElementById('input-import').click();
	});
	//this is the onchange evenet handler for the hidden input file selection dialog
	$("#input-import").on("change", function() {
		//this code accepts multiple files, the quiz files should be .quiz and just be a text file of a json object with the correct format specifying the quiz text, answer types and images.  So we validate these files.  Any non .quiz files, are assumed to be associated image files and are just uploaded to the server, there is no crosschecking done locally, that can be done server-side later.  The quizes will still work with no image files, the images just will not render
		
		let files = this.files;
		for (f of files){
			//alert('you selected: ' + f["name"]);
			if (f["name"].search(/\.quiz/i) == -1) {
				//this is for images, upload them 

				//do som evalidation here if you want t avoid non-image files etc...
				let img_allowed = ['image/gif', 'image/jpeg', 'image/png'];
				if (! img_allowed.includes(f["type"])) {
					$("#import-config").append("Your file '" + f["name"] + "' needs to be an image file (jpg, png, gif).  Not uploading it....<br/>");
					continue;
				}
				if ( f["size"] > 1000000) {
					$("#import-config").append("Your file '" + f["name"] + "' is > 1MB, you should try to reduce it for usability fo the web app.  Not uploading it....<br/>");
					continue;
				}

				//send to server
				let form_data = new FormData();
				form_data.append("file", f);
				$.ajax({
					type: 'POST',
					url: '/upload_image',
					data: form_data,
					async: true,
					contentType: false,
					cache: false,
					processData: false,
					success: function(data) {
						//testing
						//alert(JSON.stringify(status));
						$("#import-config").append(JSON.stringify(data,null,2) + "<br/>");
					}
				});

			}
			else {
				//this is for the .quiz files
				//this uses a closure to handle all the file read and to pass the filename in, I still do not understand how it works
				//this is for .quiz text files which contain quiz data in the specified json format.  we validate each one and reject if it fails (informing the user why)
				let reader = new FileReader();
				reader.onload = (function(e1,files_accept) {
					return function(e2) {
						let name = e1.name;
						let file_data = e2.target.result;
						//alert("file length is: " + file_data.length + " chars");
						try{
							let qs_data = JSON.parse(file_data);
						}
						catch(err) {
							$("#import-config").append("failed parsing '" + name + "' not uploading....<br/>");
							//alert('failed parsing ' + name + ' not uploading....');
							return;
						}
						//alert('parsing ' + name + ', then sending to the server');

						////////////////////////////////////////////////
						////////////////////////////////////////////////
						////////////////////////////////////////////////
						////////////////////////////////////////////////
						//NEED TO WRITE THE VALIDATION 
						////////////////////////////////////////////////
						////////////////////////////////////////////////
						////////////////////////////////////////////////
						////////////////////////////////////////////////

						//send to server
						$.ajax({
							type: 'POST',
							url: '/upload_quiz',
							data: JSON.stringify({"qs_data":qs_data}),
							contentType: "application/json",
							data_type: "json",
							cache: false,
							processData: false,
							async: true,
							success: function(data) {
								//for testing
								//alert(JSON.stringify(status,null,2));
								data["msg"] = "Server received: '" + name + "'";
								$("#import-config").append(JSON.stringify(data,null,2) + "<br/>");
							},
						});

					};
				})(f);
				reader.readAsText(f);
			}
		}
	});
} //end of the build_admin_summary function





/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
function build_student_summary(u_id, username, qset_summary) {
	//this does the html table building				
	//update the username in the header
	$("#username").text(username);

	//does the table header
	let html_text = ""; 
	html_text = '<table class="table table-hover table-striped table-responsive" id="quiz-selection-table">' + '\n';
	html_text +='	<thead>' + '\n';
	html_text +='		<tr>' + '\n';
	html_text +='          <th scope="col">#</th>' + '\n';
	for (header_item of qset_summary[0]) {
		html_text +='          <th scope="col">'+ header_item +'</th>' + '\n';
	}
	html_text +='     	</tr>' + '\n';
	html_text +='   </thead>' + '\n';

	//does the table body
	html_text +='   <tbody>' + '\n';
	for (x = 1; x < qset_summary.length; x++){
		let ind = Number(x);
		//enable selection only if the quiz has not been completed yet
		if (qset_summary[ind][5].search(/^(completed|marked)$/i) == -1) {
			html_text +='       <tr class="click-enable">' + '\n';
		}
		else {
			html_text +='       <tr>' + '\n';
		}
		html_text +='	       <th scope="row">' + ind + '</th>' + '\n';
		html_text +='	       <td id="qset-id">' + qset_summary[ind][0] + '</td>' + '\n';
		for (y = 1; y < qset_summary[ind].length; y++){
			let ind_inner = Number(y);
			html_text +='	       <td>' + qset_summary[ind][ind_inner] + '</td>' + '\n';
		}
		html_text +='       </tr>' + '\n';
	}
	html_text +='   </tbody>' + '\n';
	html_text += '</table>' + '\n';
	
	//append to the DOM
	$("#p-quiz-selection-table").append(html_text);

	//runs the datatable plugin on the table to make it sortable etc...
	$('#quiz-selection-table').DataTable();

	//assigns a click listener to the table rows
	$("#quiz-selection-table tbody tr.click-enable").click(function() {
		let qset_id = $(this).find("td#qset-id").text();
		//alert("we need to GET 'take_quiz.html' with params:\nqset_id: " + qset_id + "\nu_id: " + u_id + ",\nusername: " + username);
		//build the target url
		let query_data = encodeQueryData({"qset_id":qset_id,
										"u_id":u_id,
										"username":username});
		window.location = "./take_quiz.html" + "?" + query_data;
	});
}//end of the build_student_summary function








///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
function build_take_quiz(u_id, username, qset_data) {
	//this does the html building				
	let qset_id = qset_data[0]["qset_id"];

	//update the username in the header
	$("#username").text(username);

	//edit the final save link
	let query_data = encodeQueryData({"u_id":u_id,
									"username":username});
	$("#final-save").attr("href","./student_summary.html" + "?" + query_data); 

	//do the title
	html_text = qset_data[0]["qset_name"];
	//append to the DOM
	$("h5#title").append(html_text);

	let active_text = "active";
	let showactive_text = "show active";
	//go through the questions, from index 1 to end of array
	for (let i=1; i < qset_data.length; i++) {
		//this is the actual question sequence, i.e. "Q1", "Q2", "Q3" etc... you need to build this list locally, it is basically "Q" + index+1
		let q_seq = "Q" + String(i); 
		let html_text = ""; 
		
		//sets the first question to be selected initially and also the first of any multi-choices to be selected initially
		if (i > 1) {
			active_text = "";
			showactive_text = "";
		}
		
		//do the menu items
		html_text = '<li class="nav-item"><a class="nav-link ' + active_text + '" id="' + q_seq + '" data-toggle="pill" href="#' + q_seq + '-data" role="tab" aria-controls="' + q_seq + '-data" aria-selected="false">' + q_seq + '</a></li>';
		//append to the DOM
		$("#q_nav ul.nav").append(html_text);

		//question data
		//#######################################
		html_text = '<div class="tab-pane fade ' + showactive_text + '" id="' + q_seq + '-data" role="tabpanel" aria-labelledby="' + q_seq + '">' + '\n';
		html_text += '<h5>' + q_seq + '</h5>' + '\n';
		
		//this goes through the question part list and adds text or image tags as specified
		//the first index of the list is the q_id, so ignore that
		let question_parts = qset_data[i]["question"].slice(1,);
		for (q_part of question_parts) {
			if (q_part["type"] == "text") {
				html_text += '<p>' + q_part["data"] + '</p>' + '\n';
			}
			else if (q_part["type"] == "image") {
				html_text += '<p><img class="inline" src="./static/images/' + q_part["data"] + '"/></p>' + '\n';
			}
		}
		html_text += '<hr>' + '\n';

		//#######################################
		//answer data
		html_text += '<form>' + '\n';
		html_text += 	'<label for="form_group">Answer</label>' + '\n';
		html_text += 	'<div class="form-group" id="form_group">' + '\n';

		//add the mc choices or a textbox
		if ("answer" in qset_data[i] && qset_data[i]["answer"]["type"] == "mc") {
			let checked_text = "checked";
			//goes through the mc items
			//add a blank element ot the start of array to make the indicies 1 based
			let mc_options = qset_data[i]["answer"]["data"];
			mc_options.unshift("");
			for (let j=1; j < mc_options.length; j++) {
				let mc_id = 'mc_' + String(j);
				if (j > 1) checked_text = "";
				html_text += 		'<div class="form-check">' + '\n';
				html_text += 			'<input class="form-check-input" type="radio" name="' + q_seq + '_mc" id="' + mc_id + '" value="' + String(j) + '" ' + checked_text + '>' + '\n';
				html_text += 			'<label class="form-check-label" for="' + mc_id + '">' + mc_options[j] + '</label>' + '\n';
				html_text += 		'</div>' + '\n';
			}
		} else {  //the non-multichoice case
			html_text += 		'<textarea class="form-control" id="' + q_seq + '_A" rows="3"></textarea>' + '\n';
		}
		html_text += 	'</div>' + '\n';
		html_text += 	'<button type="button" class="btn btn-success save-continue">Submit</button>' + '\n';
		html_text += '</form>' + '\n';
		//#######################################
		html_text += '</div>';

		//append to the DOM
		$("#q_data").append(html_text);
	}

	//This assigns some listeners on the take_quiz page
	//####################################################
	//assigns a click listener to the question selection links so they hide on question selection when in smalll screen mode
	$("#q_nav li.nav-item").click(
		function() {
			let x = document.getElementById("q_nav");
			if (x.classList.contains("show")){
				x.classList.remove("show");
			}
		}
	);

	//assigns a click listener to the submit button as well as the finish and submit nav choice
	$(".save-continue, #final-save").click(function() {
		let a_data = {"qset_id":qset_id,"u_id":u_id};
		//sets the final_submit flag to indicate the user closed off the quiz, otherwise the attmpt is not complete even though interim results are saved
		a_data["final_submit"] = 0;
		if ($(this).is('#final-save')) { 
			a_data["final_submit"] = 1;
		}
		//get the answers
		for (let i=1; i < qset_data.length; i++) {
			//this is the actual question sequence, i.e. "Q1", "Q2", "Q3" etc... you need to build this list locally, it is basically "Q" + index+1
			let q_seq = "Q" + String(i);
			//read both for the mc case and the text case, the correct one will not be undefined
			let mc_choice = $("input[name=" + q_seq + "_mc]:checked").val();
			let text_field = $.trim($("#" + q_seq + "_A").val());
			if (mc_choice != undefined) {
				a_data[i] = Number(mc_choice);
			} 
			else {
				a_data[i] = text_field;
			}	
		}

		$.ajax({
			type: 'POST',
			url: '/submit_answers_json',
			data: JSON.stringify({"a_data":a_data}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				//write this to the DOM and trigger the download, then delete from the DOM
				alert("Your answers were submitted with status: " + data["Status"]);
			},
		});
	});  //end of submit answers code
} //end of the build_take_quiz function










///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
function build_edit_quiz(u_id, username, qset_data) {
	let newfiles = [];
	
	//this does the html building				
	let qset_id = qset_data[0]["qset_id"];

	//this does the html building				
	//update the username in the header
	$("#username").text(username);

	//update the final save link
	let query_data = encodeQueryData({"u_id":u_id,
									"username":username});
	$("#final-save").attr("href","./admin_summary.html" + "?" + query_data); 
	
	//do the title
	html_text = qset_data[0]["qset_name"] + ' (qset_id: ' + qset_id + ')';
	//append to the DOM
	$("h5#title").append(html_text);

	let active_text = "active";
	let showactive_text = "show active";

	for (let i=1; i < qset_data.length; i++) {
		//this is the actual question sequence, i.e. "Q1", "Q2", "Q3" etc... you need to build this list locally, it is basically "Q" + index+1
		let q_seq = "Q" + String(i); 
		let html_text = ""; 
		
		//sets the first question to be selected initially and also the first of any multi-choices to be selected initially
		if (i > 1) {
			active_text = "";
			showactive_text = "";
		}
		
		//do the menu items
		html_text = '<li class="nav-item"><a class="nav-link ' + active_text + '" id="' + q_seq + '" data-toggle="pill" href="#' + q_seq + '-data" role="tab" aria-controls="' + q_seq + '-data" aria-selected="false">' + q_seq + '</a></li>';
		//append to the DOM
		$("#q_nav ul.nav").append(html_text);

		//question data
		//#######################################
		html_text = '<div class="tab-pane fade ' + showactive_text + '" id="' + q_seq + '-data" role="tabpanel" aria-labelledby="' + q_seq + '">' + '\n';
		html_text += '<h5>' + q_seq + '</h5>' + '\n';
		html_text += '<button type="button" class="btn btn-success add-text-btn">Add Text</button>' + '\n';
		html_text += '<button type="button" class="btn btn-success add-image-btn">Add Image</button>' + '\n';
		//hidden input button to open the file selection dialog
		html_text += '<input type="file" class="select-image" hidden/>' + '\n';
		
		//this goes through the q_data list and adds text or image tags as specified
		//NOTE: im an using the textbox with class = "im" for images and "txt" for text sections.  I am hiding the textbox for images loaded from the server
		//I need the textboxes as I will use those on exit to determine the structure to upload to the server.
		html_text += '<ul id="sortable">' + '\n';
		let question_parts = qset_data[i]["question"].slice(1,);
		for (q_part of question_parts) {
		//for (y of qset_data[ind]["q_data"]) {
			html_text += '<li><p>' + '\n';
			html_text += '    <button type="button" class="btn btn-danger delete-btn">X</button>' + '\n';
			if (q_part["type"] == "text") {
				html_text += '    <textarea class="form-control txt" rows="3">' + q_part["data"] + '</textarea>' + '\n';
			}
			else if (q_part["type"] == "image") {
				html_text += '    <img class="inline" src="./static/images/' + q_part["data"] + '"/>' + '\n';
			}
			html_text += '</p></li>' + '\n';
		}
		html_text += '</ul>' + '\n';
		html_text += '<hr>' + '\n';

		//#######################################
		//answer data
		html_text += '<form>' + '\n';
		html_text += 	'<label for="form_group">Answer</label>' + '\n';
		html_text += 	'<div class="form-group" id="form_group">' + '\n';
		//add the mc choices or a textbox
		let text = "text";
		if ("answer" in qset_data[i] && qset_data[i]["answer"]["type"] == "mc") {
			text = "mc:\n";
			let mc_options = qset_data[i]["answer"]["data"];
			mc_options.unshift("");
			for (let j=1; j < mc_options.length; j++) 
				text += mc_options[j] + '\n';
		}
		html_text += 		'<textarea class="form-control" id="' + q_seq + '_A" rows="3">' + text + '</textarea>' + '\n';
		html_text += 	'</div>' + '\n';
		html_text += 	'<button type="button" class="btn btn-success save-continue">Submit</button>' + '\n';
		html_text += '</form>' + '\n';
		//#######################################
		html_text += '</div>';

		//append to the DOM
		$("#q_data").append(html_text);

		//this is required for jquery-ui sortable to work
		//you have to do it here AFTER the DOM has been built!!!!
		//note I have to use the class selector first so it selects the multiple instances of #sortable
		//if I use #sortable only, it only selects the first one (you are not meant to duplicate ids)
		$(function() {
			$(".tab-pane ul#sortable").sortable();
			$(".tab-pane ul#sortable").disableSelection();
		});
	}


	
	//This assigns some listeners on the edit_quiz page
	//####################################################
	//assigns a click listener to the question selection links so they hide on question selection when in smalll screen mode
	$("#q_nav li.nav-item").click(
		function() {
			let x = document.getElementById("q_nav");
			if (x.classList.contains("show")){
				x.classList.remove("show");
			}
		}
	);
	
	//add the handlers to the delete and add buttons
	//#######################################
	$(".add-image-btn").click(function (e) {
		//this resets the input control (important)
		for (el of document.getElementsByClassName("select-image")) el.value = "";
		$(e.target.parentNode).find(".select-image").trigger("click",e);
	});

	$(".add-text-btn").click(function (e) {
		add_text(e);
	});

	$(".delete-btn").click(function (e) {
		del_item(e);
	});

	function del_item(e) {
		//this deletes an element from the question
		let ul_parent = e.target.parentNode.parentNode.parentNode;
		let li_parent = e.target.parentNode.parentNode;
		ul_parent.removeChild(li_parent);
		$(ul_parent).sortable('refresh');	
	};

	function add_text(e) {
		//this adds an element to the question, either text or an image
		//build the html li object to add
		let text = "add text here";
		let html_text = "";
		html_text += '<p>' + '\n';
		html_text += '    <button type="button" class="btn btn-danger delete-btn">X</button>' + '\n';
		html_text += '    <textarea class="form-control txt" rows="3">' + text + '</textarea>' + '\n';
		html_text += '</p>' + '\n';
		let li_new = document.createElement("li");
		li_new.setAttribute('class','ui-sortable-handle');
		$(li_new).append(html_text);
		//add to DOM
		let parent = e.target.parentNode;
		$(parent).children("#sortable").prepend(li_new);
		$(parent).children("#sortable").sortable('refresh');	
		//add delete button listener
		$(li_new).find(".delete-btn").click(function (e) {
			del_item(e);
		});
	}

	//this is the onchange evenet handler for the hidden input file selection dialog
	$(".tab-pane .select-image").on("change", function(e) {			
		//selects the freshly added <img> tag for editing
		if (!(this.files && this.files[0])) {
			return;   //if no files were selected
		}
		//get the selected file object 
		let f = this.files[0];
		//############################################
		//do some validation here if you want t avoid non-image files etc...
		if ( f["size"] > 1000000) {
			alert("Your file is > 1MB, you should try to reduce it for usability fo the web app.");
			return;
		}
		let img_allowed = ['image/gif', 'image/jpeg', 'image/png'];
		if (! img_allowed.includes(f["type"])) {
			alert('File needs to be an image file (jpg, png, gif)');
			return;
		}
		//############################################

		newfiles.push(f);

		//add the image part to the question
		add_image_part(e);
		//show the image in the new part
		let img_target = $($(this.parentNode).find("ul").children()[0]).find("img");
		//add some meta to the blob string
		let blob_str = URL.createObjectURL(f);
		//update DOM
		$(img_target).attr("src", blob_str);
		$(img_target).text("./static/images/" + f["name"]);
	});
	

	function add_image_part(e) {
		//this adds an image element to the question
		//build the html li object to add
		let data = "";
		let filename = "";   //this is a locally loaded file object

		let html_text = "";
		html_text += '<p>' + '\n';
		html_text += '    <button type="button" class="btn btn-danger delete-btn">X</button>' + '\n';
		//add the image textbox as hidden for the case we have the file 
		//html_text += '    <textarea class="form-control im" rows="3" hidden>' + filename + '</textarea>' + '\n';
		html_text += '    <img class="inline" src="./static/images/' + filename + '"/>' + '\n';
		html_text += '</p>' + '\n';

		let li_new = document.createElement("li");
		li_new.setAttribute('class','ui-sortable-handle');
		$(li_new).append(html_text);

		//add to DOM
		let parent = e.target.parentNode;
		$(parent).children("#sortable").prepend(li_new);
		$(parent).children("#sortable").sortable('refresh');	

		//add delete button listener
		$(li_new).find(".delete-btn").click(function (e) {
			del_item(e);
		});
	}
	//#######################################


	//assigns a click listener to the submit button as well as the finish and submit nav choice
	$(".save-continue, #final-save").click(function() {
		//so basically here you need to build the whole qset_data object to send
		let qset_data = [{"qset_id":qset_id,"u_id":u_id,"final_submit":0}];
		//sets the final_submit flag to indicate the user closed off the quiz, otherwise the attmpt is not complete even though interim results are saved
		if ($(this).is('#final-save')) qset_data[0]["final_submit"] = 1;
		let text_data = "";
		let blobs = {};   // will hold the DOMstrings and filenames for any added images to upload

		//parses the quiz after edits
		//go through each q
		let questions = $("#q_data").children("div");
		let i = 1;
		for (q of questions) {
			//this is the actual question sequence, i.e. "Q1", "Q2", "Q3" etc... you need to build this list locally, it is basically "Q" + index+1
			let q_seq = "Q" + String(i); 
			let q_data = {"question":[{"q_id":String(i)}]};
			//go through each element of the question
			let q_parts = $(q).children("ul").children("li");
			for (q_part of q_parts) {
				text_data = $(q_part).find("textarea").val();
				if (text_data != undefined) {
					//the item is a textbox
					q_data["question"].push({"type":"text","data":$.trim(text_data)});
				} else {
					//the item is an image
					let target = $(q_part).find("img");
					if (target.attr("src").slice(0,5) == "blob:") {
						//target is a new image					
						text_data = target.text();
						//extract just the filename
						text_data = text_data.substring(text_data.lastIndexOf('/')+1);
						blobs[target.attr("src")] = text_data;
					} 
					else {
						text_data = target.attr("src");    //target is an old image
						//extract just the filename
						text_data = text_data.substring(text_data.lastIndexOf('/')+1);
					}
					
					q_data["question"].push({"type":"image","data":text_data});
				}
			}
			//reads the data from the answer textbox
			//do nothing if it is not "mc:...."
			text_data = $.trim($("#" + q_seq + "_A").val());
			if (text_data.slice(0,3) == "mc:") {
				q_data["answer"] = [];
				text_data = text_data.slice(3,).trim();
				for (mc_item of text_data.split(",")) 
					q_data["answer"].push(mc_item.trim());
			}
			//write the question and answer sepcification
			qset_data.push(q_data);
			i += 1;
		}

		$.ajax({
			type: 'POST',
			url: '/submit_qset_edits_json',
			data: JSON.stringify({"qset_data":qset_data}),
			contentType: "application/json",
			data_type: "json",
			cache: false,
			processData: false,
			async: true,
			success: function(data) {
				alert("Your edits were submitted with status: " + data["Status"]);
			},
		});

		//upload the new images
		for (f of newfiles) {
			//send to server
			let form_data = new FormData();
			form_data.append("file", f);
			$.ajax({
				type: 'POST',
				url: '/upload_image',
				data: form_data,
				async: true,
				contentType: false,
				cache: false,
				processData: false,
				success: function(data) {
					console.log(JSON.stringify(data,null,2));
				}
			});
		}
	});
}

