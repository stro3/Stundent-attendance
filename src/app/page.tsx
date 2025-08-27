import AuthForm from '@/components/auth-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <BookOpenCheck className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">VidyaAttend</CardTitle>
            <CardDescription className="text-muted-foreground">
              Automated Attendance for Rural Schools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
