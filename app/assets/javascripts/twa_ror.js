jQuery(document).ready(function() {

// 	jQuery('.ulnav').on('click', 'a.remlnk', function (event) { removeItem(this.id); });
	jQuery('.edit_project_link').click(function () { getItemInfo(this.id); });
	jQuery('.remove_project_link').click(function() { removeItem(this.id) })
	jQuery("#new_project_link").click(function(){ showAddItem({"project":{"id":0},"type":"project"}); });
	jQuery("#new_tool_link").click(function(){ showAddItem({"project":{"id":0},"type":"tool"}); });

	try {
		tinymce.init({ selector: '#resume_summary' });
		tinymce.init({ selector: '#resume_education' });
		tinymce.init({ selector: '#resume_skills' });
		tinymce.init({ selector: '#resume_additional_info' });
	}
	catch(err) {}
});


function checkResumeForm() {
// 	var smmry = FUSION.get.node("resume_summary").value;
// 	var edctn = FUSION.get.node("resume_education").value;
// 	var sklls = FUSION.get.node("resume_skills").value;
// 	var ainfo = FUSION.get.node("resume_additional_info").value;

	var smmry = tinymce.editors[0].getContent();
	var edctn = tinymce.editors[1].getContent();
	var sklls = tinymce.editors[2].getContent();
	var ainfo = tinymce.editors[3].getContent();

//	alert("SUMMARY: " + smmry + "\nEDUCATION: " + edctn + "\nSKILLS: " + sklls + "\nADDITIONALINFO: " + ainfo);
//	return false;

	if(FUSION.lib.isBlank(smmry) || FUSION.lib.isBlank(edctn) || FUSION.lib.isBlank(sklls) || FUSION.lib.isBlank(ainfo))
	{
		alert("Please make sure you have entered a summary, your skills, your education, and a little additional information!");
		return false;
	}
	return true;
}


function checkResumeEntryForm() {
	return true;
}


function updateFeatured(i, c) {
	try {
		var id = i || "";
		var checked = c;
		if(FUSION.lib.isBlank(id)) {
			FUSION.lib.alert("<p>There was a problem getting the item information - please refresh the page and try again</p>");
			return false;
		}

		var numfeatured = parseInt(FUSION.get.node("num_featured").value);
		if(checked && numfeatured >= 4) {
			FUSION.lib.alert("<p>You are only allowed to feature four projects at a time - please deselect a project or tool to add this one</p>");
			FUSION.get.node(id).checked = false;
			return false;
		}

		numfeatured = checked ? numfeatured + 1 : numfeatured - 1;
		FUSION.get.node("num_featured").value = numfeatured;

		var id_array = id.split("_");
		var ptype = id_array[1];
		var iid = id_array[2];
		var info = {
			"type": "POST",
			"path": "/" + ptype + "s/1/updateFeatured" + FUSION.lib.titleCase(ptype),
			"data": {
				"item_id": iid,
				"featured": checked
			},
			"func": updateFeaturedResponse
		};
		FUSION.lib.ajaxCall(info);
	}
	catch(err){
		FUSION.lib.alert("Error saving " + ptype + " - please refresh the page and try again");
		return false;
	}

}


function updateFeaturedResponse(h) {
	var hash = h || {}
}


