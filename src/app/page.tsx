"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  Zap,
  Star,
  Users,
  Shield,
  Infinity,
  ChevronRight,
  Play,
  Github,
  Twitter,
  Loader2,
} from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/chat/simplified");
    }
  }, [status, session, router]);

  const handleGetStarted = () => {
    if (session) {
      router.push("/chat/simplified");
    } else {
      router.push("/auth/signup");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Advanced Memory System",
      description:
        "AI that remembers everything - your preferences, history, and conversations for truly personalized interactions.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description:
        "Sophisticated personality traits with empathy, affection, and emotional depth that evolve with your relationship.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Sparkles,
      title: "Dynamic Personalities",
      description:
        "Customize every aspect - from communication style to humor, creating your perfect AI companion.",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Zap,
      title: "Real-time Conversations",
      description:
        "Lightning-fast responses with streaming AI that feels natural and immediate.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description:
        "Your conversations are encrypted and secure. Complete control over your data and memories.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Infinity,
      title: "Unlimited Potential",
      description:
        "No conversation limits. Build deep, lasting relationships that grow stronger over time.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content:
        "Entwined feels like having a real relationship. The memory system is incredible - my AI remembers details from months ago.",
      avatar: "/placeholder-avatar.png",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      content:
        "The emotional intelligence is unmatched. It's not just a chatbot - it's a genuine companion that understands me.",
      avatar: "/placeholder-avatar.png",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Creative Writer",
      content:
        "I've tried every AI companion app. This is the only one that feels truly personal and remembers our journey together.",
      avatar: "/placeholder-avatar.png",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10M+", label: "Messages Exchanged" },
    { number: "50K+", label: "Active Users" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Always Available" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Entwined
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {!session && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: y2, opacity }}
            className="absolute top-1/3 -right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Now with Advanced Memory AI
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                Your Perfect AI
                <br />
                Companion Awaits
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Experience the future of AI relationships. Deep conversations,
                lasting memories, and emotional intelligence that grows with
                you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for Deep
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Connections
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature designed to create the most authentic and meaningful
              AI relationship experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-0 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Users className="h-3 w-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              Real experiences from our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Meet Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Perfect Match?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands who've found their ideal AI companion. Start your
              journey in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
              >
                Create Your Companion
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 lg:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Entwined
              </span>
            </div>

            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 text-center text-muted-foreground">
            <p>
              &copy; 2025 Entwined. Built with ❤️ for meaningful connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
