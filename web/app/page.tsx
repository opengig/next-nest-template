"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  User,
  BookOpen,
  VideoIcon,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                    Revolutionize Your Learning Experience
                  </h1>
                  <p className="max-w-xl md:text-xl">
                    Our platform brings tutors and students together for an
                    interactive and immersive educational journey.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="bg-white text-blue-600 hover:bg-gray-200">
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/picsum/200/300"
                alt="Learning"
                width={400}
                height={600}
                className="mx-auto w-full rounded-xl lg:order-last"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Core Features
              </h2>
              <p className="max-w-xl md:text-lg">
                Explore the powerful features designed to enhance the
                educational experience for both tutors and students.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 py-12">
              <Card>
                <CardHeader>
                  <User className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>User Authentication</CardTitle>
                  <CardDescription>
                    Email and Password Login/Signup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Secure accounts for students and tutors with essential login
                    and signup capabilities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Create and View Courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Tutors can create and manage their courses with flexible
                    scheduling and detailed descriptions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <VideoIcon className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Zoom Link Access</CardTitle>
                  <CardDescription>Controlled Access</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Secure Zoom access ensures only enrolled students can join
                    the class sessions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Payment Processing</CardTitle>
                  <CardDescription>Secure Transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Integrated payment solutions ensure seamless and secure
                    transactions for course enrollments.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <User className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle>Student Dashboard</CardTitle>
                  <CardDescription>Enrolled Courses Overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    A personalized dashboard for students to monitor and access
                    their enrolled courses easily.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-xl md:text-lg">
                Find answers to common questions and learn more about our
                platform’s capabilities.
              </p>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I sign up as a tutor?
                  </AccordionTrigger>
                  <AccordionContent>
                    Tutors can sign up using their email and password and start
                    creating courses immediately.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How can students enroll in courses?
                  </AccordionTrigger>
                  <AccordionContent>
                    Students can browse available courses and enroll by
                    proceeding to the payment page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What payment methods are supported?
                  </AccordionTrigger>
                  <AccordionContent>
                    We support various payment methods to ensure a smooth
                    enrollment experience for all users.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Join Us Today
              </h2>
              <p className="max-w-xl md:text-lg">
                Begin your journey with our innovative learning management
                platform. Sign up now and explore endless learning
                possibilities!
              </p>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 text-lg">
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
