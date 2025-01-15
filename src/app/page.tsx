'use client'

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
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Providers } from '@/hooks/TonConnectProvider';
import TonWeb from 'tonweb';

const saveUserData = async (telegramId: string, clicks: number, tonAddress: string) => {
  const response = await fetch('/api/save-user', {
    method: 'POST',  // Ensure it's a POST request
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ telegramId, clicks, tonAddress }),  // Correctly formatted JSON body
  });
  return response.json();
};


const fetchLeaderboard = async () => {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};
const verifyPurchase = async (transactionHash: string, address: string) => {
  const response = await fetch('/api/verify-purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transactionHash, address }),
  });
  return response.json();
};

function GameContent() {
  const [clicks, setClicks] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [currentTab, setCurrentTab] = useState("game");
  const [leaderboard, setLeaderboard] = useState<Array<{ username: string; clicks: number }>>([]);
  const [hasGamePass, setHasGamePass] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const [tonAddress, setTonAddress] = useState<string | null>(null);

  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();


  useEffect(() => {
    const leaderboardInterval = setInterval(() => {
      fetchLeaderboard().then(setLeaderboard);
    }, 5000);
  
    return () => clearInterval(leaderboardInterval);
  }, []);


  useEffect(() => {
    if (telegramId && address) {
      saveUserData(telegramId, clicks, address);
    }
  }, [telegramId, address, clicks]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClickPosition({ x, y });
    setIsClicking(true);
    setClicks((prev) => {
      const newClicks = prev + (hasGamePass ? 2 : 1);
      if (telegramId && address) {
        saveUserData(telegramId, newClicks, address);
      }
      return newClicks;
    });
    setTimeout(() => setIsClicking(false), 300);
  };

  const handlePurchaseGamePass = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60 * 20,
        messages: [
          {
            address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
            amount: TonWeb.utils.toNano('1'),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        const { success } = await verifyPurchase(result.boc, address);
        if (success) {
          setHasGamePass(true);
          toast({
            title: "Game Pass Purchased",
            description: "You now have 2x clicking power!",
          });
          if (telegramId) {
            await saveUserData(telegramId, clicks, address);
          }
        } else {
          throw new Error('Purchase verification failed');
        }
      }
    } catch (error) {
      console.error('Transaction error:', error);
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

  const handleTelegramLogin = () => {
    const botUsername = "Cbe_Coin_bot"; // Your bot's username
    const redirectUri = encodeURIComponent(window.location.origin + "/api/auth/telegram"); // Redirect URI after login
    const telegramLoginUrl = `https://telegram.me/${botUsername}?start=login&redirect_uri=${redirectUri}`;
    window.location.href = telegramLoginUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("telegramId");
    const address = urlParams.get("tonAddress");
    const clicks = parseInt(urlParams.get("clicks") || "0", 10);

    if (id && address) {
      setTelegramId(id);
      setTonAddress(address);
      setClicks(clicks);
      saveUserData(id, clicks, address)
        .then(() => {
          toast({
            title: "User Data Saved",
            description: "Your data has been saved successfully!",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case "game":
        return (
          <Card className="border-0  rounded-none shadow-none text-white h-[90vh] ">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400">
                {clicks}
              </div>
              <motion.div
                className="cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClick}
              >
                <Image
                  src="/cube.png"
                  alt="Clickable Squirrel"
                  className="w-full h-full object-cover rounded-full"
                  width={500}
                  height={500}
                />
                {isClicking && (
                  <motion.div
                    key={clicks}
                    className="absolute text-2xl font-bold text-yellow-500"
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
          <Card className="bg-gradient-to-br from-neutral-500 to-gray-900 text-white">
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
          <Card className="bg-gradient-to-br from-neutral-500 to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <TonConnectButton />
              {address && (
                <div className="mt-4">
                  <p>Connected: {address}</p>
                  <p>Clicks: {clicks}</p>
                  <p>Game Pass: {hasGamePass ? "Active" : "Inactive"}</p>
                  {!hasGamePass && (
                    <Button onClick={handlePurchaseGamePass} className="mt-4">
                      Buy Game Pass (2x Clicks) - 1 TON
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      case "invite":
        return (
          <Card className="bg-gradient-to-br from-neutral-500 to-gray-900 text-white">
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
          <Card className="bg-gradient-to-br from-neutral-500 to-gray-900 text-white">
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
    <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br from-neutral-500 to-gray-900 text-white">
      <main className="container mx-auto p-4 flex-grow">{renderContent()}</main>
      <nav className="fixed bottom-3 mx-3 rounded-2xl left-0 right-0 bg-gradient-to-r from-10% to-95% from-neutral-500 to-gray-900 bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
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
      <Button onClick={handleTelegramLogin}>Login with Telegram</Button>
    </div>
  );
}

export default function Page() {
  return (
    <Providers>
      <GameContent />
    </Providers>
  );
}