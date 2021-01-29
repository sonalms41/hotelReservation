/*****************************************
 * Figoure out either the file exists in the server or not
 ******************************************/
export const checkFileExistsInServer = (fileUrl) => {
	var http = new XMLHttpRequest();
	http.open("HEAD", fileUrl, false);
	http.send(null);
	return http.status === 200;
};
