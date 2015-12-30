
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