function updateItem()
{
	try {
		var id = FUSION.get.node("id").value ? parseInt(FUSION.get.node("id").value) : 0;
		var pname = FUSION.get.node("name").value;
		var ptype = FUSION.get.node("type").value;
		var plink = FUSION.get.node("link").value;
		var pstat = FUSION.get.node("status").value;
		var pdesc = FUSION.get.node("description").value;
		var ptUpr = FUSION.lib.titleCase(ptype);

		var errstr = "";
		var errcnt = 80;

		if(FUSION.lib.isBlank(id)) {
			FUSION.lib.alert("<p>There was a problem getting the item information - please refresh the page and try again</p>");
			return false;
		}
		if(FUSION.lib.isBlank(ptype)) {
			FUSION.lib.alert("<p>There was a problem determining the item type - please refresh the page and try again</p>");
			return false;
		}
		if(FUSION.lib.isBlank(pname)) {
			errstr += "<br>" + ptUpr + " Name";
			errcnt += 20;
		}
		if(FUSION.lib.isBlank(plink)) {
			errstr += "<br>" + ptUpr + " URL / Link";
			errcnt += 20;
		}
		else if(!FUSION.lib.checkUrl(plink)) {
			errstr += "<br>Valid link needed";
			errcnt += 20;
		}
		if(ptype == "project" && FUSION.lib.isBlank(pstat)) {
			errstr += "<br>" + ptUpr + " Status";
			errcnt += 20;
		}
		if(!FUSION.lib.isBlank(errstr)) {
			FUSION.lib.alert({"message":"Please make sure the following fields are not blank:" + errstr,
							  "color":"#F00",
							  "height": errcnt,
							  "text-align":"center"});
			return false;
		}

		pname = pname.trim();
		plink = plink.trim();
		pdesc = pdesc.trim();
		pstat = (ptype == "tool") ? "" : pstat;

		var info = {
			"type": "POST",
			"path": "/" + ptype + "s/1/addEdit" + ptUpr,
			"data": {
				"item_id": id,
				"name":  pname,
				"type":  ptype,
				"link":  plink,
				"status":  pstat,
				"description":  pdesc
			},
			"func": updateItemResponse
		};
		FUSION.lib.ajaxCall(info);
	}
	catch(err){
		FUSION.lib.alert("Error saving " + ptype + " - please refresh the page and try again");
		return false;
	}
}


