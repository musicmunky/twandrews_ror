jQuery(document).ready(function() {

// 	jQuery('.ulnav').on('click', 'a.remlnk', function (event) { removeItem(this.id); });
// 	jQuery('.ulnav').on('click', 'a.edit_project_link', function (event) { getItemInfo(this.id); });
	jQuery('.edit_project_link').click(function () { getItemInfo(this.id); });
	jQuery("#new_project_link").click(function(){ showAddItem({"project":{"id":0},"type":"project"}); });
	jQuery("#new_tool_link").click(function(){ showAddItem({"project":{"id":0},"type":"tool"}); });

});


function updateItem()
{
	try {
		var id = FUSION.get.node("ni_pageid").value ? parseInt(FUSION.get.node("ni_pageid").value) : 0;
		var pname = FUSION.get.node("ni_pagename").value;
		var ptype = FUSION.get.node("ni_pagetype").value;
		var plink = FUSION.get.node("ni_pagelink").value;
		var pstat = FUSION.get.node("ni_pagestat").value;
		var pdesc = FUSION.get.node("ni_pagedesc").value;

		var errstr = "";
		var errcnt = 80;

		if(FUSION.lib.isBlank(id)) {
			FUSION.lib.alert("<p>There was a problem getting the item information - please refresh the page and try again</p>");
			return false;
		}
		if(FUSION.lib.isBlank(pname)) {
			errstr += "<br>Project Name";
			errcnt += 20;
		}
		if(FUSION.lib.isBlank(ptype)) {
			errstr += "<br>Project Type";
			errcnt += 20;
		}
		if(FUSION.lib.isBlank(plink)) {
			errstr += "<br>Project URL / Link";
			errcnt += 20;
		}
		if(ptype == "project" && FUSION.lib.isBlank(pstat)) {
			errstr += "<br>Project Status";
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
			"path": "php/indexlib.php",
			"data": {
				"method": "saveItemInfo",
				"libcheck":	true,
				"itemid": id,
				"pname":  pname,
				"ptype":  ptype,
				"plink":  plink,
				"pstat":  pstat,
				"pdesc":  pdesc
			},
			"func": updateItemResponse
		};

	FUSION.lib.ajaxCall(info);
	}
	catch(err){
		FUSION.lib.alert("Error saving item - please refresh the page and try again");
		return false;
	}
}


function updateItemResponse(h)
{
	var hash = h || {};
	try {
		var iid = hash['pageid'];
		var ul  = {};
		if(hash['n_or_e'] == "new")
		{
			//add new li to correct ul
			var newli = createLi(hash);
			ul = (hash['ptype'] == "project") ? FUSION.get.node(hash['pstat'] + "ul") : FUSION.get.node("toolul");
			ul.appendChild(newli);
		}
		else
		{
			if(hash['ptype'] != hash['prvtp'] || (hash['pstat'] != hash['prvst'] && !FUSION.lib.isBlank(hash['pstat']) && !FUSION.lib.isBlank(hash['prvst'])))
			{
				//move li from old to new ul
				FUSION.remove.node("li_" + iid);
				var newli = createLi(hash);
				ul = (hash['ptype'] == "project") ? FUSION.get.node(hash['pstat'] + "ul") : FUSION.get.node("toolul");
				ul.appendChild(newli);
			}
			else
			{
				//update current li with new info (name and link are only display elements to update)
				var cn = FUSION.get.node("link_" + iid).childNodes;
				for(var i = 0; i < cn.length; i++)
				{
					var nn = cn[i].nodeName;
					if(nn == "#text")
					{
						cn[i].nodeValue = hash['pname'];
						break;
					}
				}
				FUSION.get.node("link_" + iid).href = hash['plink'];
			}
		}
		hideNewItem();

		//sort the three ULs to get them in correct order (by ID)
		sortUl("toolul");
		sortUl("completeul");
		sortUl("developmentul");
		return false;
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
		"data": { "item_id": iid	},
		"func": showAddItem
	};
	FUSION.lib.ajaxCall(info);
}


function showAddItem(h)
{
	var hash  = h || {};

	try {
		if(typeof hash === "string")
		{
			hash = JSON.parse(hash);
		}
	}
	catch(err){
		FUSION.lib.alert("Error attempting to parse JSON - please refresh the page and try again");
		return false;
	}

	var itm = hash['project'];
	var typ = hash['type'];
	var ttl = "Edit this Item";
	var pid = parseInt(itm['id']);
	if(pid == 0) {
		ttl = "Add New Item";
	}
	else {
		for(var key in itm) {
			FUSION.get.node(key).value = itm[key];
		}
	}
	FUSION.get.node("status").disabled = (typ == "tool") ? true : false;
	FUSION.get.node("statusdiv").style.visibility = (typ == "tool") ? "hidden" : "visible";

	FUSION.get.node("id").value = pid;
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


function removeItem(i)
{
	if(FUSION.lib.isBlank(i))
	{
		FUSION.lib.alert("Invalid ID - please refresh the page and try again");
		return false;
	}
	else
	{
		var yn = confirm("Are you sure you would like to remove this item?");
		if(yn)
		{
			var tmp = i.split("_");
			var iid = tmp[1];

			var info = {
				"type": "POST",
				"path": "php/indexlib.php",
				"data": {
					"method":	"removeItem",
					"libcheck":	true,
					"itemid":	iid
				},
				"func": removeItemResponse
			};
			FUSION.lib.ajaxCall(info);
		}
	}
}


function removeItemResponse(h)
{
	var hash = h || {};
	FUSION.remove.node("li_" + hash['pageid']);
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


function enDisStat(v)
{
	FUSION.get.node("status").disabled = (v == "tool") ? true : false;
	FUSION.get.node("statusdiv").style.visibility = (v == "tool") ? "hidden" : "visible";
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


function checkUserForm()
{
	var fname = FUSION.get.node("user_first_name").value;
	var lname = FUSION.get.node("user_last_name").value;
	var email = FUSION.get.node("user_email").value;

	if(FUSION.lib.isBlank(fname) || FUSION.lib.isBlank(lname) || FUSION.lib.isBlank(email))
	{
		alert("Please make sure you have a first name, last name, and email address entered!");
		return false;
	}
	return true;
}


function checkProjectForm()
{
	var pname = FUSION.get.node("project_name").value;
	var plink = FUSION.get.node("project_link").value;
	var pstat = FUSION.get.node("project_status").value;

	if(FUSION.lib.isBlank(pname) || FUSION.lib.isBlank(plink) || FUSION.lib.isBlank(pstat))
	{
		alert("Please enter a project name, link, and a status before saving!");
		return false;
	}
	return true;
}


function checkToolForm()
{
	var tname = FUSION.get.node("tool_name").value;
	var tlink = FUSION.get.node("tool_link").value;

	if(FUSION.lib.isBlank(tname) || FUSION.lib.isBlank(tlink))
	{
		alert("Please enter a tool name and link before saving!");
		return false;
	}
	return true;
}