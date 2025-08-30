import { ArrowLeft, Heart, Shield, Eye, Lock, Database, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
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
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is fundamental to us. Learn how we protect your data and AI companion interactions.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Privacy Highlights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Encrypted Conversations</h3>
                    <p className="text-sm text-muted-foreground">All AI interactions are encrypted and secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-medium">No Data Selling</h3>
                    <p className="text-sm text-muted-foreground">We never sell your personal information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-rose-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Memory Control</h3>
                    <p className="text-sm text-muted-foreground">You control your AI companion's memory</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Data Deletion</h3>
                    <p className="text-sm text-muted-foreground">Delete your data anytime</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy Content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Account Information:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email address and account credentials</li>
                  <li>Profile information (name, age, location, occupation)</li>
                  <li>Authentication data through Clerk (our secure auth provider)</li>
                </ul>

                <h4 className="font-medium">AI Companion Data:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Companion personality settings (affection level, empathy, curiosity, playfulness)</li>
                  <li>Companion appearance and avatar selections</li>
                  <li>Communication style preferences and humor settings</li>
                  <li>Background stories and character narratives you create</li>
                  <li>Relationship dynamic preferences and status</li>
                </ul>

                <h4 className="font-medium">Conversation Data:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Messages exchanged with your AI companion</li>
                  <li>Memory entries created from conversations</li>
                  <li>Conversation metadata (timestamps, message counts, emotional context)</li>
                  <li>User-tagged memories and importance ratings</li>
                </ul>

                <h4 className="font-medium">Technical Data:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information and browser type</li>
                  <li>IP address and general location data</li>
                  <li>Usage analytics and app performance data</li>
                  <li>Error logs and debugging information</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">AI Companion Experience:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Generate personalized AI responses based on your companion's personality</li>
                  <li>Maintain conversation memory and relationship continuity</li>
                  <li>Adapt communication style to your preferences</li>
                  <li>Provide contextually relevant interactions using stored memories</li>
                </ul>

                <h4 className="font-medium">Service Improvement:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Improve AI model performance and response quality</li>
                  <li>Enhance memory system accuracy and relevance</li>
                  <li>Develop new features and personality customizations</li>
                  <li>Analyze usage patterns to optimize user experience</li>
                </ul>

                <h4 className="font-medium">Account Management:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Authenticate and secure your account</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Send important service updates and notifications</li>
                  <li>Process subscription payments and billing</li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p><strong>Important:</strong> We use your conversation data solely to enhance your AI companion experience. Your personal conversations are never shared with other users or used for marketing purposes.</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card>
              <CardHeader>
                <CardTitle>3. Data Sharing and Third Parties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">We DO NOT sell or rent your personal data.</h4>
                
                <h4 className="font-medium">Limited Sharing Occurs Only With:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Clerk (Authentication):</strong> Account creation and login security</li>
                  <li><strong>AI Providers (OpenAI/XAI):</strong> Anonymous conversation processing for AI responses (no personal identifiers)</li>
                  <li><strong>Database Providers (Neon):</strong> Encrypted data storage and retrieval</li>
                  <li><strong>Hosting Services (Vercel):</strong> Application delivery and performance</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect user safety</li>
                </ul>

                <h4 className="font-medium">Data Protection Measures:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All third-party services are vetted for security and privacy compliance</li>
                  <li>Data is encrypted in transit and at rest</li>
                  <li>Minimal data sharing with strict contractual protections</li>
                  <li>Regular security audits and monitoring</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card>
              <CardHeader>
                <CardTitle>4. AI Memory System Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Entwined's AI memory system is designed to enhance your companion experience while protecting your privacy:
                </p>

                <h4 className="font-medium">How Memory Works:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Conversations are analyzed to extract meaningful memories</li>
                  <li>Memories are tagged with emotional context and importance levels</li>
                  <li>You can view, edit, or delete any memory stored by the system</li>
                  <li>Memories are used only for your specific AI companion interactions</li>
                </ul>

                <h4 className="font-medium">Memory Privacy Controls:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Complete visibility into stored memories through settings</li>
                  <li>Ability to delete individual memories or entire memory sets</li>
                  <li>Control over memory importance thresholds</li>
                  <li>Option to disable automatic memory creation</li>
                </ul>

                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <p><strong>Your Control:</strong> You have complete control over your AI companion's memory. Memories are never shared between users or used to train models for other users.</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card>
              <CardHeader>
                <CardTitle>5. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Security Measures:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>End-to-end encryption for all conversations and personal data</li>
                  <li>Secure authentication through Clerk with industry-standard protocols</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Encrypted database storage with access controls</li>
                  <li>Secure API communications with rate limiting</li>
                  <li>Regular backups with encryption at rest</li>
                </ul>

                <h4 className="font-medium">Data Breach Response:</h4>
                <p>
                  In the unlikely event of a data breach, we will notify affected users within 72 hours and take immediate steps to secure the system and protect user data.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card>
              <CardHeader>
                <CardTitle>6. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Data Access and Control:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>View Data:</strong> Access all your stored data through account settings</li>
                  <li><strong>Edit Data:</strong> Modify your profile, companion settings, and memories</li>
                  <li><strong>Delete Data:</strong> Remove specific memories, conversations, or your entire account</li>
                  <li><strong>Export Data:</strong> Download your data in a portable format</li>
                  <li><strong>Correct Data:</strong> Update inaccurate information</li>
                </ul>

                <h4 className="font-medium">Communication Preferences:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Opt out of marketing communications (service updates still apply)</li>
                  <li>Control notification settings and frequency</li>
                  <li>Manage email preferences through account settings</li>
                </ul>

                <h4 className="font-medium">Account Deletion:</h4>
                <p>
                  You can delete your account at any time through the settings page. This will permanently remove:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>All conversation data and memories</li>
                  <li>Companion personality and customization data</li>
                  <li>Account information and preferences</li>
                  <li>Usage analytics tied to your account</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-medium">Retention Periods:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Conversations:</strong> Stored indefinitely unless you delete them</li>
                  <li><strong>Memories:</strong> Retained according to your memory preferences (default: 365 days)</li>
                  <li><strong>Analytics:</strong> Aggregated data retained for 2 years maximum</li>
                  <li><strong>Deleted Accounts:</strong> All data permanently deleted within 30 days</li>
                </ul>

                <h4 className="font-medium">Automatic Cleanup:</h4>
                <p>
                  You can enable automatic cleanup features to delete old memories and conversations based on your preferences.
                </p>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card>
              <CardHeader>
                <CardTitle>8. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Entwined operates globally, and your data may be processed in countries other than your residence. We ensure appropriate safeguards are in place for international transfers:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Compliance with GDPR, CCPA, and other privacy regulations</li>
                  <li>Standard contractual clauses for data protection</li>
                  <li>Encryption and security measures for all transfers</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Entwined is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will delete such information immediately.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Sending an email notification for significant changes</li>
                  <li>Displaying a notice in the application</li>
                </ul>
                <p>
                  Changes become effective immediately upon posting unless otherwise stated.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us About Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                  <p><strong>Email:</strong> privacy@entwineds.app</p>
                  <p><strong>Data Protection Officer:</strong> dpo@entwineds.app</p>
                  <p><strong>Website:</strong> entwineds.app</p>
                  <p><strong>Response Time:</strong> We respond to privacy inquiries within 48 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Your privacy is our priority. We're committed to protecting your data and being transparent about our practices.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/terms-of-service">
                <Button variant="outline">Terms of Service</Button>
              </Link>
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
