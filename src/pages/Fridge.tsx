import BottomNav from "@/components/BottomNav";

const Fridge = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-6 pb-2 px-5">
        <h1 className="text-center font-display text-4xl font-bold tracking-widest text-foreground">
          TENYUU
        </h1>
      </header>
      <main className="container max-w-lg mx-auto px-5 mt-8 text-center">
        <p className="text-muted-foreground">Fridge page coming soon</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default Fridge;
