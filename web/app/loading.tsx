import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[300px]">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg font-semibold text-center">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
