async function test() {
  try {
    // 1. Register a test user
    const email = `test-${Date.now()}@example.com`;
    console.log(`Registering ${email}...`);
    const regRes = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123',
        role: 'user'
      })
    });
    
    if (!regRes.ok) {
      console.error('Registration failed:', await regRes.text());
      return;
    }
    const regData = await regRes.json();
    const token = regData.access_token;
    console.log('Registered, got token:', token);

    // 2. Try creating a task
    console.log('Creating task...');
    const taskRes = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'This is a test',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-06-11'
      })
    });

    if (!taskRes.ok) {
      console.error('Task creation failed:', taskRes.status, await taskRes.text());
    } else {
      console.log('Task created successfully!', await taskRes.json());
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
