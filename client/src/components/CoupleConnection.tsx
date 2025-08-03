import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Copy, Unlink } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CoupleStatus {
  couple: any;
  isConnected: boolean;
}

export default function CoupleConnection() {
  const [connectionCode, setConnectionCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch couple status
  const { data: coupleStatus, isLoading } = useQuery<CoupleStatus>({
    queryKey: ['/api/couple/status'],
  });

  // Create connection code mutation
  const createCodeMutation = useMutation({
    mutationFn: () => apiRequest('/api/couple/create-code', 'POST'),
    onSuccess: (data: any) => {
      setGeneratedCode(data.connectionCode);
      toast({
        title: "Connection code created!",
        description: "Share this code with your partner to connect.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create connection code",
        variant: "destructive",
      });
    },
  });

  // Connect with partner mutation
  const connectMutation = useMutation({
    mutationFn: (code: string) => apiRequest('/api/couple/connect', 'POST', { connectionCode: code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couple/status'] });
      setConnectionCode("");
      toast({
        title: "Connected successfully!",
        description: "You're now connected with your partner. Start chatting!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection failed",
        description: error.message || "Invalid connection code",
        variant: "destructive",
      });
    },
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: () => apiRequest('/api/couple/disconnect', 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/couple/status'] });
      setGeneratedCode("");
      toast({
        title: "Disconnected",
        description: "You've been disconnected from your partner.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect",
        variant: "destructive",
      });
    },
  });

  const handleCreateCode = () => {
    createCodeMutation.mutate();
  };

  const handleConnect = () => {
    if (!connectionCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a connection code",
        variant: "destructive",
      });
      return;
    }
    connectMutation.mutate(connectionCode.trim().toUpperCase());
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Connection code copied to clipboard",
    });
  };

  const handleDisconnect = () => {
    disconnectMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Heart className="w-8 h-8 animate-pulse mx-auto mb-2 text-pink-500" />
          <p>Checking connection status...</p>
        </div>
      </div>
    );
  }

  if (coupleStatus?.isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-green-500 mr-2" />
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
          <CardTitle className="text-xl">Connected with Partner</CardTitle>
          <CardDescription>
            You're now connected and can chat together!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Switch between AI chat and partner chat using the mode selector in the main chat.
            </p>
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
              className="w-full"
            >
              <Unlink className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Create Connection Code */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex items-center justify-center">
            <Heart className="w-5 h-5 mr-2 text-pink-500" />
            Connect with Your Partner
          </CardTitle>
          <CardDescription>
            Create a connection code to invite your girlfriend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generatedCode ? (
            <div className="text-center space-y-3">
              <div className="bg-pink-50 dark:bg-pink-950/20 p-4 rounded-lg border-2 border-dashed border-pink-200 dark:border-pink-800">
                <p className="text-sm text-muted-foreground mb-2">Your connection code:</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-2xl font-bold text-pink-600 dark:text-pink-400 tracking-wider">
                    {generatedCode}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyCode}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this code with your girlfriend so she can connect with you
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleCreateCode} 
              disabled={createCodeMutation.isPending}
              className="w-full"
            >
              {createCodeMutation.isPending ? "Creating..." : "Create Connection Code"}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="px-3 text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Connect with Code */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Join Your Partner</CardTitle>
          <CardDescription>
            Enter the connection code your partner shared with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter connection code"
              value={connectionCode}
              onChange={(e) => setConnectionCode(e.target.value.toUpperCase())}
              className="text-center font-mono tracking-wider"
              maxLength={6}
            />
            <Button 
              onClick={handleConnect}
              disabled={connectMutation.isPending || !connectionCode.trim()}
              className="w-full"
            >
              {connectMutation.isPending ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}