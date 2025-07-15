"use client"

import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  type AboutAptosConnectEducationScreen,
  type AdapterNotDetectedWallet,
  type AdapterWallet,
  AptosPrivacyPolicy,
  WalletItem,
  type WalletSortingOptions,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react"
import { ArrowLeft, ArrowRight, ChevronDown, Copy, LogOut, User, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { Button } from "./ButtonCW"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./DropdownMenu"
import { useToast } from "@/hooks/animation-hook/useToast"

export function WalletSelector(walletSortingOptions: WalletSortingOptions) {
  const { account, connected, disconnect, wallet } = useWallet()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const closeDialog = useCallback(() => setIsDialogOpen(false), [])

  const copyAddress = useCallback(async () => {
    if (!account?.address) return
    try {
      await navigator.clipboard.writeText(account.address.toString())
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      })
    }
  }, [account?.address, toast])

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          <div className="relative flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {account?.ansName || truncateAddress(account?.address?.toString()) || "Unknown"}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2 hover:bg-blue-50/50 transition-colors text-black/90">
          <Copy className="h-4 w-4 text-blue-500" /> Copy address
        </DropdownMenuItem>
        {wallet && isAptosConnectWallet(wallet) && (
          <DropdownMenuItem asChild>
            <a
              href={APTOS_CONNECT_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 hover:bg-purple-50/50 transition-colors"
            >
              <User className="h-4 w-4 text-purple-500" /> Account
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={disconnect} className="gap-2 hover:bg-red-50/50 transition-colors text-red-600">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="relative overflow-hidden group bg-white text-black border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
          <div className="absolute inset-0 bg-gray-100/50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
          <span className="relative text-[#2A849A]">Connect Wallet</span>
        </Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} {...walletSortingOptions} />
    </Dialog>
  )
}

interface ConnectWalletDialogProps extends WalletSortingOptions {
  close: () => void
}

