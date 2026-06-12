const axios = require('axios');

async function test() {
  try {
    // 1. Register a test user
    const email = `test-${Date.now()}@example.com`;
    console.log(`Registering ${email}...`);
    const regRes = await axios.post('http://localhost:3001/auth/register', {
      name: 'Test User',
      email: email,
      password: 'password123',
      role: 'user'
    });
    
    const token = regRes.data.access_token;
    console.log('Registered, got token:', token);

    // 2. Try creating a task
    console.log('Creating task...');
    const taskRes = await axios.post('http://localhost:3001/tasks', {
      title: 'Test Task',
      description: 'This is a test',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-06-11'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Task created successfully!', taskRes.data);
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

test();
