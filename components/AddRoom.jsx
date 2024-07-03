"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import Loader from "./Loader";

const AddRoom = ({ getRooms, addAnonymousRoom }) => {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("create");
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomType, setRoomType] = useState("anonymous");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, []);

  async function joinRoom(rid) {
    setLoading(true);

    try {
      if (localStorage.getItem("token")) {
        console.log("HOPELESS", rid);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/join/${roomId || rid}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (response.status === 200) {
          console.log("Room Joined");
          console.log(response.data);
          setRoomId("");
          setOpen(false);
          getRooms();
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/join-anonymous/${
            roomId || rid
          }`,
          {}
        );

        if (response.status === 200) {
          console.log(" Room Joined");
          console.log(response.data);
          setRoomId("");
          addAnonymousRoom(response.data);
          setOpen(false);
        }
      }
    } catch (error) {
      setRoomId("");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Invalid Room ID",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function createRoom(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let response = {};
      if (localStorage.getItem("token") && roomType === "public") {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/rooms`,
          {
            name: roomName,
            type: "public",
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (response.status === 200) {
          console.log("Public Room Created");
          console.log(response.data.id);
          console.log(response.data);
          setRoomName("");
          joinRoom(response.data.id);
        }
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/rooms/anonymous`,
          {
            name: roomName,
            type: "anonymous",
          }
        );
        if (response.status === 200) {
          console.log("Anonymous Room Created");
          console.log(response.data.id);
          console.log(response.data);
          if (localStorage.getItem("token")) {
            setRoomName("");
            joinRoom(response.data.id);
            return;
          }
          addAnonymousRoom(response.data);
          setOpen(false);
          setRoomName("");
        }
      }
    } catch (error) {
      setRoomName("");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Check your Network Or Try Again Later (Server Error)",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className=" bg-[#18181b] h-9 rounded-md px-3 text-white underline-offset-4 text-sm font-medium  hover:underline">
          Create or Join Room
        </DialogTrigger>
        <DialogContent className="max-h-[80vh]  bg-[#000336] border-0 text-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <DialogTitle></DialogTitle>
          <Card className="max-w-md mx-auto ">
            <CardHeader>
              <CardTitle>Create or Join a Chat Room </CardTitle>
              <CardDescription>
                Choose to create a new chat room or join an existing one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Tabs
                  defaultValue="join"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="border-b"
                >
                  <TabsList>
                    <TabsTrigger value="join">Join Room</TabsTrigger>
                    <TabsTrigger value="create">Create Room</TabsTrigger>
                  </TabsList>

                  <TabsContent value="join" className="pt-4">
                    <form className="space-y-4">
                      <div>
                        <Input
                          id="invite-code"
                          placeholder="Enter Room Code"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                        />
                      </div>

                      <Button
                        type="ghost"
                        className="w-full"
                        onClick={(e) => {
                          e.preventDefault();
                          joinRoom();
                        }}
                      >
                        {loading ? <Loader /> : "Join Chat Room"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="create" className="pt-4">
                    <form className="space-y-4">
                      <div>
                        <Input
                          id="name"
                          placeholder="Chat Room Name"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Room Type</Label>
                        <RadioGroup
                          value={roomType}
                          className="flex items-center gap-4"
                          onValueChange={(value) => {
                            setRoomType(value);
                            console.log(value); // Debug log
                          }}
                        >
                          {isAuthenticated && (
                            <Label
                              htmlFor="public"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <RadioGroupItem id="public" value="public" />
                              Public
                            </Label>
                          )}

                          <Label
                            htmlFor="anonymous"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <RadioGroupItem id="anonymous" value="anonymous" />
                            Anonymous
                          </Label>
                        </RadioGroup>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={createRoom}
                      >
                        {loading ? <Loader /> : "Create Chat Room"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoom;