function ConnectWalletDialog({ close, ...walletSortingOptions }: ConnectWalletDialogProps) {
  const { wallets = [], notDetectedWallets = [] } = useWallet()

  const { aptosConnectWallets, availableWallets, installableWallets } = groupAndSortWallets(
    [...wallets, ...notDetectedWallets],
    walletSortingOptions,
  )

  const hasAptosConnectWallets = !!aptosConnectWallets.length

  return (
    <DialogContent className="max-h-screen overflow-auto bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10" />

      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug text-black">
            {hasAptosConnectWallets ? (
              <>
                <span className="text-2xl font-bold">Log in or sign up</span>
                <span className="text-lg">with Social + Aptos Connect</span>
              </>
            ) : (
              <span className="text-2xl font-bold">Connect Wallet</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {hasAptosConnectWallets && (
          <div className="flex flex-col gap-3 pt-3">
            <div className="space-y-2">
              {aptosConnectWallets.map((wallet) => (
                <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
              ))}
            </div>

            <div className="flex items-center justify-center py-2">
              <p className="flex gap-1 justify-center items-center text-black text-sm">
                Learn more about{" "}
                <AboutAptosConnect.Trigger className="flex gap-1 py-1 px-2 items-center text-black hover:bg-blue-50 rounded-md transition-colors group">
                  Aptos Connect
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </AboutAptosConnect.Trigger>
              </p>
            </div>

            <AptosPrivacyPolicy className="flex flex-col items-center py-2">
              <p className="text-xs leading-5 text-center text-black">
                <AptosPrivacyPolicy.Disclaimer />{" "}
                <AptosPrivacyPolicy.Link className="text-blue-600 underline underline-offset-4 hover:text-blue-700 transition-colors" />
                <span className="text-black">.</span>
              </p>
              <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-black mt-1" />
            </AptosPrivacyPolicy>

            <div className="flex items-center gap-3 pt-4 text-black">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="px-2 text-sm font-medium">Or</span>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-3">
          <div className="space-y-2">
            {availableWallets.map((wallet) => (
              <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
            ))}
          </div>

          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-2 hover:bg-gray-300 text-black transition-all duration-200 group"
                >
                  More wallets
                  <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                {installableWallets.map((wallet) => (
                  <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  )
}

interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet
  onConnect?: () => void
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await onConnect?.()
    } finally {
      setIsConnecting(false)
    }
  }, [onConnect])

  const getWalletColor = (walletName: string) => {
    const colors: Record<string, string> = {
      Petra: "from-purple-500 to-pink-500",
      Martian: "from-green-500 to-emerald-500",
      "Pontem Wallet": "from-[#ebb4ff] to-[#ebb4ff]",
      Fewcha: "from-orange-500 to-red-500",
      Nightly: "from-indigo-500 to-purple-900",
      Rise: "from-yellow-500 to-orange-500",
      Rimosafe: "from-red-500 to-orange-500",
      "OKX Wallet": "from-gray-600 to-gray-600",
    }
    console.log(walletName,": ", colors[walletName])
    return colors[walletName] || "from-gray-500 to-gray-600"
  }

  return (
    <WalletItem
      wallet={wallet}
      onConnect={handleConnect}
      className={`group relative overflow-hidden flex items-center justify-between px-4 py-3 gap-4 border rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        !isInstallRequired(wallet)
          ? "border-gray-200 hover:border-blue-300 bg-white/50 hover:bg-white/80"
          : "border-gray-200 hover:border-[#2A849A] bg-gray-50/50 hover:bg-gray-100/80 bg-purple"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${getWalletColor(wallet.name)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative flex items-center gap-4">
        <div className="relative">
          <WalletItem.Icon className="h-8 w-8" />
          {!isInstallRequired(wallet) && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex flex-col">
          <WalletItem.Name className="text-base font-medium text-black" />
          <span className="text-xs text-black">{isInstallRequired(wallet) ? "Not installed" : "Installed"}</span>
        </div>
      </div>

      {isInstallRequired(wallet) ? (
        <Button
          size="sm"
          variant="outline"
          asChild
          className="relative overflow-hidden group/btn hover:border-[#2A849A] hover:text-[#26768a] bg-transparent"
        >
          <WalletItem.InstallLink>
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
            <span className="relative text-[#2A849A]">Install</span>
          </WalletItem.InstallLink>
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button
            size="sm"
            disabled={isConnecting}
            className={`relative overflow-hidden group/btn bg-gradient-to-r ${getWalletColor(wallet.name)} hover:shadow-lg transition-all duration-300 ${
              isConnecting ? "animate-pulse" : ""
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="relative flex items-center gap-2">
              {isConnecting && <Loader2 className="h-3 w-3 animate-spin" />}
              {isConnecting ? "Connecting..." : "Connect"}
            </span>
          </Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  )
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await onConnect?.()
    } finally {
      setIsConnecting(false)
    }
  }, [onConnect])

  const getWalletColor = (walletName: string) => {
    const colors: Record<string, string> = {
      Google: "from-blue-600 to-blue-400",
      Apple: "from-gray-800 to-gray-600",
      Facebook: "from-blue-700 to-blue-500",
      Discord: "from-indigo-600 to-purple-600",
    }
    return colors[walletName] || "from-gray-500 to-gray-600"
  }

  return (
    <WalletItem wallet={wallet} onConnect={handleConnect}>
      <WalletItem.ConnectButton asChild>
        <Button
          size="lg"
          variant="outline"
          className={`relative overflow-hidden w-full gap-4 bg-white/50 hover:bg-white/80 border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group ${
            isConnecting ? "animate-pulse" : ""
          }`}
          disabled={isConnecting}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r ${getWalletColor(wallet.name)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />

          <div className="relative flex items-center gap-4">
            <div className="rounded-full"><WalletItem.Icon className="h-6 w-6" /></div>
           
            <WalletItem.Name className="text-base font-medium text-black">
              {isConnecting ? (
                <span className="flex items-center gap-2 text-black">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting to {wallet.name}...
                </span>
              ) : (
                `Continue with ${wallet.name}`
              )}
            </WalletItem.Name>
          </div>
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  )
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <div className="bg-white/95 backdrop-blur-xl">
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel} className="hover:bg-gray-100/50 transition-colors">
          <ArrowLeft />
        </Button>
        <DialogTitle className="leading-snug text-base text-center text-black">About Aptos Connect</DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] pb-3 items-end justify-center">
        <screen.Graphic />
      </div>

      <div className="flex flex-col gap-2 text-center pb-4">
        <screen.Title className="text-xl font-bold text-black" />
        <screen.Description className="text-sm text-black [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-blue-600 [&>a]:hover:text-blue-700 [&>a]:transition-colors" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.back}
          className="justify-self-start hover:bg-gray-100/50 transition-colors"
        >
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-gradient-to-r [[data-active]>&]:from-blue-500 [[data-active]>&]:to-purple-500" />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.next}
          className="gap-2 justify-self-end hover:bg-gray-100/50 transition-colors group"
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
