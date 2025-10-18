import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/lib/toast";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password should be atleast 8 characters",
  }),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegister = async (value: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(value.email, value.password);
      toast.success("Registration successful", "Welcome to Firmable!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Please try again";
      toast.error("Registration failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-none shadow-none bg-background">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="space-y-2"
        >
          <CardHeader className="space-y-1 px-0 pt-0 mb-4">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create your account
            </CardTitle>
            <CardDescription className="text-base">
              to continue to Firmable MVP
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="m@example.com"
                      id="email"
                      type="email"
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500 font-medium mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Enter your password"
                      id="password"
                      type="password"
                      required
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500 font-medium mt-1">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-lg cursor-pointer bg-gray-900 hover:bg-gray-800 mt-6 mb-2"
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </CardContent>
          <CardFooter className="px-0 pb-0 flex-col items-start space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline underline-offset-4"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterForm;
