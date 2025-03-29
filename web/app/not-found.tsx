import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="text-center space-y-6">
        <FileQuestion className="h-24 w-24 text-primary mx-auto" />
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
