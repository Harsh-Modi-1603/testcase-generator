
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, Download, FilePlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface TestCase {
  id: string;
  title: string;
  steps: string[];
  expectedResult: string;
  type: "functional" | "ui" | "performance" | "security";
}

interface TestCasesListProps {
  storyId: string;
  testCases: TestCase[];
  onClose: () => void;
}

const typeColorMap = {
  "functional": "bg-jira-blue text-white",
  "ui": "bg-jira-purple text-white",
  "performance": "bg-jira-yellow text-black",
  "security": "bg-jira-red text-white",
};

export const TestCasesList = ({ storyId, testCases, onClose }: TestCasesListProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const filteredTestCases = selectedTab === "all" 
    ? testCases 
    : testCases.filter(tc => tc.type === selectedTab);

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    
    toast.success("Copied to clipboard");
  };

  const handleDownload = () => {
    const content = testCases.map(tc => {
      return `
TEST CASE: ${tc.title}
TYPE: ${tc.type}
STEPS:
${tc.steps.map((step, idx) => `  ${idx + 1}. ${step}`).join('\n')}
EXPECTED RESULT:
  ${tc.expectedResult}
-------------------
`;
    }).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storyId}-test-cases.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Test cases downloaded");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-scale-in shadow-lg">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono">{storyId}</Badge>
            <Badge className="bg-green-500 text-white">
              {testCases.length} Test Cases
            </Badge>
          </div>
          <CardTitle className="text-xl">Generated Test Cases</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-4 pb-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-5 w-auto">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="functional" className="text-xs">Functional</TabsTrigger>
              <TabsTrigger value="ui" className="text-xs">UI</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
              <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </div>
          
          <TabsContent value={selectedTab} className="mt-0">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {filteredTestCases.map((testCase) => (
                  <Card key={testCase.id} className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("story-tag", typeColorMap[testCase.type])}>
                            {testCase.type}
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            TC-{testCase.id}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => {
                            const text = `
TEST CASE: ${testCase.title}
STEPS:
${testCase.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
EXPECTED RESULT:
${testCase.expectedResult}`;
                            handleCopyToClipboard(text, testCase.id);
                          }}
                        >
                          {copiedId === testCase.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <h3 className="font-medium text-sm">{testCase.title}</h3>
                    </CardHeader>
                    <CardContent className="pb-2 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-xs text-muted-foreground">Steps</h4>
                        <ol className="list-decimal list-inside space-y-1">
                          {testCase.steps.map((step, idx) => (
                            <li key={idx} className="text-muted-foreground">{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="mt-3 space-y-1">
                        <h4 className="font-medium text-xs text-muted-foreground">Expected Result</h4>
                        <p className="text-muted-foreground">{testCase.expectedResult}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Separator className="mt-4" />
      
      <CardFooter className="py-3 flex justify-end">
        <Button variant="outline" onClick={onClose} className="gap-1.5">
          <FilePlus className="h-4 w-4" />
          <span>Return to Stories</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Utility for class names
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