function updateItemResponse(h)
{
	var hash = h || {};
	try {
		var itm = hash['project'];
		var typ = hash['type'];
		var noe = hash['new_or_edit'];

		var iid = itm['id'];
		if(noe == "new")
		{
			//add new row to correct table
			var tbl = FUSION.get.node(typ + "_table");
			var row = FUSION.lib.createHtmlElement({"type":"tr", "attributes":{"id":typ + "_row_" + iid}});
			var nametd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell"}});
			var infotd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell tac"}});
			var feattd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell tac"}});
			var edittd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell tac"}});
			var rmovtd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell tac"}});

			//create name link and add to td
			var nametdlink = FUSION.lib.createHtmlElement({"type":"a", "attributes":{"href":itm['link'], "target":"_blank", "id":typ + "_link_" + itm['id']}, "text":itm['name']});
			nametd.appendChild(nametdlink);

			//create the info icon and link
			var infotdlink = FUSION.lib.createHtmlElement({"type":"a",
														   "style":{"color":"#5CB85C"},
														   "onclick":"showProjectToolInfo('" + typ + "_" + itm['id'] + "_description')",
														   "attributes":{"href":"javascript:void(0)", "title":$F.lib.titleCase(typ) + " Info"}});
			var infotditag = FUSION.lib.createHtmlElement({"type":"i", "attributes":{"class":"glyphicon glyphicon-info-sign"}});
			infotdlink.appendChild(infotditag);
			infotd.appendChild(infotdlink);

			//create the "featured" checkbox
			var featchkbox = FUSION.lib.createHtmlElement({"type":"input",
														   "onchange":"updateFeatured(this.id, this.checked)",
														   "attributes":{"type":"checkbox", "id":"feature_" + typ + "_" + itm['id']}});
			feattd.appendChild(featchkbox);

			//create the edit icon and link
			var edittdlink = FUSION.lib.createHtmlElement({"type":"a",
														   "style":{"color":"#204d74"},
														   "onclick":"getItemInfo('" + typ + "_" + itm['id'] + "')",
														   "attributes":{"href":"javascript:void(0)", "title":"Edit " + itm['name'], "class":"edit_project_link", "id":typ + "_" + itm['id']}});
			var edittditag = FUSION.lib.createHtmlElement({"type":"i", "attributes":{"class":"glyphicon glyphicon-edit"}});
			edittdlink.appendChild(edittditag);
			edittd.appendChild(edittdlink);

			//create the remove icon and link
			var rmovtdlink = FUSION.lib.createHtmlElement({"type":"a",
														   "style":{"color":"#C9302C"},
														   "onclick":"removeItem('" + typ + "_" + itm['id'] + "')",
														   "attributes":{"href":"javascript:void(0)", "title":"Remove " + itm['name'],
																		 "class":"remove_project_link", "id":"remove_" + typ + "_" + itm['id']}});
			var rmovtditag = FUSION.lib.createHtmlElement({"type":"i", "attributes":{"class":"glyphicon glyphicon-trash"}});
			rmovtdlink.appendChild(rmovtditag);
			rmovtd.appendChild(rmovtdlink);

			var dscrpt = FUSION.lib.createHtmlElement({"type":"input", "attributes":{"type":"hidden", "id":typ + "_" + iid + "_" + "description", "value":itm['description']}});

			//first append the name td to the row
			row.appendChild(nametd);

			if(typ == "project") {
				//if it's a project, create the status and up/down indicator tds and icons
				var stattd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell"}, "text":$F.lib.titleCase(itm['status'].split("_").join(" "))});
				var updntd = FUSION.lib.createHtmlElement({"type":"td", "attributes":{"class":"vam project_cell tac"}});
				var classnam = itm['up_or_down'] ? "glyphicon glyphicon-ok server_status_up" : "glyphicon glyphicon-remove server_status_down";
				var updnspan = FUSION.lib.createHtmlElement({"type":"span", "attributes":{"id":"server_status_span_" + itm['id'], "aria-hidden":"true", "class":classnam}})
				updntd.appendChild(updnspan);
				row.appendChild(stattd);
				row.appendChild(updntd);
			}
			//finally append the info/edit/remove tds to the row
			row.appendChild(infotd);
			row.appendChild(feattd);
			row.appendChild(edittd);
			row.appendChild(rmovtd);
			row.appendChild(dscrpt);

			//append the row to the appropriate table/tbody
			var tid = (typ == "project") ? itm['status'] + "_project_tbody" : "tool_tbody";
			var tbl = FUSION.get.node(tid);
			tbl.appendChild(row);
		}
		else
		{
			var lnk = FUSION.get.node(typ + "_link_" + iid);
			lnk.innerHTML = itm['name'];
			lnk.href = itm['link'];
			FUSION.get.node(typ + "_" + iid + "_description").value = itm['description'];

			if(typ == "project") {
				var row = FUSION.get.node("project_row_" + iid);
				if(hash['old_status'] !== hash['new_status']) {
					var rowcopy = row;
					FUSION.remove.node("project_row_" + iid);
					var tbody = FUSION.get.node(hash['new_status'] + "_project_tbody");
					var rowid = 0;
					var target = null;
					if(tbody.rows.length > 0) {
						for(var i = 0; i < tbody.rows.length; i++){
							rowid = parseInt(tbody.rows[i].id.split("_")[2]);
							if(parseInt(iid) < rowid) {
								target = tbody.rows[i];
								tbody.insertBefore(rowcopy, target);
								break;
							}
							else if(i == tbody.rows.length - 1) {
								tbody.appendChild(rowcopy);
							}
						}
					}
					else {
						tbody.appendChild(rowcopy);
					}
					row = rowcopy;
				}

				row.children[1].innerHTML = FUSION.lib.titleCase(itm['status'].split("_").join(" "));
				var spn = FUSION.get.node("server_status_span_" + iid);
				if(hash['up_or_down']) {
					spn.className = "glyphicon glyphicon-ok server_status_up";
				}
				else {
					spn.className = "glyphicon glyphicon-remove server_status_down";
				}
			}
		}
		hideNewItem();
		return true;
	}
	catch(err){
		FUSION.error.logError(err);
		FUSION.lib.alert("Error during item update: " + err.toString());
		return false;
	}
}


