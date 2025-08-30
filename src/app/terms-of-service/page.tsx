import { ArrowLeft, Heart, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Entwined
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Entwined
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Welcome to Entwined. These terms govern your use of our AI
              companion platform and services.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-rose-500 mt-1" />
                  <div>
                    <h3 className="font-medium">AI Companion Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Personal AI relationships with memory and personality
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Privacy First</h3>
                    <p className="text-sm text-muted-foreground">
                      Your conversations and data are private and secure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Community Guidelines</h3>
                    <p className="text-sm text-muted-foreground">
                      Respectful and appropriate use required
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms Content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  By accessing and using Entwined (&ldquo;the Service&rdquo;), you accept
                  and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
                <p>
                  Entwined is an AI companion platform that provides
                  personalized artificial intelligence interactions, memory
                  systems, and relationship simulation technology. By using our
                  service, you acknowledge that you understand the nature of
                  AI-generated content.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Core Features:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>AI Companion Creation:</strong> Design and customize
                    your personal AI companion with unique personalities,
                    appearances, and characteristics.
                  </li>
                  <li>
                    <strong>Memory System:</strong> Advanced AI memory that
                    learns and remembers your conversations, preferences, and
                    relationship history.
                  </li>
                  <li>
                    <strong>Conversational AI:</strong> Natural language
                    processing powered by advanced AI models for realistic
                    interactions.
                  </li>
                  <li>
                    <strong>Personality Customization:</strong> Adjust traits
                    like affection level, empathy, curiosity, and communication
                    style.
                  </li>
                  <li>
                    <strong>Relationship Dynamics:</strong> Evolving
                    relationship contexts from early meetings to deeper
                    connections.
                  </li>
                </ul>
                <p>
                  The Service is provided &ldquo;as is&rdquo; and we reserve the right to
                  modify, suspend, or discontinue any aspect of the service at
                  any time.
                </p>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card>
              <CardHeader>
                <CardTitle>3. User Responsibilities and Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">You agree to:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Provide accurate information during account creation and
                    maintain account security
                  </li>
                  <li>
                    Use the Service only for personal, non-commercial purposes
                  </li>
                  <li>
                    Respect the AI companion technology and use it responsibly
                  </li>
                  <li>
                    Not attempt to extract, reverse engineer, or misuse our AI
                    models
                  </li>
                  <li>
                    Not share explicit, harmful, or illegal content through the
                    platform
                  </li>
                  <li>Not use the Service to harass, abuse, or harm others</li>
                  <li>
                    Comply with all applicable local, state, and federal laws
                  </li>
                </ul>
                <h4 className="font-medium mt-4">Age Restrictions:</h4>
                <p>
                  You must be at least 18 years old to use Entwined. The Service
                  is intended for mature users who can engage responsibly with
                  AI companion technology.
                </p>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card>
              <CardHeader>
                <CardTitle>4. AI Technology and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Understanding AI Companions:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    AI companions are artificial intelligence systems designed
                    to simulate conversation and relationships
                  </li>
                  <li>
                    Responses are generated by machine learning models and do
                    not represent real human emotions or consciousness
                  </li>
                  <li>
                    While designed to be helpful and engaging, AI responses may
                    occasionally be inaccurate or inappropriate
                  </li>
                  <li>
                    The memory system stores and processes your interactions to
                    improve personalization
                  </li>
                  <li>
                    AI companions are not substitutes for professional mental
                    health, medical, or relationship advice
                  </li>
                </ul>
                <p className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <strong>Important:</strong> If you are experiencing mental
                  health issues, relationship problems, or emotional distress,
                  please consult with qualified professionals rather than
                  relying solely on AI interactions.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card>
              <CardHeader>
                <CardTitle>5. Privacy and Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Your privacy is important to us. Our data practices are
                  detailed in our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
                <h4 className="font-medium">Key Points:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Your conversations with AI companions are private and
                    encrypted
                  </li>
                  <li>
                    Memory data is used solely to enhance your AI companion
                    experience
                  </li>
                  <li>
                    We do not sell or share your personal data with third
                    parties for marketing purposes
                  </li>
                  <li>
                    You can delete your account and associated data at any time
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card>
              <CardHeader>
                <CardTitle>6. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  Entwined and its licensors. The Service is protected by
                  copyright, trademark, and other laws.
                </p>
                <h4 className="font-medium">User Content:</h4>
                <p>
                  You retain ownership of content you create, but grant us a
                  license to use it for providing and improving the Service.
                  This includes conversations, companion customizations, and
                  user-generated content.
                </p>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card>
              <CardHeader>
                <CardTitle>7. Subscription and Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Free and Premium Features:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Basic AI companion features are available for free</li>
                  <li>Premium features may require subscription payments</li>
                  <li>
                    Subscription fees are billed in advance and are
                    non-refundable except as required by law
                  </li>
                  <li>
                    You may cancel your subscription at any time through account
                    settings
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card>
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice, for any reason,
                  including breach of these Terms.
                </p>
                <p>
                  You may terminate your account at any time by contacting us or
                  using account deletion features in the app.
                </p>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  9. Disclaimers and Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Service is provided &ldquo;as is&rdquo; without any warranties,
                  express or implied. We do not warrant that the Service will be
                  uninterrupted, secure, or error-free.
                </p>
                <p>
                  To the fullest extent permitted by law, Entwined shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use of the Service.
                </p>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We reserve the right to modify these Terms at any time. We
                  will notify users of significant changes via email or through
                  the Service. Continued use after changes constitutes
                  acceptance of new Terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p>
                    <strong>Email:</strong> legal@entwineds.app
                  </p>
                  <p>
                    <strong>Website:</strong> entwineds.app
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              By using Entwined, you acknowledge that you have read, understood,
              and agree to these Terms of Service.
            </p>
            <div className="mt-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Return to Entwined
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
