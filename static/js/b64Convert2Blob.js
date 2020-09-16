export const b64Convert2Blob = {};
//base64转blob
b64Convert2Blob.Covert = function (data) {
    var fileName = data[0];
    var b64String = data[1];
    var bstr = atob(b64String), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    var fArray = fileName.split('.');
    if(fArray.length == 0){
        return false;
    }
    var _type = fArray[fArray.length - 1];
    _type = _type.toLowerCase();

    var _contentType = b64Convert2Blob.Type[_type];
    let _blob = new Blob([u8arr],{type: _contentType});
    let url = window.URL.createObjectURL(_blob);    
    return url;
};

b64Convert2Blob.Type = {
    dwg:'application/x-dwg',
    zip:'application/x-zip-compressed',
    doc:'application/msword',
    xlsx:'application/x-xls',
}
