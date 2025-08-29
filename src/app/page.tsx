import GameController from '@/components/GameController';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Home() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="h-screen w-screen overflow-hidden">
          <GameController />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
