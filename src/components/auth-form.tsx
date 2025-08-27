
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof loginSchema> & Partial<z.infer<typeof signUpSchema>>;

export default function AuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const formSchema = isSignUp ? signUpSchema : loginSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
        name: "",
        email: "",
        password: ""
    });
  }, [isSignUp, form]);


  function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        if (isSignUp) {
             toast({
                title: "Sign Up Successful",
                description: "Your account has been created. Please log in.",
            });
            setIsSignUp(false);
            setIsLoading(false);
        } else {
             if (values.email === "teacher@vidya.com" && values.password === "password") {
                toast({
                title: "Login Successful",
                description: "Welcome back! Redirecting to your dashboard.",
                });
                router.push("/dashboard");
            } else {
                toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
                });
                setIsLoading(false);
            }
        }
    }, 1000);
  }

  const toggleForm = () => {
      setIsSignUp(!isSignUp);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="teacher@vidya.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSignUp && (
            <div className="flex items-center justify-end">
                <Button variant="link" size="sm" asChild className="p-0 h-auto">
                    <Link href="#" onClick={(e) => { e.preventDefault(); toast({title: "Feature not implemented", description: "This functionality is not yet available."})}}>Forgot password?</Link>
                </Button>
            </div>
        )}

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Sign Up" : "Login")}
        </Button>

        <div className="text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
            <Button variant="link" size="sm" type="button" onClick={toggleForm} className="p-0 h-auto">
                {isSignUp ? "Login" : "Sign Up"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
