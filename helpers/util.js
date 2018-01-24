/** COMMON UTILITY FUNCTIONS **/
const moment = require('moment');
const Promise = require('bluebird');

// Extract file objects from item array
function isFile(item) {
  return item.type === "file";
}
// Extract file items from item array, remove folder items
function isFolder(item) {
	return item.type == "folder";
}

// Convert UTC time string to a pretty calendar timestamp
// relative to the current time, e.g "Tuesday at 1:00pm"
function convertToRelativeTime(utcString) {
  const now = moment();
  const posted = moment(utcString);
  if (posted.from(now) === "in a few seconds" || posted.from(now) === "in a minute") {
    return "seconds ago";
  }
  else {
    return posted.from(now);
  }
}

//Boilerplate to make Express compatible with Promise Generators
function wrap (generator) {
  let coroutine = Promise.coroutine(generator); //teach generator to yield promises
  return function (req,res,next) { //return a normal Express route function
    coroutine(req,res,next).catch(next) //call the coroutine, and pass any errors to next
  }
}

function getExtension(fileName) {
  let re = /(?:\.([^.]+))?$/;
  return re.exec(fileName)[1];
}



module.exports = {
  isFile: isFile,
  isFolder: isFolder,
  convertToRelativeTime: convertToRelativeTime,
  wrap: wrap,
  getExtension: getExtension
};
