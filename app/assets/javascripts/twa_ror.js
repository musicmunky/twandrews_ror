jQuery(document).ready(function() {

// 	jQuery('.ulnav').on('click', 'a.remlnk', function (event) { removeItem(this.id); });
	jQuery('.edit_project_link').click(function () { getItemInfo(this.id); });
	jQuery("#new_project_link").click(function(){ showAddItem({"project":{"id":0},"type":"project"}); });
	jQuery("#new_tool_link").click(function(){ showAddItem({"project":{"id":0},"type":"tool"}); });

});


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
		}
		else
		{
			var lnk = FUSION.get.node(typ + "_link_" + iid);
			lnk.innerHTML = itm['name'];
			lnk.href = itm['link'];
			FUSION.get.node(typ + "_" + iid + "_description").value = itm['description'];

			if(typ == "project") {

				//NEED TO ACCOUNT FOR PROJECT CHANGING STATUS

				var row = FUSION.get.node(typ + "_row_" + iid);
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
	var ttl = "Edit this " + FUSION.lib.titleCase(typ);
	var pid = parseInt(itm['id']);
	if(pid == 0) {
		ttl = "Add New " + FUSION.lib.titleCase(typ);
	}
	else {
		for(var key in itm) {
			FUSION.get.node(key).value = itm[key];
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
