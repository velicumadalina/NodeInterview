function convertCsvStringToJson(csvString) {
    var dataArray = csvString.split("\r\n");
    if (dataArray[dataArray.length - 1] == '') {
        dataArray.pop();
    }
    var fieldsArray = dataArray[0].split(",");
    let jsonArray = [];
    for (var i = 1; i < dataArray.length; i++) {
        var temp = {};
        var valuesArray = dataArray[i].split(",");
        for (var k = 0; k < valuesArray.length; k++) {
            temp[fieldsArray[k]] = valuesArray[k]
        }
        jsonArray.push(temp);
    }
    return jsonArray;
}

module.exports.convertCsvStringToJson = convertCsvStringToJson;