import { STACKS, LEVELS, PACKAGES } from './constants';

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJwcmFibGVlbnNpbmdoMDQwMUBnbWFpbC5jb20iLCJleHAiOjE3NTE5NTkzNzQsImlhdCI6MTc1MTk1ODQ3NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjI1ZWNmMTEyLTE2NDYtNGIwOS04MmY5LWNmNTAwNzU1YjRlZiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InByYWJsZWVuIHNpbmdoIiwic3ViIjoiNGM5NjI0NzUtNDUyOC00YjNjLThiNjQtYzZjMzliNTVmNDczIn0sImVtYWlsIjoicHJhYmxlZW5zaW5naDA0MDFAZ21haWwuY29tIiwibmFtZSI6InByYWJsZWVuIHNpbmdoIiwicm9sbE5vIjoiMTExNzY4MDI3MjIiLCJhY2Nlc3NDb2RlIjoiVlBwc21UIiwiY2xpZW50SUQiOiI0Yzk2MjQ3NS00NTI4LTRiM2MtOGI2NC1jNmMzOWI1NWY0NzMiLCJjbGllbnRTZWNyZXQiOiJDUFhCWnpWQmdGbXlHQmRQIn0.JIGHCUSTyIzPXAAgP6iCcE7p5lZ74jbe5MDHpEj-OQY";

export async function Log(stack, level, pkg, message) {
  if (!STACKS.includes(stack)) throw new Error('Invalid stack');
  if (!LEVELS.includes(level)) throw new Error('Invalid level');
  if (!PACKAGES.includes(pkg)) throw new Error('Invalid package');

  try {
    const res = await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
    return await res.json();
  } catch (err) {
  }
}
