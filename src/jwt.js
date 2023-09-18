const jwt = require("jsonwebtoken");
var KEY_ID = "app_637388b6fe0aeb0103812700";
var SECRET =
  "B-gbYMRsVJJsjMiScFYak3-0y9WUQSnn6JJbPYNbo9plBwGOBibgndKjgPNzdGE0jCBSnsw75Wf3NskIABZfrA";

function createJwt(userId) {
  const currentTimeStamp = Date.now();
  const iat = Math.floor(currentTimeStamp / 1000);
  const expFromNow = 24 * 60 * 60;
  const exp = iat + expFromNow;

  const token = jwt.sign(
    {
      scope: "appUser",
      userId,
    },
    SECRET,
    {
      header: {
        alg: "HS256",
        typ: "JWT",
        kid: KEY_ID,
      },
    }
  );

  return token;
}

module.exports = createJwt;
