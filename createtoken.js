const jwt = require('jsonwebtoken');

// Luodaan token, jos käyttäjätunnus ja salasana tieto on saatu
function createToken(user) {
  const payload = {
    username: user.username, // Tämä ei ole välttämätön
    isadmin: user.isadmin,
  };

  console.log(payload);

  // Tässä tehdään token
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: 60 * 24, // expiroituu 24 minuutissa
  });

  return token; // Palautetaan token
}

module.exports = createToken;
