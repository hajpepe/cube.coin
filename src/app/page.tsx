"use client";

/// <reference path="./telegram.d.ts" />

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RocketIcon,
  TrophyIcon,
  Users,
  Target,
  WalletIcon,
} from "lucide-react";

// Placeholder for TON wallet connection function
const connectWallet = async () => {
  // Implement actual TON wallet connection here
  return { address: "0x1234...5678" };
};

// Placeholder for game pass purchase function
const purchaseGamePass = async (address: string) => {
  // Implement actual game pass purchase logic here
  return { success: true };
};

// Placeholder for fetching leaderboard data
const fetchLeaderboard = async () => {
  // Implement actual leaderboard fetching logic here
  return [
    { username: "Player1", clicks: 1000 },
    { username: "Player2", clicks: 800 },
    { username: "Player3", clicks: 600 },
  ];
};

export default function Page() {
  const [clicks, setClicks] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [currentTab, setCurrentTab] = useState("game");
  const [leaderboard, setLeaderboard] = useState<
    Array<{ username: string; clicks: number }>
  >([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasGamePass, setHasGamePass] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize Telegram Mini App if present
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }

    // Fetch initial leaderboard data
    fetchLeaderboard().then(setLeaderboard);

    // Set up interval to refresh leaderboard every 30 seconds
    const leaderboardInterval = setInterval(() => {
      fetchLeaderboard().then(setLeaderboard);
    }, 30000);

    return () => clearInterval(leaderboardInterval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setIsClicking(true);
    setClicks((prev) => prev + (hasGamePass ? 2 : 1));
    setTimeout(() => setIsClicking(false), 300);
  };

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };
  const handlePurchaseGamePass = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const { success } = await purchaseGamePass(walletAddress);
      if (success) {
        setHasGamePass(true);
        toast({
          title: "Game Pass Purchased",
          description: "You now have 2x clicking power!",
        });
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase game pass",
        variant: "destructive",
      });
    }
  };

  const handleInviteFriend = () => {
    const telegramBotLink = "https://t.me/your_bot_username";
    window.open(telegramBotLink, "_blank");
  };

  const renderContent = () => {
    switch (currentTab) {
      case "game":
        return (
          <Card className=" border-0 rounded-none shadow-none text-white  h-full">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r  from-white to-yellow-400">
                {clicks}
              </div>
              <motion.div
                className="cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
              >
                <Image
                  src="https://i.ibb.co/DMRsZ0S/cube.png"
                  alt="Clickable Squirrel"
                  className="w-full h-full object-cover rounded-full"
                  width={500} // Set the appropriate width
                  height={500} // Set the appropriate height
                  objectFit="cover"
                />
                {isClicking && (
                  <motion.div
                    key={clicks} // Use clicks as a key to force a new animation each time
                    className="absolute text-2xl font-bold  text-yellow-500"
                    initial={{
                      opacity: 1,
                      scale: 0.5,
                      y: 0,
                      x: clickPosition.x,
                      top: clickPosition.y,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 2,
                      y: -80,
                      transition: { duration: 0.6, ease: "easeOut" },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1,
                      transition: { duration: 0.1 },
                    }}
                  >
                    +{hasGamePass ? 2 : 1}
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        );
      case "leaderboard":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((player, index) => (
                    <TableRow key={player.username}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{player.username}</TableCell>
                      <TableCell>{player.clicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      case "wallet":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              {!walletAddress ? (
                <Button onClick={handleConnectWallet}>
                  <WalletIcon className="mr-2 h-4 w-4" /> Connect TON Wallet
                </Button>
              ) : (
                <div>
                  <p>Connected: {walletAddress}</p>
                  <p>Clicks: {clicks}</p>
                  <p>Game Pass: {hasGamePass ? "Active" : "Inactive"}</p>
                  {!hasGamePass && (
                    <Button onClick={handlePurchaseGamePass} className="mt-4">
                      Buy Game Pass (2x Clicks)
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "invite":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Invite Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Invite your friends to join the Squirrel Clicker Game!
              </p>
              <Button onClick={handleInviteFriend}>Invite via Telegram</Button>
            </CardContent>
          </Card>
        );
      case "quests":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Daily Quests</h3>
              <ul className="space-y-2">
                <li>Click 1000 times - Reward: 500 bonus clicks</li>
                <li>Invite 3 friends - Reward: 1000 bonus clicks</li>
                <li>Purchase Game Pass - Reward: Golden Squirrel Avatar</li>
              </ul>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center h-[100vh] bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
      <main className=" container mx-auto p-4 ">{renderContent()}</main>
      <nav className="fixed  bottom-3  mx-3 rounded-2xl  left-0 right-0 bg-gradient-to-r from-10%  to-95% from-neutral-500  to-gray-900 bg-opacity-90 backdrop-blur-sm">
        <div className="container  mx-auto px-4">
          <ul className="flex justify-around items-center h-16">
            <li>
              <button
                onClick={() => setCurrentTab("game")}
                className={`flex flex-col items-center ${
                  currentTab === "game" ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <RocketIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Game</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("leaderboard")}
                className={`flex flex-col items-center ${
                  currentTab === "leaderboard"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                <TrophyIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Leaderboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("wallet")}
                className={`flex flex-col items-center ${
                  currentTab === "wallet" ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <WalletIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Wallet</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("invite")}
                className={`flex flex-col items-center ${
                  currentTab === "invite" ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs mt-1">Invite</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("quests")}
                className={`flex flex-col items-center ${
                  currentTab === "quests" ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                <Target className="w-6 h-6" />
                <span className="text-xs mt-1">Quests</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
