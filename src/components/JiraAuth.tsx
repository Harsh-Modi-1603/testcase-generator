
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";

interface JiraAuthProps {
  onAuthenticate: (domain: string, email: string, token: string) => void;
}

export const JiraAuth = ({ onAuthenticate }: JiraAuthProps) => {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || !email || !token) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticate(domain, email, token);
      toast.success("Successfully connected to JIRA");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-card animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium">Connect to JIRA</CardTitle>
        <CardDescription>
          Enter your JIRA credentials to fetch user stories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">JIRA Domain</Label>
            <Input 
              id="domain" 
              placeholder="your-company.atlassian.net" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your-email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="token">API Token</Label>
              <a 
                href="https://id.atlassian.com/manage/api-tokens" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-primary hover:underline highlight-link"
              >
                Create a token
              </a>
            </div>
            <Input 
              id="token" 
              type="password" 
              placeholder="••••••••••••••••" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full group" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock size={16} />
                <span>Connect Securely</span>
                <ArrowRight size={16} className="ml-auto transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-secondary/30 rounded-b-lg border-t">
        <p className="text-xs text-muted-foreground text-center w-full">
          Your API token is stored locally and never sent to our servers. We connect directly to JIRA's API.
        </p>
      </CardFooter>
    </Card>
  );
};
