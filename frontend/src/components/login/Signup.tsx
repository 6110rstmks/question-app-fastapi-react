import React, { useState } from 'react';
import { useNavigate } from 'react-router';

interface SignupForm {
  username: string;
  password: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }))
  };
  console.log('Signup form:', form);

  const handleSubmit = async (e: React.FormEvent) => {
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    e.preventDefault();
    setError(null);
    setSuccess(null);
    const response = await fetch('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ← セッション維持に必須
      body: JSON.stringify(form),
    });


    const data = await response.json();

    if (!response.ok) {
      setError(data.detail || 'Failed to sign up. Please try again.');
      return;
    }
    setSuccess('Signup successful!');

  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button onClick={handleSubmit}>Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Signup;
