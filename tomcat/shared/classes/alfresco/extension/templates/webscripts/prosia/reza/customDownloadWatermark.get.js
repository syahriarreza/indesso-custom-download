var AspectName = "custdown:showCustomDownloadWatermark";
var DefaultParam = {
    "custdown:imagePath": "Data Dictionary/Watermark/uncontrolled-when-printed-rotate.png",
    "custdown:imagePosition": "center",
    "custdown:imagePositionX": 0,
    "custdown:imagePositionY": 0,

    "custdown:printedDateFontSize": 14,
    "custdown:printedDatePosition": "center",
    "custdown:printedDatePositionX": 0,
    "custdown:printedDatePositionY": 0,
};

function main() {
    logger.log("D> Custom Download nodeRef: "+args.nodeRef);
    var nodeRef = args.nodeRef;
    var f = search.findNode(nodeRef);
    if (nodeRef == "") { error("No nodeRef found"); return; }
    if (!f) { error("File does NOT exist, nodeRef: "+nodeRef); return; }
    
    model.contentNode = getModPDF(f);
}

function getModPDF(file) {
    if (file.mimetype != "application/pdf") { return file; }
    var newTempFileN = getTempFile(file);
    var params = getParams(file);

    var imgN = companyhome.childByNamePath(params["custdown:imagePath"]);
    if (imgN) {
        watermarkImage(
            newTempFileN, imgN,
            params["custdown:imagePosition"], params["custdown:imagePositionX"], params["custdown:imagePositionY"]
        );
    } else { logger.warn("NOT FOUND: " + params["custdown:imagePath"]); }

    watermarkText(
        newTempFileN, [1],
        "Printed at: " + convertDateToString(new Date(), true),
        params["custdown:printedDateFontSize"], params["custdown:printedDatePosition"],
        params["custdown:printedDatePositionX"], params["custdown:printedDatePositionY"]
    );

    return newTempFileN;
}

function watermarkImage(pdfN, imageN, position, addCoordX, addCoordY){
    try {
        var watermarkAction = actions.create("pdf-watermark");
        watermarkAction.parameters["inplace"] = "true";
        watermarkAction.parameters["page"] = "all";
        watermarkAction.parameters["watermark-type"] = "image";
        watermarkAction.parameters["watermark-image"] = imageN;
        watermarkAction.parameters["watermark-depth"] = "under";
        watermarkAction.parameters["watermark-add-coord-x"] = addCoordX.toString();
        watermarkAction.parameters["watermark-add-coord-y"] = addCoordY.toString();
        watermarkAction.parameters["position"] = position;
        watermarkAction.execute(pdfN);
    } catch (err) {
        logger.log("ERROR FAIL execute Watermark Image: " + err);
    }
}

function watermarkText(pdfN, pages, watermarktext, size, position, addCoordX, addCoordY) {
    try {
        var watermarkAction = actions.create("pdf-watermark");
        watermarkAction.parameters["inplace"] = "true";
        watermarkAction.parameters["page"] = pages.join(",");
        watermarkAction.parameters["watermark-text"] = watermarktext;
        watermarkAction.parameters["watermark-type"] = "text";
        watermarkAction.parameters["watermark-depth"] = "over";
        watermarkAction.parameters["watermark-font"] = "Helvetica";
        watermarkAction.parameters["watermark-size"] = size.toString();
        watermarkAction.parameters["position"] = position;
        watermarkAction.parameters["watermark-add-coord-x"] = addCoordX.toString();
        watermarkAction.parameters["watermark-add-coord-y"] = addCoordY.toString();
        watermarkAction.execute(pdfN);
    } catch (err) {
        logger.log("ERROR FAIL execute Watermark Text: " + err);        
    }
}

//--Helper

function getParams(file) {
    var params = DefaultParam;

    var folder = file.parent;
    if (folder.hasAspect(AspectName)) {
        for (var key in DefaultParam) {
            if (DefaultParam.hasOwnProperty(key) && folder.properties[key]) {
                params[key] = (key == "custdown:imagePosition" || key == "custdown:printedDatePosition") ? toLowerCaseNRemoveSpace(folder.properties[key]) : folder.properties[key];
            }
        }
    }

    return params;
}

function getTempFile(file) {
    var newName = file.nodeRef.id + ".pdf";
    var temp = getTempFolder();
    
    var existTempN = temp.childByNamePath(newName);
    if (existTempN) { existTempN.remove(); }

    var newTempFileN = file.copy(temp);
    newTempFileN.name = newName;
    return newTempFileN;
}

function getTempFolder() {
    var temp = companyhome.childByNamePath("temp");
    if (!temp) {
        temp = companyhome.createFolder("temp");
    }
    temp.setPermission("Delete", "GROUP_EVERYONE");
    temp.addAspect("sys:hidden");
    return temp;
}

function convertDateToString(date, withTime){
	var hari = date.getDate().toString().length == 1 ? '0'+date.getDate() : date.getDate();
	var _bulan = date.getMonth() + 1;
	var bulan = (_bulan.toString().length == 1) ? '0'+_bulan : _bulan;
	var tahun = date.getFullYear();
	
	var jam = date.getHours().toString().length == 1 ? '0'+date.getHours() : date.getHours();
	var menit = date.getMinutes().toString().length == 1 ? '0'+date.getMinutes() : 	date.getMinutes();
    var detik = date.getSeconds().toString().length == 1 ? '0'+date.getSeconds() : 	date.getSeconds();
    
	var waktu = jam + ":" + menit + ":" + detik;
	return tahun + "/" +  bulan + "/" + hari + ((withTime) ? " "+waktu : "");
}

function toLowerCaseNRemoveSpace(str) {
    str = str.toLowerCase().replace(" ", "");
    if (str.indexOf(" ") >= 0) {
        str = toLowerCaseNRemoveSpace(str);
    }
    return str;
}

function error(msg) {
    status.code = 400;
    status.message = msg;
    status.redirect = true;
}

main();