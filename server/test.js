import prisma from "./src/prisma.js";

async function run() {
  const user = await prisma.user.findFirst();
  if (!user) { console.log("No user"); return; }
  
  // Actually, I can just bypass login and manually sign a token
  // but let's test the endpoint
  console.log("Found user:", user.username);
  
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user.username, password: 'password', remember: true })
  });
  
  const data = await res.json();
  console.log("Login data:", data);
  
  const cookies = res.headers.raw()['set-cookie'];
  console.log("Cookies:", cookies);
  
  if (cookies) {
      const ref = await fetch('http://localhost:3001/api/auth/refresh', {
        method: 'POST',
        headers: { cookie: cookies[0] }
      });
      console.log("Refresh status:", ref.status);
      console.log("Refresh data:", await ref.json());
  }
}
run().catch(console.error);
