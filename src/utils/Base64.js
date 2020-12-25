const TYPE_FILE = {
  dwg: 'application/x-dwg',
  zip: 'application/x-zip-compressed',
  doc: 'application/msword',
  xlsx: 'application/x-xls',
}

// base64ToFile
export function base64ToFile(base64Data, tempfilename, contentType) {
  contentType = contentType || ""
  var sliceSize = 1024
  var byteCharacters = atob(base64Data)
  var bytesLength = byteCharacters.length
  var slicesCount = Math.ceil(bytesLength / sliceSize)
  var byteArrays = new Array(slicesCount)

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize
    var end = Math.min(begin + sliceSize, bytesLength)

    var bytes = new Array(end - begin)
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  var file = new File(byteArrays, tempfilename, {
    type: contentType
  })
  return file
}

// 将base64转换为文件
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(",")
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

// 将图片转换为Base64
export function getImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement("canvas")
  var ctx = canvas.getContext("2d")
  var img = new Image()
  img.crossOrigin = "Anonymous"
  img.onload = function () {
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL(outputFormat || "image/png")
    callback(dataURL)
    canvas = null
  }
  img.src = url
}

//base64转blob
export function b64Convert2Blob(data) {
  var fileName = data[0];
  var b64String = data[1];
  var bstr = atob(b64String),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  var fArray = fileName.split('.');
  if (fArray.length == 0) {
    return false;
  }
  var _type = fArray[fArray.length - 1];
  _type = _type.toLowerCase();

  var _contentType = TYPE_FILE[_type];
  let _blob = new Blob([u8arr], {
    type: _contentType
  });
  let url = window.URL.createObjectURL(_blob);
  return url;
};
