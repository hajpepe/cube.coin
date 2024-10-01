"'use client'"

import { useState, useEffect } from "'react'"
import { motion, AnimatePresence } from "'framer-motion'"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RocketIcon, TrophyIcon, Users, Target, WalletIcon } from "'lucide-react'"

// Placeholder for TON wallet connection function
const connectWallet = async () => {
  // Implement actual TON wallet connection here
  return { address: "'0x1234...5678'" }
}

// Placeholder for game pass purchase function
const purchaseGamePass = async (address: string) => {
  // Implement actual game pass purchase logic here
  return { success: true }
}

// Placeholder for fetching leaderboard data
const fetchLeaderboard = async () => {
  // Implement actual leaderboard fetching logic here
  return [
    { username: "'Player1'", clicks: 1000 },
    { username: "'Player2'", clicks: 800 },
    { username: "'Player3'", clicks: 600 },
  ]
}

export function Page() {
  const [clicks, setClicks] = useState(0)
  const [isClicking, setIsClicking] = useState(false)
  const [currentTab, setCurrentTab] = useState("'game'")
  const [leaderboard, setLeaderboard] = useState<Array<{ username: string; clicks: number }>>([])
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [hasGamePass, setHasGamePass] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Initialize Telegram Mini App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
    }

    // Fetch initial leaderboard data
    fetchLeaderboard().then(setLeaderboard)

    // Set up interval to refresh leaderboard every 30 seconds
    const leaderboardInterval = setInterval(() => {
      fetchLeaderboard().then(setLeaderboard)
    }, 30000)

    return () => clearInterval(leaderboardInterval)
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    setClickPosition({ x, y })
    setIsClicking(true)
    setClicks(prev => prev + (hasGamePass ? 2 : 1))
    setTimeout(() => setIsClicking(false), 300)
  }

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet()
      setWalletAddress(address)
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handlePurchaseGamePass = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      const { success } = await purchaseGamePass(walletAddress)
      if (success) {
        setHasGamePass(true)
        toast({
          title: "Game Pass Purchased",
          description: "You now have 2x clicking power!",
        })
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase game pass",
        variant: "destructive",
      })
    }
  }

  const handleInviteFriend = () => {
    const telegramBotLink = "'https://t.me/your_bot_username'"
    window.open(telegramBotLink, "'_blank'")
  }

  const renderContent = () => {
    switch (currentTab) {
      case "'game'":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white h-[calc(100vh-6rem)]">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-yellow-400">
                {clicks}
              </div>
              <motion.div
                className="w-96 h-96 cursor-pointer relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
              >
                <img
                  src="https://www.canva.com/design/DAGSU9EgedQ/nU1CS5p8RlgKxv5UnVesLQ/view?utm_content=DAGSU9EgedQ&utm_campaign=share_your_design&utm_medium=link&utm_source=shareyourdesignpanel"
                  alt="Clickable Squirrel"
                  className="w-full h-full object-cover rounded-full"
                />
                <AnimatePresence>
                  {isClicking && (
                    <motion.div
                      className="absolute text-2xl font-bold text-yellow-400"
                      initial={{ opacity: 1, y: 0, x: clickPosition.x, top: clickPosition.y }}
                      animate={{ opacity: 0, y: -50 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      +{hasGamePass ? 2 : 1}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </CardContent>
          </Card>
        )
      case "'leaderboard'":
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
        )
      case "'wallet'":
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
                  <p>Game Pass: {hasGamePass ? "'Active'" : "'Inactive'"}</p>
                  {!hasGamePass && (
                    <Button onClick={handlePurchaseGamePass} className="mt-4">
                      Buy Game Pass (2x Clicks)
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      case "'invite'":
        return (
          <Card className="bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
            <CardHeader>
              <CardTitle>Invite Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Invite your friends to join the Squirrel Clicker Game!</p>
              <Button onClick={handleInviteFriend}>
                Invite via Telegram
              </Button>
            </CardContent>
          </Card>
        )
      case "'quests'":
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
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-500  to-gray-900 text-white">
      <main className="flex-grow container mx-auto p-4 pb-20">
        {renderContent()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-800 to-yellow-800 bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <ul className="flex justify-around items-center h-16">
            <li>
              <button
                onClick={() => setCurrentTab("'game'")}
                className={`flex flex-col items-center ${currentTab === "'game'" ? "'text-yellow-400'" : "'text-gray-400'"}`}
              >
                <RocketIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Game</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("'leaderboard'")}
                className={`flex flex-col items-center ${currentTab === "'leaderboard'" ? "'text-yellow-400'" : "'text-gray-400'"}`}
              >
                <TrophyIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Leaderboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("'wallet'")}
                className={`flex flex-col items-center ${currentTab === "'wallet'" ? "'text-yellow-400'" : "'text-gray-400'"}`}
              >
                <WalletIcon className="w-6 h-6" />
                <span className="text-xs mt-1">Wallet</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("'invite'")}
                className={`flex flex-col items-center ${currentTab === "'invite'" ? "'text-yellow-400'" : "'text-gray-400'"}`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs mt-1">Invite</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentTab("'quests'")}
                className={`flex flex-col items-center ${currentTab === "'quests'" ? "'text-yellow-400'" : "'text-gray-400'"}`}
              >
                <Target className="w-6 h-6" />
                <span className="text-xs mt-1">Quests</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}