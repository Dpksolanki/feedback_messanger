"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@react-email/components";
import { X } from "lucide-react";
import { Message } from "@/app/models/user";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import axios from "axios";
import { AxiosError } from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const messageid = message._id as string;

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${messageid}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error deleting message",
        description:
          axiosError?.response?.data?.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative p-4 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg border border-gray-200 w-full max-w-sm">
      {/* X Icon (top-left) */}
      <div className="absolute top-3 left-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"className="p-1 cursor-pointer">
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                your message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Card Header */}
      <CardHeader className="text-center">
        <CardTitle className="text-md font-semibold text-gray-900">
          {message.content}
        </CardTitle>
      </CardHeader>

      {/* Card Content (Optional) */}
      <CardContent className="mt-2 text-sm text-gray-600">
        {/* You can add more content here */}
      </CardContent>
    </Card>
  );
};

export default MessageCard;

