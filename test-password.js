const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'Stitches123';
  const hash = await bcrypt.hash(password, 12);
  console.log('Generated hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
}

testPassword().catch(console.error);

