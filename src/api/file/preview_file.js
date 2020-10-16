/**
 * @description 在线预览文件（注意：该api使用了微软的预览接口，因此，请保证网络状态良好且文件必须能通过外链被访问到。）
 * @param {String} url  文件路径（能被外链访问到，公网url）
 */
function previewFile(url) {
    if(!url) {
        return
    }
    const 
        strArr = url.split('.'),
        len = strArr.length,
        type = strArr[len - 1].toLowerCase(),
        iframe = document.createElement('iframe')
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
        `
    if(type == 'doc'|| type == 'docx'|| type == 'xls' || type == 'xlsx' || type == 'ppt' || type == 'pptx') {
        const newPage = window.open('', type)
        iframe.src = `https://view.officeapps.live.com/op/view.aspx?src=${url}`
        newPage.document.body.appendChild(iframe)
        newPage.document.body.style.margin = "0"
    }else {
        window.open(url)
    }	
}

export default previewFile