/**
 * checks to see if user exists.
 *
 * @param {string} username - string to checks
 * @returns {} result -
 */
function checkValidUser(username) {
  return username;
}

/**
 * checks to see if input password meet the requirement
 *
 * @param {string} pass - string to checks
 * @returns {} result -
 */
function checkValidPassword(pass) {
  //const checkPass = new RegExp("((?=.*[0-9]))");
  if(pass.length >= 5) {
    return pass;
  }
  return "";
}

module.exports = {
  checkValidUser,
  checkValidPassword
};
