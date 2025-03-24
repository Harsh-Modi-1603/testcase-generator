
import { useState } from "react";
import { JiraAuth } from "@/components/JiraAuth";
import { UserStory, UserStoryProps } from "@/components/UserStory";
import { TestCasesList } from "@/components/TestCasesList";
import { Separator } from "@/components/ui/separator";
import { SearchX, CircleDashed, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sample JIRA stories data
const MOCK_USER_STORIES: UserStoryProps[] = [
  {
    id: "JIRA-101",
    title: "Implement user authentication with OAuth 2.0",
    description: "As a user, I want to be able to log in using my Google or Facebook account, so that I don't have to remember another password. The authentication should use OAuth 2.0 protocol and store user information securely in our database. The UI should show login options clearly and provide feedback on the authentication status.",
    priority: "High",
    status: "In Progress",
    assignee: "Sarah Lee",
    dueDate: "2023-08-15",
    epicLink: "User Management",
    tags: ["authentication", "security", "frontend"],
    onGenerateTests: () => {},
  },
  {
    id: "JIRA-102",
    title: "Create responsive dashboard with analytics widgets",
    description: "As a marketing manager, I want to see key performance indicators on a dashboard, so that I can make data-driven decisions. The dashboard should include charts for user engagement, conversion rates, and revenue metrics. It should be responsive and work well on mobile devices.",
    priority: "Medium",
    status: "To Do",
    assignee: "David Wong",
    dueDate: "2023-08-20",
    epicLink: "Analytics Platform",
    tags: ["dashboard", "frontend", "charts"],
    onGenerateTests: () => {},
  },
  {
    id: "JIRA-103",
    title: "Optimize database queries for product search",
    description: "The current product search is too slow when the catalog exceeds 10,000 items. We need to optimize the database queries to ensure search results return in under 200ms regardless of catalog size. This may require implementing proper indexing, query optimization, or considering a search service like Elasticsearch.",
    priority: "Highest",
    status: "Blocked",
    assignee: "Michael Chen",
    dueDate: "2023-08-10",
    epicLink: "Performance Improvements",
    tags: ["backend", "database", "performance"],
    onGenerateTests: () => {},
  },
  {
    id: "JIRA-104",
    title: "Implement email notification system",
    description: "As a user, I want to receive email notifications for important events in the system, so that I can stay informed even when I'm not using the application. The notification system should support templates, scheduling, and user preferences for opting in/out of different notification types.",
    priority: "Low",
    status: "Done",
    assignee: "Emily Johnson",
    dueDate: "2023-08-05",
    epicLink: "Notifications",
    tags: ["backend", "email", "notifications"],
    onGenerateTests: () => {},
  },
];

// Sample test cases data
const MOCK_TEST_CASES = [
  {
    id: "001",
    title: "Verify user can login with valid Google OAuth credentials",
    steps: [
      "Navigate to login page",
      "Click on 'Sign in with Google' button",
      "Enter valid Google credentials",
      "Submit the form"
    ],
    expectedResult: "User should be authenticated and redirected to the dashboard page with proper welcome message",
    type: "functional" as const
  },
  {
    id: "002",
    title: "Verify validation messages for incorrect OAuth login attempt",
    steps: [
      "Navigate to login page",
      "Click on 'Sign in with Google' button",
      "Enter invalid Google credentials",
      "Submit the form"
    ],
    expectedResult: "User should see appropriate error message and remain on the login page",
    type: "functional" as const
  },
  {
    id: "003",
    title: "Verify UI elements of the OAuth login buttons",
    steps: [
      "Navigate to login page",
      "Observe the OAuth login buttons",
      "Check button visibility on different screen sizes",
      "Verify the proper icons are displayed for each provider"
    ],
    expectedResult: "OAuth buttons should be clearly visible, properly sized with correct icons that are recognizable for each provider",
    type: "ui" as const
  },
  {
    id: "004",
    title: "Verify login performance with simulated network latency",
    steps: [
      "Setup network throttling to simulate slow connection (3G)",
      "Navigate to login page",
      "Click on 'Sign in with Google' button",
      "Complete OAuth flow",
      "Measure time to complete authentication"
    ],
    expectedResult: "Authentication should complete within acceptable time threshold (< 5 seconds) and show appropriate loading indicators",
    type: "performance" as const
  },
  {
    id: "005",
    title: "Verify security of OAuth token storage",
    steps: [
      "Complete OAuth login process",
      "Inspect browser storage (localStorage, sessionStorage, cookies)",
      "Check for presence of tokens",
      "Check token expiration and security attributes"
    ],
    expectedResult: "OAuth tokens should be stored securely with proper expiration, HttpOnly and Secure flags where appropriate. No sensitive data should be exposed in client storage",
    type: "security" as const
  }
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userStories, setUserStories] = useState<UserStoryProps[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleAuthenticate = (domain: string, email: string, token: string) => {
    setIsLoading(true);
    
    // Simulate loading data from JIRA API
    setTimeout(() => {
      setUserStories(MOCK_USER_STORIES.map(story => ({
        ...story,
        onGenerateTests: (id) => handleGenerateTests(id),
      })));
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleGenerateTests = (id: string) => {
    setSelectedStoryId(id);
  };

  const handleCloseTestCases = () => {
    setSelectedStoryId(null);
  };

  const filteredStories = userStories.filter(story => 
    story.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-6 max-w-lg text-center">
          <CircleDashed size={40} className="text-primary animate-spin" />
          <h2 className="text-2xl font-medium">Loading JIRA Stories</h2>
          <p className="text-muted-foreground">
            We're retrieving your stories from JIRA. This may take a moment...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/50">
        <div className="w-full max-w-4xl space-y-10">
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl font-medium tracking-tight">Jira AI TestCase Generator</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate comprehensive test cases from your JIRA user stories with just one click.
            </p>
          </div>
          
          <JiraAuth onAuthenticate={handleAuthenticate} />
          
          <div className="flex justify-center mt-8 text-center">
            <p className="text-sm text-muted-foreground max-w-md">
              TestCase Generator uses AI to analyze your JIRA stories and generate detailed test cases across functional, UI, performance, and security domains.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedStoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/50">
        <TestCasesList 
          storyId={selectedStoryId} 
          testCases={MOCK_TEST_CASES} 
          onClose={handleCloseTestCases} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-background to-secondary/50">
      <header className="w-full max-w-6xl mx-auto mb-8 animate-slide-down">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-medium tracking-tight">JIRA User Stories</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAuthenticated(false)}
              className="gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Change JIRA Account</span>
            </Button>
          </div>
          
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search stories by ID, title or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </header>
      
      <Separator className="mb-8" />
      
      <main className="flex-1 w-full max-w-6xl mx-auto">
        {filteredStories.length > 0 ? (
          <div className="grid gap-6 animate-fade-in">
            {filteredStories.map((story) => (
              <UserStory key={story.id} {...story} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
            <SearchX size={48} className="text-muted-foreground/50" />
            <h3 className="text-xl font-medium">No stories found</h3>
            <p className="text-muted-foreground max-w-md">
              No user stories match your search criteria. Try adjusting your search term or refresh the connection to JIRA.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
