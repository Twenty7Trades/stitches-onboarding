const bcrypt = require('bcryptjs');

async function testPasswordHashing() {
  const password = 'Stitches123';
  
  console.log('Testing password:', password);
  
  // Hash the password
  const hash = await bcrypt.hash(password, 12);
  console.log('Generated hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
  
  // Test with a different password
  const isValid2 = await bcrypt.compare('wrongpassword', hash);
  console.log('Wrong password valid:', isValid2);
}

testPasswordHashing().catch(console.error);

