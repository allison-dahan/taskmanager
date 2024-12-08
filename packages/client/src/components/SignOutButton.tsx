// components/SignOutButton.tsx
import { useNavigate } from '@tanstack/react-router';

export function SignOutButton() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate({ to: '/sign-out' });
  };

  return (
    <button
      onClick={handleClick}
      className="text-red-500 hover:text-red-600"
    >
      Sign Out
    </button>
  );
}