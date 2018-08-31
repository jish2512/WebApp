// download system-down-div.html and put in index.cshtml div.
export function showSystemDownOverlay(headerText, descriptionText, pageTitle, supportLinkText?, supportLink?) {
	document.title = pageTitle;
	$("#contentHost").load("templates/system-down-div.html", function () {
		if (headerText)
			document.getElementById("headerText").innerHTML = headerText;
		if (descriptionText)
			document.getElementById("descriptionText").innerHTML = descriptionText;
		if (supportLinkText)
			document.getElementById("supportLink").innerHTML = supportLinkText;
		if (supportLink) {
			document.getElementById("supportLink").setAttribute("href", supportLink);
		}
	});
}