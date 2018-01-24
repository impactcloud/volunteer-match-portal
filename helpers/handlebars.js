module.exports = {

  if_pdf_or_text_representable: (ext,options) => {

    var pdfTextTypes = ['as', 'as3', 'asm', 'bat', 'c', 'cc', 'cmake', 'cpp', 'cs', 'css', 'csv', 'cxx', 'diff', 'doc', 'docx',
                      'erb', 'gdoc', 'groovy', 'gsheet', 'h', 'haml', 'hh', 'htm', 'html', 'java', 'js', 'less', 'm', 'make',
                      'ml', 'mm', 'msg', 'ods', 'odt', 'php', 'pl', 'properties', 'py', 'rb', 'rtf', 'sass', 'scala',
                      'scm', 'script', 'sh', 'sml', 'sql', 'txt', 'vi', 'vim', 'wpd', 'xls', 'xlsm', 'xlsx', 'xml', 'xsd', 'xsl',
                      'yaml','odp', 'ppt', 'pptx'];

    if (pdfTextTypes.indexOf(ext) >= 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  if_singlepage_representable: (ext,options) => {
    var mpTypes = ['doc', 'docx','ppt', 'pptx','tiff', 'pdf'];

    if (mpTypes.indexOf(ext) >= 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  if_thumbnail_representable: (ext,options) => {
    var thumbnailTypes = ['doc', 'docx','ppt', 'pptx','ai', 'bmp', 'gif', 'eps', 'jpeg', 'jpg', 'png', 'ps', 'psd', 'svg', 'tif',
                            'tiff', 'dcm', 'dicm', 'dicom', 'svs', 'tga','3g2', '3gp', 'avi', 'm2v', 'm2ts', 'm4v', 'mkv', 'mov',
                            'mp4', 'mpeg', 'mpg', 'ogg', 'mts', 'qt', 'wmv'];

    if (thumbnailTypes.indexOf(ext) >= 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }


}
