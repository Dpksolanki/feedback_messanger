"use client";
import { Message } from "@/app/models/user";
import { acceptMessageSchema } from "@/app/schemas/acceptSchema";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@radix-ui/react-switch";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import { User } from "@/types/user"; // Ensure you have a proper type defined

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const handleAcceptMessage = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error accepting messages",
        description: axiosError?.response?.data?.message ?? "Failed to accept messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error fetching messages",
          description: axiosError?.response?.data?.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    handleAcceptMessage();
  }, [session, fetchMessages, handleAcceptMessage]);

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitching(true);
    try {
      await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Messages updated",
        description: "Message acceptance preference updated",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error accepting messages",
        description: axiosError?.response?.data?.message ?? "Failed to update messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile URL copied to clipboard",
    });
  };

  if (!session || !session.user) {
    return <div className="text-center">Please log in to view your dashboard</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">User Dashboard</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium">Unique Link</h2>
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full px-3 py-2 border rounded-md"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitching}
          />
          <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <Button
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : "Refresh Messages"}
      </Button>

      <div className="mt-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="border p-3 rounded-md mb-2">
              <p>{message.content}</p>
              <Button variant="destructive" onClick={() => handleDeleteMessage(message._id)}>
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No messages found. Please refresh or check back later.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
