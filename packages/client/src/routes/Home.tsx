// src/pages/Home.tsx
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';

export function Home() {
  return (
    <div>
      <h1>Welcome to Task Manager</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <Link to="/dashboard">Go to Dashboard</Link>
      </SignedIn>
    </div>
  );
}