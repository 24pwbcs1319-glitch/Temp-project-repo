import fetch from 'node-fetch';

async function testAuthFlow() {
  console.log("1. Testing Registration...");
  const registerRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Real DB Test User',
      email: `real_db_user_${Date.now()}@example.com`,
      password: 'password123'
    })
  });
  const registerData = await registerRes.json();
  console.log("Registration Response:", registerData);

  if (registerRes.ok && registerData.user?.email) {
    console.log("\n✅ Registration successful!");
  } else {
    console.log("\n❌ Registration failed.");
  }
}

testAuthFlow();
