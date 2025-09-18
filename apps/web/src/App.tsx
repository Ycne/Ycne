import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Search,
  MapPin,
  Sun,
  Moon,
  Store,
  CalendarDays,
  ShoppingCart,
  MessageCircle,
  Star,
  ShieldCheck,
  CreditCard,
  Truck,
  Filter,
  Plus,
  Heart,
  ChevronRight,
} from "lucide-react";

function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    const t = localStorage.getItem("theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme } as const;
}

const categories = [
  { key: "electronics", label: "Electronics", icon: <Store className="h-5 w-5" /> },
  { key: "fashion", label: "Fashion", icon: <Store className="h-5 w-5" /> },
  { key: "furniture", label: "Furniture", icon: <Store className="h-5 w-5" /> },
  { key: "cars", label: "Cars", icon: <Store className="h-5 w-5" /> },
  { key: "jobs", label: "Jobs", icon: <Store className="h-5 w-5" /> },
  { key: "services", label: "Services", icon: <Store className="h-5 w-5" /> },
  { key: "digital", label: "Digital", icon: <Store className="h-5 w-5" /> },
  { key: "reservations", label: "Reservations", icon: <CalendarDays className="h-5 w-5" /> },
];

const sampleListings = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: ["iPhone 14 Pro", "Terracotta Lamp", "Used Sedan", "Gaming Laptop", "Traditional Rug", "Designer Jacket", "Freelance Design", "E-book License"][i % 8],
  price: [150000, 8000, 2200000, 320000, 45000, 12000, 5000, 2000][i % 8],
  location: ["Algiers", "Oran", "Constantine", "Annaba"][i % 4],
  rating: 4 + ((i % 3) / 10),
  imageHue: [140, 30, 200, 170, 20, 350, 100, 210][i % 8],
  seller: ["Yasmine", "Nadir", "Sofiane", "Lina"][i % 4],
}));

function Money({ value }: { value: number }) {
  return <span>{value.toLocaleString("fr-DZ")} DA</span>;
}

