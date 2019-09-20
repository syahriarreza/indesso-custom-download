var AspectName = "custdown:showCustomDownloadBtnSkipPage";
var DefaultParam = {
    "custdown:skipUntilPage": 0,
};

function main() {
    var nodeRef = args.nodeRef;
    var f = search.findNode(nodeRef);
    if (nodeRef == "") { error("No nodeRef found"); return; }
    if (!f) { error("File does NOT exist, nodeRef: "+nodeRef); return; }
    
    model.contentNode = getModPDF(f);
}

function getModPDF(file) {
    if (file.mimetype != "application/pdf") { return file; }
    var params = getParams(file);

    return deletePages(file, getArrayNumbUntil(params["custdown:skipUntilPage"]));
}

function deletePages(pdfN, pages) {
    var newName = pdfN.nodeRef.id + ".pdf";
    var destFolderN = getTempFolder();
    var existFileN = destFolderN.childByNamePath(newName);
    if (existFileN) { existFileN.remove(); }

    if (pages.length > 0) {
        try {
            var deleteAction = actions.create("pdf-delete-page");
            deleteAction.parameters["destination-folder"] = destFolderN;
            deleteAction.parameters["destination-name"] = newName;
            deleteAction.parameters["page"] = pages.join(",");
            deleteAction.execute(pdfN);
        } catch (err) {
            logger.log("ERROR Deleting pages: " + err);
            return pdfN;
        }

        return destFolderN.childByNamePath(newName);
    } else {
        return pdfN;
    }
}

//--Helper

function getArrayNumbUntil(numb) {
    var numbArr = [];
    for (var i = 1; i <= parseInt(numb); i++) {
        numbArr.push(i);
    }
    return numbArr;
}

function getParams(file) {
    var params = DefaultParam;
    var folder = file.parent;
    if (folder.hasAspect(AspectName)) {
        for (var key in DefaultParam) {
            if (DefaultParam.hasOwnProperty(key) && folder.properties[key]) {
                params[key] = folder.properties[key];
            }
        }
    }
    return params;
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

function error(msg) {
    status.code = 400;
    status.message = msg;
    status.redirect = true;
}

main();