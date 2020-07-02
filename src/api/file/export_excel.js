import FileSaver from "file-saver"
import XLSX from "xlsx"

/**
 * @description 导出excel （注意：导出的数据为当前页面的表格数据，而不是所有表格数据）
 * @param {DOM | Array(DOM)} obj  选中的表格元素
 * @param {String} name           文件名称，默认为名称为table
 * 示例：this.$exportExcel(document.querySelector('table'), 'data') // 导出一整个表格
 * 示例：this.$exportExcel(document.querySelectorAll('tr'), 'data') // 导出选中元素的表格（数组元素必须为tr标签元素）
 */
export default (obj, name = 'table') => {
  let vb = ""
  if(obj.length) {
    let table = document.createElement('table')
    for(let i = 0, len = obj.length; i < len; i ++) {
      table.appendChild(obj[i].cloneNode(true))
    }
    vb = XLSX.utils.table_to_book(table);
  }else {
    vb = XLSX.utils.table_to_book(obj);
  }
  let vbout = XLSX.write(vb, { bookType: 'xlsx', bookSST: true, type: 'array' });
  try {
    FileSaver.saveAs(new Blob([vbout], { type: 'application/octet-stream' }), `${name}.xlsx`);
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, vbout);
  }
  return vbout;
}