export default function App() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState<string>("marketplace");
  const [location, setLocation] = useState<string>("Algiers");
  const [search, setSearch] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [chatOpen, setChatOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<typeof sampleListings[number] | null>(null);

  const filtered = useMemo(() => {
    return sampleListings.filter(x => x.title.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className={cn("min-h-screen", theme === "dark" ? "bg-zellige-dark" : "bg-zellige-light")}>      
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flag-accent" />
            <div>
              <div className="font-serif text-xl tracking-tight">SAFE</div>
              <div className="text-[10px] text-muted-foreground leading-none">Algeria</div>
            </div>
          </div>
          <div className="flex-1" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{location}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="text-sm mb-2">Select location</div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>
                  {[
                    "Algiers",
                    "Oran",
                    "Constantine",
                    "Annaba",
                    "Setif",
                    "Blida",
                    "Tlemcen",
                  ].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-2">
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </div>
        </div>
        <div className="mx-auto max-w-screen-md px-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" placeholder="Search products, services, places" />
            </div>
            <Button variant="secondary" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-md px-4 pb-28 pt-4">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {categories.map(c => (
            <Card key={c.key} className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-2 flex flex-col items-center justify-center gap-1">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary">{c.icon}</div>
                <div className="text-[11px] text-center leading-tight">{c.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Promotions</div>
            <Button variant="ghost" size="sm" className="text-xs">See all</Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {["Sahara Sale", "Mediterranean Deals", "Weekend Reservations"].map((t, i) => (
              <Card key={i} className="min-w-[75%] sm:min-w-[360px]">
                <CardHeader>
                  <CardTitle className="text-lg">{t}</CardTitle>
                  <CardDescription>Hand-picked offers across Algeria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-28 rounded-xl" style={{ background: `linear-gradient(135deg, rgba(10,122,79,.15), rgba(46,109,115,.12)), url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'160\\'><defs><pattern id=\\'g\\' width=\\'40\\' height=\\'40\\' patternUnits=\\'userSpaceOnUse\\'><path d=\\'M0 20 H40 M20 0 V40\\' stroke=\\'%23ffffff\\' stroke-opacity=\\'0.08\\'/></pattern></defs><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%230a7a4f\\'/><rect width=\\'100%\\' height=\\'100%\\' fill=\\'url(%23g)\\'/></svg>') center/cover no-repeat` }} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Tabs value={active} onValueChange={setActive} className="mt-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="mt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filtered.map(item => (
                <Card key={item.id} className="group">
                  <CardContent className="p-0">
                    <button className="w-full" onClick={() => setSelectedListing(item)}>
                      <div className="relative">
                        <div className="aspect-square w-full rounded-t-xl" style={{ background: `linear-gradient(135deg, hsl(${item.imageHue} 60% 70%), hsl(${item.imageHue} 55% 60%))` }} />
                        <Button variant="secondary" size="icon" className="absolute right-2 top-2 rounded-full"><Heart className="h-4 w-4" /></Button>
                      </div>
                      <div className="p-3 space-y-1 text-left">
                        <div className="line-clamp-1 text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-primary"><Money value={item.price} /></div>
                          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"><Star className="h-3.5 w-3.5 fill-current" />{item.rating.toFixed(1)}</div>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reservations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Book a service</CardTitle>
                <CardDescription>Select a date and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                <div className="grid grid-cols-3 gap-2">
                  {["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"].map(t => (
                    <Button key={t} variant="outline" className="w-full">{t}</Button>
                  ))}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full"><CalendarDays className="h-4 w-4 mr-2" /> Book now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between"><span>Date</span><span>{date ? date.toDateString() : "Select date"}</span></div>
                      <div className="flex items-center justify-between"><span>Location</span><span>{location}</span></div>
                      <div className="flex items-center justify-between"><span>Total</span><span><Money value={2000} /></span></div>
                      <Button className="w-full"><CreditCard className="h-4 w-4 mr-2" /> Pay and confirm</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedListing && (
          <Dialog open={!!selectedListing} onOpenChange={(o) => !o && setSelectedListing(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedListing.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-xl h-48" style={{ background: `linear-gradient(135deg, hsl(${selectedListing.imageHue} 60% 70%), hsl(${selectedListing.imageHue} 55% 60%))` }} />
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-primary"><Money value={selectedListing.price} /></div>
                  <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Trusted Seller</Badge>
                </div>
                <div className="text-sm text-muted-foreground">Seller: {selectedListing.seller} • {selectedListing.location}</div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setChatOpen(true)} className="w-full"><MessageCircle className="h-4 w-4 mr-2" /> Chat</Button>
                  <Button className="w-full" onClick={() => setCartOpen(true)}><ShoppingCart className="h-4 w-4 mr-2" /> Buy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent side="bottom" className="h-[75vh]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2"><Avatar className="h-6 w-6"><AvatarFallback>S</AvatarFallback></Avatar> Chat</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-2 h-[55vh] overflow-y-auto">
              <div className="self-start max-w-[70%] rounded-xl bg-muted px-3 py-2 text-sm">Hello, is this available?</div>
              <div className="self-end max-w-[70%] rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm">Yes, still available.</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input placeholder="Type a message" />
              <Button>Send</Button>
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={cartOpen} onOpenChange={setCartOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span>Item</span><span>{selectedListing?.title}</span></div>
              <div className="flex items-center justify-between"><span>Price</span><span><Money value={selectedListing?.price || 0} /></span></div>
              <div className="flex items-center justify-between"><span>Delivery</span><span><Truck className="h-4 w-4 inline mr-1" /> Yalidine</span></div>
              <div className="flex items-center justify-between"><span>Total</span><span className="font-semibold"><Money value={(selectedListing?.price || 0) + 700} /></span></div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">Cash on Delivery</Button>
                <Button><CreditCard className="h-4 w-4 mr-2" /> BaridiMob</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-screen-md px-6 py-2 grid grid-cols-3 items-center">
          <Button variant="ghost" className="flex flex-col gap-0 h-auto py-1" onClick={() => setActive("marketplace")}>
            <Store className="h-5 w-5" />
            <span className="text-[11px]">Market</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-0 h-auto py-1" onClick={() => setActive("reservations")}>
            <CalendarDays className="h-5 w-5" />
            <span className="text-[11px]">Reserve</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="rounded-full h-12 w-12 justify-center mx-auto"><Plus className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <SheetHeader><SheetTitle>Sell or Book</SheetTitle></SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Card className="cursor-pointer">
                  <CardHeader><CardTitle className="text-base">Create listing</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">Add photos, price and details</CardContent>
                </Card>
                <Card className="cursor-pointer">
                  <CardHeader><CardTitle className="text-base">Book a service</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground">Choose provider and time</CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <a href="#profile" className="fixed right-3 bottom-20">
        <Button variant="secondary" className="gap-2"><Avatar className="h-5 w-5"><AvatarFallback>MY</AvatarFallback></Avatar> Profile</Button>
      </a>

      <section id="profile" className="mx-auto max-w-screen-md px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback>MY</AvatarFallback></Avatar>
              <div>
                <CardTitle className="text-xl">Mehalli Yacine</CardTitle>
                <CardDescription>Verified member</CardDescription>
              </div>
              <div className="flex-1" />
              <Badge className="gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Verified</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 text-sm">
            <Card className="col-span-3 sm:col-span-1">
              <CardHeader><CardTitle className="text-base">Badges</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant="outline">Trusted Seller</Badge>
                <Badge variant="outline">Super Host</Badge>
                <Badge variant="outline">Frequent Buyer</Badge>
              </CardContent>
            </Card>
            <Card className="col-span-3 sm:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Recent activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View all <ChevronRight className="h-3.5 w-3.5" /></Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>Booked Salon</div>
                  <div className="text-muted-foreground">Yesterday</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Sold Lamp</div>
                  <div className="text-muted-foreground">2d</div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}