import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
      </header>
      <main className="container max-w-lg mx-auto px-5 mt-8 space-y-6">
        <div className="rounded-2xl bg-card p-6 shadow-soft text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-muted mx-auto flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-muted-foreground">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-foreground font-medium">{user?.email}</p>
        </div>
        <Button
          variant="warm"
          size="lg"
          className="w-full h-14 rounded-xl gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