function getItemInfo(i)
{
	clearItemForm();
	var id = i || "";
	var tmp = id.split("_");
	var prj = tmp[0];
	var iid = tmp[1];

	if(FUSION.lib.isBlank(id))
	{
		FUSION.lib.alert("Invalid ID - please refresh the page and try again");
		return false;
	}

	var info = {
		"type": "GET",
		"path": "/" + prj + "s/1/get" + FUSION.lib.titleCase(prj) + "Info",
		"data": { "item_id": iid },
		"func": showAddItem
	};
	FUSION.lib.ajaxCall(info);
}


function removeItem(i)
{
	var id = i || "";
	if(FUSION.lib.isBlank(id)) {
		FUSION.lib.alert("Can't remove item with no id - please refresh the page and try again");
		return false;
	}

	var tmp = id.split("_");
	var prj = tmp[0];
	var iid = tmp[1];

	var yn = confirm("Are you sure you want to delete this item?");
	if(yn){
		var info = {
			"type": "POST",
			"path": "/" + prj + "s/1/delete" + FUSION.lib.titleCase(prj),
			"data": { "item_id": iid },
			"func": removeItemResponse
		};
		FUSION.lib.ajaxCall(info);
	}
}


function removeItemResponse(h) {
	var hash  = h || {};
	var itm = hash['project'];
	var typ = hash['type'];
	var num = hash['num_featured'];
	FUSION.remove.node(typ + "_row_" + itm['id']);
	FUSION.get.node("num_featured").value = num;
}


function showAddItem(h)
{
	var hash  = h || {};

	try {
		if(typeof hash === "string") {
			hash = JSON.parse(hash);
		}
	}
	catch(err){
		FUSION.lib.alert("Error attempting to parse JSON - please refresh the page and try again");
		return false;
	}

	var itm = hash['project'];
	var typ = hash['type'];
	var ttl = "Edit this " + FUSION.lib.titleCase(typ);
	var pid = parseInt(itm['id']);
	if(pid == 0) {
		ttl = "Add New " + FUSION.lib.titleCase(typ);
	}
	else {
		for(var key in itm) {
			if(key !== "featured") {
				FUSION.get.node(key).value = itm[key];
			}
		}
	}
	FUSION.get.node("status").disabled = (typ == "tool") ? true : false;
	FUSION.get.node("statusdiv").style.visibility = (typ == "tool") ? "hidden" : "visible";

	FUSION.get.node("id").value = pid;
	FUSION.get.node("type").value = typ;
	FUSION.get.node("new_item_title").innerHTML = ttl;
	FUSION.get.node("new_item_overlay").style.height = FUSION.get.pageHeight() + "px";
	FUSION.get.node("new_item_overlay").style.display = "block";
	FUSION.lib.dragable("new_item_header", "new_item_wrapper");
}


function hideNewItem()
{
	FUSION.get.node("new_item_overlay").style.display = "none";
	clearItemForm();
}


function clearItemForm()
{
	FUSION.get.node("id").value = "";
	FUSION.get.node("name").value = "";
	FUSION.get.node("link").value = "";
	FUSION.get.node("description").value = "";
	FUSION.get.node("type").value = "";
	FUSION.get.node("status").value = "";
	FUSION.get.node("new_item_title").innerHTML = "";
	FUSION.get.node("status").disabled = false;
	FUSION.get.node("statusdiv").style.visibility = "visible";
}


function showProjectToolInfo(i) {
	var id = i || "";
	if(FUSION.lib.isBlank(id)) {
		console.log("No tool or project id given");
		return false;
	}

	try {
		var desc = FUSION.get.node(id).value;
		if(!FUSION.lib.isBlank(desc)) {
			FUSION.lib.alert({"message":desc, "height":200, "button-text":"Close"});
		}
	}
	catch(err) {
		FUSION.error.logError(err);
		return false;
	}
}
