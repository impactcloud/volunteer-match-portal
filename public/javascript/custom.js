
/**
 * Refresh #box_api html element with updated request/response attributes
 */
function refresh_box_api() {
  $.ajax({
      type: 'GET',
      contentType: "application/json",
      dataType:'json',
      url: '/refresh_box_api',
      success: function(data) {
        var html = "";
        if (data) {
          if (data.api_call) {
            html += "<h4 class='py-2 ml-3'><b>" + data.api_call + "</b></h4>";
          }
          html += "<table class='table table-sm borderless'> <tbody>";
          if (data.method) {
            html += "<tr><th scope='row'>Method</th>";
            html += "<td class='token constant'>" + data.method + "</td></tr>";
          }
          if (data.request_url) {
              html += "<tr><th scope='row'>URL</th>";
              html += "<td class='token function'>" + data.request_url + "</td></tr>";
          }
          if (data.header) {
            html += "<tr><th scope='row'>Header</th>";
            html += "<td class='token keyword'>" + data.header + "</td></tr>";
          }
          if (data.body) {
            html += "<tr><th scope='row'>Body</th>";
            html += "<td><pre class='language-json'><code class='language-json'>" + data.body + "</code></pre></td>";
          }
          html += "</tbody></table><br />";
          if (data.results) {
            html += "<div><h4 class='ml-3'><b>Response</b></h4>";
            html += "<pre class='language-json'><code class='language-json'>" + data.results + "</code></pre>";
            html+= "</div>";
          }
          $('.api').html(html);
        }
        Prism.highlightAll();
      },
      error: function(error) {
        console.log("Error occurred while refreshing");
      }
    });
}



/**
 * Refresh #box_api html element with updated request/response attributes
 */
function display_content_selection(data) {

  $('#box_api').html("<h4>Content Selected: </h4>");
  $('#box_api').append("<pre class='response-code'>" + JSON.stringify(data, null, '  ') + "</pre>");
}

/**
 * Fetch a file's metadata and refresh box_api html element
 */
function get_metadata(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/metadata/get-metadata/' + id,
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("Metadata fetch error occurred for file " + id);
    }
  });
}

/**
 * Fetch file info and refresh box_api html element
 */
function get_file_info(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/files/get-info/' + id,
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("File info fetch error occurred for file " + id);
    }
  });
}

function get_comments(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType: 'json',
    url: '/comments/get-comments/' + id,
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("Comments fetch error occurred for file " + id);
    }
  });
}

/**
 * Fetch collaboration and refresh box_api html element
 */
function get_collaboration(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/collaborations/get-collaboration/' + id,
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("Collaboratoin fetch error occurred for file " + id);
    }
  });
}

/**
 * Fetch watermark and refresh box_api html element
 */
function get_watermark(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/watermarking/get-watermark/' + id,
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("Collaboratoin fetch error occurred for file " + id);
    }
  });
}

/**
 * Download file and refresh box_api html element
 */
function download_file(id) {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/files/download/' + id,
    success: function(data) {
      refresh_box_api();
      window.location = data.url;
    },
    error: function(error) {
      console.log("Download file error occurred for file " + id);
    }
  });
}

/**
 * Fetch root folder items and refresh box_api html element
 */
function root_folder_items() {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    dataType:'json',
    url: '/files/root-folder-items',
    success: function(data) {
      refresh_box_api();
    },
    error: function(error) {
      console.log("Root items fetch error occurred for file ");
    }
  });
}

/**
 * Function to check if a url parameter exists
 */
 function getParameterByName(name, url) {
   if (!url) {
     url = window.location.href;
   }
   name = name.replace(/[\[\]]/g, "\\$&");
   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, " "));
 }
