import { FormEvent, ReactNode, useState } from "react";

type Page =
  | "Dashboard"
  | "Budgets"
  | "Transactions"
  | "Accounts"
  | "Recurring Bills"
  | "Savings Goals"
  | "Shared Finances"
  | "Financial Health"
  | "Net Worth"
  | "Credit Score"
  | "Investments"
  | "AI Assistant"
  | "Reports"
  | "Profile";
type ModalType = "transaction" | "budget" | "goal" | "bill" | "account" | "bank" | "account-detail" | "holding" | null;

type Transaction = {
  id: number;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  account: string;
  icon: string;
  status: TransactionStatus;
};
type TransactionStatus = "Pending" | "Posted" | "Failed" | "Cancelled";
type Budget = { id: number; category: string; limit: number; color: string };
type Account = { id: number; name: string; type: string; balance: number; digits: string; color: string };
type Bill = { id: number; name: string; amount: number; due: string; frequency: string; paused: boolean };
type Goal = { id: number; name: string; target: number; saved: number; date: string; color: string };
type Holding = { id: number; account: string; name: string; ticker: string; quantity: number; price: number; source: "Simulated" | "Manual" };
type InvestmentActivity = { id: number; date: string; action: string; holding: string; amount: number };
type InvitationStatus = "Pending" | "Accepted" | "Declined" | "Expired";
type SharedInvitation = { id: number; email: string; status: InvitationStatus; ownerAccepted: boolean; partnerAccepted: boolean; method: "Email" | "Link"; created: string };
type SharedExpense = { id: number; description: string; amount: number; category: string; paidBy: "Maya" | "Partner"; date: string; note: string };
type SharedBudget = { id: number; category: string; limit: number };
type SharedGoal = { id: number; name: string; target: number; maya: number; partner: number };
type SharedBill = { id: number; name: string; amount: number; due: string };
type EditableItem = Transaction | Budget | Account | Bill | Goal | Holding | null;
type ProfileData = { name: string; email: string; status: string; currency: string; period: string };
type NotificationType = "budget" | "bill" | "spending" | "balance" | "goal" | "insight";
type AppNotification = { id: string; type: NotificationType; title: string; copy: string; date: string; action: string; page: Page; itemId?: number };
type NotificationSettings = {
  budget: boolean; bills: boolean; spending: boolean; balance: boolean; goals: boolean; insights: boolean;
  inApp: boolean; push: boolean; email: boolean;
};
type IconName =
  | "grid" | "wallet" | "receipt" | "bank" | "repeat" | "target" | "spark"
  | "chart" | "user" | "search" | "plus" | "arrow" | "bell" | "chevron"
  | "more" | "calendar" | "download" | "edit" | "trash" | "pause" | "send"
  | "check" | "shield" | "menu" | "close" | "card" | "trend";

const nav: { label: Page; icon: IconName }[] = [
  { label: "Dashboard", icon: "grid" },
  { label: "Budgets", icon: "wallet" },
  { label: "Transactions", icon: "receipt" },
  { label: "Accounts", icon: "bank" },
  { label: "Recurring Bills", icon: "repeat" },
  { label: "Savings Goals", icon: "target" },
  { label: "Shared Finances", icon: "user" },
  { label: "Financial Health", icon: "shield" },
  { label: "Net Worth", icon: "trend" },
  { label: "Credit Score", icon: "card" },
  { label: "Investments", icon: "chart" },
  { label: "AI Assistant", icon: "spark" },
  { label: "Reports", icon: "chart" },
  { label: "Profile", icon: "user" },
];

const categories = [
  "Rent", "Groceries", "Transportation", "Tuition", "Utilities",
  "Subscriptions", "Entertainment", "Dining", "Shopping", "Savings",
];
const categoryColors: Record<string, string> = {
  Rent: "#7c5cff", Groceries: "#b8f05a", Transportation: "#ff7a66", Tuition: "#68c8ff",
  Utilities: "#ffc857", Subscriptions: "#a78bfa", Entertainment: "#f472b6",
  Dining: "#fb923c", Shopping: "#2dd4bf", Savings: "#86efac", Income: "#b8f05a",
};

const initialTransactions: Transaction[] = [
  { id: 8, merchant: "Campus Dining Hall", date: "Mar 18", amount: -112, category: "Dining", account: "Everyday Checking", icon: "CD", status: "Pending" },
  { id: 1, merchant: "Campus Bookstore", date: "Mar 18", amount: -48.9, category: "Tuition", account: "Everyday Checking", icon: "CB", status: "Pending" },
  { id: 2, merchant: "Whole Foods Market", date: "Mar 17", amount: -67.42, category: "Groceries", account: "Everyday Checking", icon: "WF", status: "Posted" },
  { id: 3, merchant: "Design Lab Pay", date: "Mar 15", amount: 620, category: "Income", account: "Everyday Checking", icon: "DL", status: "Posted" },
  { id: 4, merchant: "Metro Transit", date: "Mar 14", amount: -22.5, category: "Transportation", account: "Student Credit", icon: "MT", status: "Posted" },
  { id: 5, merchant: "Momo Ramen", date: "Mar 13", amount: -18.75, category: "Dining", account: "Everyday Checking", icon: "MR", status: "Posted" },
  { id: 6, merchant: "Figma", date: "Mar 12", amount: -15, category: "Subscriptions", account: "Student Credit", icon: "FI", status: "Cancelled" },
  { id: 7, merchant: "Target", date: "Mar 10", amount: -36.18, category: "Shopping", account: "Student Credit", icon: "TG", status: "Posted" },
];
const initialBudgets: Budget[] = [
  { id: 1, category: "Groceries", limit: 280, color: "#b8f05a" },
  { id: 2, category: "Dining", limit: 160, color: "#ff7a66" },
  { id: 3, category: "Transportation", limit: 90, color: "#68c8ff" },
  { id: 4, category: "Entertainment", limit: 120, color: "#f472b6" },
  { id: 5, category: "Shopping", limit: 140, color: "#2dd4bf" },
  { id: 6, category: "Subscriptions", limit: 65, color: "#a78bfa" },
];
const initialAccounts: Account[] = [
  { id: 1, name: "Everyday Checking", type: "Checking", balance: 2146.82, digits: "4821", color: "lime" },
  { id: 2, name: "Build-It Savings", type: "Savings", balance: 3850, digits: "1104", color: "purple" },
  { id: 3, name: "Student Credit", type: "Credit card", balance: -384.19, digits: "9912", color: "coral" },
];
const initialBills: Bill[] = [
  { id: 1, name: "Apartment Rent", amount: 780, due: "Apr 1", frequency: "Monthly", paused: false },
  { id: 2, name: "Spotify Student", amount: 5.99, due: "Mar 24", frequency: "Monthly", paused: false },
  { id: 3, name: "Adobe Creative Cloud", amount: 19.99, due: "Mar 27", frequency: "Monthly", paused: false },
  { id: 4, name: "iCloud+", amount: 2.99, due: "Mar 29", frequency: "Monthly", paused: false },
  { id: 5, name: "Gym membership", amount: 28, due: "Apr 3", frequency: "Monthly", paused: true },
];
const initialGoals: Goal[] = [
  { id: 1, name: "Summer in Lisbon", target: 2200, saved: 1240, date: "Jun 15, 2025", color: "purple" },
  { id: 2, name: "Emergency cushion", target: 3000, saved: 1850, date: "Dec 31, 2025", color: "lime" },
  { id: 3, name: "New MacBook", target: 1600, saved: 420, date: "Aug 20, 2025", color: "coral" },
];
const initialHoldings: Holding[] = [
  { id: 1, account: "Campus Roth IRA", name: "US Total Market ETF", ticker: "VTI", quantity: 4.2, price: 276.4, source: "Simulated" },
  { id: 2, account: "Campus Roth IRA", name: "International Stock ETF", ticker: "VXUS", quantity: 3.5, price: 61.82, source: "Simulated" },
  { id: 3, account: "Learning Portfolio", name: "Treasury Bond ETF", ticker: "VGSH", quantity: 5, price: 58.74, source: "Manual" },
];
const initialInvestmentActivity: InvestmentActivity[] = [
  { id: 1, date: "Mar 12", action: "Bought", holding: "US Total Market ETF", amount: 276.4 },
  { id: 2, date: "Feb 28", action: "Dividend", holding: "US Total Market ETF", amount: 4.82 },
  { id: 3, date: "Feb 15", action: "Bought", holding: "Treasury Bond ETF", amount: 293.7 },
];
const initialSharedExpenses: SharedExpense[] = [
  { id: 1, description: "March apartment rent", amount: 780, category: "Rent", paidBy: "Maya", date: "Mar 1", note: "Maya paid landlord; settle by Friday." },
  { id: 2, description: "Weekly groceries", amount: 96.4, category: "Groceries", paidBy: "Partner", date: "Mar 16", note: "Meal prep and household basics." },
  { id: 3, description: "Electric bill", amount: 54.2, category: "Utilities", paidBy: "Partner", date: "Mar 10", note: "Lower than last month." },
];
const initialSharedBudgets: SharedBudget[] = [
  { id: 1, category: "Rent", limit: 780 },
  { id: 2, category: "Groceries", limit: 320 },
  { id: 3, category: "Utilities", limit: 120 },
  { id: 4, category: "Transportation", limit: 100 },
  { id: 5, category: "Entertainment", limit: 140 },
];
const initialSharedGoals: SharedGoal[] = [
  { id: 1, name: "Summer road trip", target: 1800, maya: 460, partner: 390 },
  { id: 2, name: "Apartment deposit", target: 2400, maya: 700, partner: 625 },
];
const initialSharedBills: SharedBill[] = [
  { id: 1, name: "Apartment rent", amount: 780, due: "Apr 1" },
  { id: 2, name: "Internet", amount: 45, due: "Mar 28" },
  { id: 3, name: "Electric estimate", amount: 58, due: "Apr 4" },
];

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    wallet: <><path d="M4 7V5a2 2 0 0 1 2-2h12"/><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M16 12h5v5h-5a2.5 2.5 0 0 1 0-5Z"/></>,
    receipt: <><path d="M6 3h12v19l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></>,
    bank: <><path d="m3 10 9-6 9 6"/><path d="M5 10h14M6 10v8M10 10v8M14 10v8M18 10v8M3 20h18"/></>,
    repeat: <><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    spark: <><path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM5 3l.7 2.3L8 6l-2.3.7L5 9l-.7-2.3L2 6l2.3-.7L5 3Z"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/></>,
    edit: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/><path d="m14 7 3 3"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
    pause: <><path d="M9 5v14M15 5v14"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="M6 6l12 12M18 6 6 18"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h3"/></>,
    trend: <><path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ children, variant = "primary", icon, onClick, type = "button", disabled = false }: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName;
  onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return <button className={`btn btn-${variant}`} onClick={onClick} type={type} disabled={disabled}>{icon && <Icon name={icon} size={17}/>}<span>{children}</span></button>;
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

function money(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits }).format(value);
}

function initials(name:string) {
  const parts=name.trim().split(/\s+/).filter(Boolean);
  return (parts.length>1?`${parts[0][0]}${parts[parts.length-1][0]}`:parts[0]?.slice(0,2)||"CC").toUpperCase();
}

function LoginPage({onLogin}:{onLogin:(name:string,email:string)=>void}) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState("");
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if(name.trim().length<2){setError("Enter the name you want shown across your profile.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("Enter a valid email address.");return;}
    if(password.length<6){setError("Use at least 6 characters for this simulated login.");return;}
    setError("");onLogin(name.trim(),email.trim());
  };
  return <main className="login-page">
    <section className="login-story">
      <div className="login-brand"><div className="brand-mark"><span></span><span></span></div><strong>Current</strong><em>Campus</em></div>
      <div className="login-story-copy"><span>STUDENT MONEY, MADE CLEARER</span><h1>Build confidence with every dollar.</h1><p>Budgets, shared expenses, savings goals, financial health, and Nova guidance—all in one calm place.</p><div className="login-benefits"><div><i><Icon name="shield"/></i><span><strong>Private prototype</strong><small>No real banking credentials are requested.</small></span></div><div><i><Icon name="spark"/></i><span><strong>Judgment-free guidance</strong><small>Practical tools built for student life.</small></span></div><div><i><Icon name="trend"/></i><span><strong>Your complete picture</strong><small>Track progress without losing the details.</small></span></div></div></div>
      <div className="login-quote"><Icon name="spark" size={17}/><p>“Small money decisions become much easier when the full picture feels understandable.”</p></div>
    </section>
    <section className="login-form-side">
      <form className="login-card" onSubmit={submit}>
        <div className="login-mobile-brand"><div className="brand-mark"><span></span><span></span></div><strong>Current <em>Campus</em></strong></div>
        <span className="eyebrow">WELCOME TO CURRENT CAMPUS</span><h2>Log in to your money space</h2><p>Enter your details to open the dashboard. Your name and email will appear in your profile for this session.</p>
        <label>Full name<div className="login-input"><Icon name="user" size={17}/><input value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Maya Allen" autoComplete="name" autoFocus/></div></label>
        <label>Email address<div className="login-input"><Icon name="send" size={17}/><input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@university.edu" autoComplete="email"/></div></label>
        <label>Password<div className="login-input"><Icon name="shield" size={17}/><input type={showPassword?"text":"password"} value={password} onChange={event=>setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete="current-password"/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div></label>
        {error&&<div className="login-error" role="alert">{error}</div>}
        <Button type="submit" icon="arrow">Log in and open dashboard</Button>
        <div className="login-demo-note"><Icon name="shield" size={16}/><span>Prototype login only. No account is created, no password is stored, and authentication is not connected to a server.</span></div>
      </form>
    </section>
  </main>;
}

function App() {
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [page, setPage] = useState<Page>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen,setProfileMenuOpen]=useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [bills, setBills] = useState(initialBills);
  const [goals, setGoals] = useState(initialGoals);
  const [holdings, setHoldings] = useState(initialHoldings);
  const [investmentActivity, setInvestmentActivity] = useState(initialInvestmentActivity);
  const [sharedInvitation, setSharedInvitation] = useState<SharedInvitation | null>(null);
  const [sharedExpenses, setSharedExpenses] = useState(initialSharedExpenses);
  const [sharedBudgets, setSharedBudgets] = useState(initialSharedBudgets);
  const [sharedGoals, setSharedGoals] = useState(initialSharedGoals);
  const [sharedBills, setSharedBills] = useState(initialSharedBills);
  const [sharedAccountIds, setSharedAccountIds] = useState<number[]>([]);
  const [sharedTransactionIds, setSharedTransactionIds] = useState<number[]>([]);
  const [contributionMode, setContributionMode] = useState<"Equal" | "Custom">("Equal");
  const [mayaContributionPct, setMayaContributionPct] = useState(50);
  const [sharedAccess, setSharedAccess] = useState<"Can edit" | "View only">("Can edit");
  const [creditScore, setCreditScore] = useState(712);
  const [creditUpdated, setCreditUpdated] = useState("March 18, 2025");
  const [modal, setModal] = useState<ModalType>(null);
  const [editing, setEditing] = useState<EditableItem>(null);
  const [confirmation, setConfirmation] = useState<{title:string;copy:string;action:()=>void} | null>(null);
  const [profile, setProfile] = useState<ProfileData>({name:"Maya Allen",email:"maya.allen@university.edu",status:"Full-time student",currency:"USD — US Dollar",period:"Monthly"});
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({budget:true,bills:true,spending:true,balance:true,goals:true,insights:true,inApp:true,push:false,email:false});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<string>(() => typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (next: Page) => {
    setPage(next);
    setMobileOpen(false);
    setProfileMenuOpen(false);
    setNotificationOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const postedSpending = transactions.filter(t => t.status === "Posted" && t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const pendingNet = transactions.filter(t => t.status === "Pending").reduce((sum, t) => sum + t.amount, 0);
  const pendingSpending = transactions.filter(t => t.status === "Pending" && t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const projectedBalance = totalBalance + pendingNet;
  const unpostedRent = bills.find(bill => !bill.paused && bill.name.toLowerCase().includes("rent"))?.amount || 0;
  const monthSpent = postedSpending + pendingSpending + unpostedRent;
  const activeBills = bills.filter(bill => !bill.paused);
  const upcomingTotal = activeBills.reduce((sum, bill) => sum + bill.amount, 0);
  const primaryChecking = accounts.find(account => account.type === "Checking");
  const checkingPending = transactions.filter(transaction => transaction.account === primaryChecking?.name && transaction.status === "Pending").reduce((sum,transaction)=>sum+transaction.amount,0);
  const projectedCheckingAfterBills = (primaryChecking?.balance || 0) + checkingPending - upcomingTotal;
  const topBudget = budgets.map(budget => ({...budget, spent: categorySpend(transactions, budget.category)})).sort((a,b) => b.spent / b.limit - a.spent / a.limit)[0];
  const largestExpense = transactions.filter(transaction => transaction.amount < 0 && ["Posted","Pending"].includes(transaction.status)).sort((a,b) => Math.abs(b.amount)-Math.abs(a.amount))[0];
  const topGoal = goals.map(goal => ({...goal,pct:goal.target ? goal.saved/goal.target : 0})).sort((a,b)=>b.pct-a.pct)[0];
  const notificationCandidates: AppNotification[] = [
    ...(topBudget && topBudget.spent / topBudget.limit >= .75 ? [{id:`budget-${topBudget.id}`,type:"budget" as const,title:`${topBudget.category} budget is ${Math.round(topBudget.spent/topBudget.limit*100)}% used`,copy:`${money(topBudget.spent,0)} of ${money(topBudget.limit,0)} is committed, including pending transactions.`,date:"Today",action:"Review budget",page:"Budgets" as Page}] : []),
    ...(activeBills[0] ? [{id:`bill-${activeBills[0].id}`,type:"bill" as const,title:`${activeBills[0].name} is coming up`,copy:`A ${money(activeBills[0].amount)} ${activeBills[0].frequency.toLowerCase()} payment is due ${activeBills[0].due}.`,date:"Today",action:"Open payment",page:"Recurring Bills" as Page,itemId:activeBills[0].id}] : []),
    ...(largestExpense && Math.abs(largestExpense.amount) >= 60 ? [{id:`spending-${largestExpense.id}`,type:"spending" as const,title:"A purchase is higher than your usual activity",copy:`${largestExpense.merchant} is ${money(Math.abs(largestExpense.amount))} and is currently ${largestExpense.status.toLowerCase()}.`,date:largestExpense.date,action:"Review transaction",page:"Transactions" as Page,itemId:largestExpense.id}] : []),
    ...(primaryChecking && projectedCheckingAfterBills < 1500 ? [{id:"balance-projection",type:"balance" as const,title:"Upcoming payments may tighten checking",copy:`After pending activity and active bills, ${primaryChecking.name} is projected at ${money(projectedCheckingAfterBills)}.`,date:"Today",action:"View accounts",page:"Accounts" as Page}] : []),
    ...(topGoal && topGoal.pct >= .5 ? [{id:`goal-${topGoal.id}`,type:"goal" as const,title:`${topGoal.name} passed a milestone`,copy:`You have saved ${Math.round(topGoal.pct*100)}% of this goal. Keep the momentum going.`,date:"Yesterday",action:"View goal",page:"Savings Goals" as Page,itemId:topGoal.id}] : []),
    {id:"insight-weekly",type:"insight",title:"Nova found a helpful next step",copy:"Your pending spending is already reflected in budget progress, so you can plan before charges settle.",date:"Today",action:"Ask Nova",page:"AI Assistant"},
  ];
  const settingForType: Record<NotificationType,keyof NotificationSettings> = {budget:"budget",bill:"bills",spending:"spending",balance:"balance",goal:"goals",insight:"insights"};
  const notifications = notificationSettings.inApp ? notificationCandidates.filter(item => notificationSettings[settingForType[item.type]]) : [];
  const unreadCount = notifications.filter(item => !readNotifications.includes(item.id)).length;
  const requestBrowserNotifications = async () => {
    if (typeof Notification === "undefined") { setNotificationPermission("unsupported"); notify("Browser notifications are not supported here. In-app examples still work."); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setNotificationSettings(current => ({...current,push:permission === "granted"}));
    notify(permission === "granted" ? "Browser permission granted. Delivery remains simulated in this prototype." : "Browser notification permission was not granted.");
  };
  const openModal = (type: ModalType, item: EditableItem = null) => { setEditing(item); setModal(type); };
  const confirmAction = (title:string,copy:string,action:()=>void) => setConfirmation({title,copy,action});
  const resetDemo = () => {
    setTransactions([]); setBudgets([]); setAccounts([]); setBills([]); setGoals([]); setHoldings([]); setInvestmentActivity([]); setSharedInvitation(null); setSharedExpenses([]); setSharedBudgets([]); setSharedGoals([]); setSharedBills([]); setSharedAccountIds([]); setSharedTransactionIds([]);
    setConfirmation(null); navigate("Dashboard"); notify("Demo data cleared. Empty states are now visible.");
  };
  const logout=()=>{
    setProfileMenuOpen(false);setNotificationOpen(false);setMobileOpen(false);setModal(null);setEditing(null);setConfirmation(null);setPage("Dashboard");setIsAuthenticated(false);
  };

  const shared = { transactions, setTransactions, budgets, setBudgets, accounts, setAccounts, bills, setBills, goals, setGoals, holdings, setHoldings, investmentActivity, setInvestmentActivity, sharedInvitation, setSharedInvitation, sharedExpenses, setSharedExpenses, sharedBudgets, setSharedBudgets, sharedGoals, setSharedGoals, sharedBills, setSharedBills, sharedAccountIds, setSharedAccountIds, sharedTransactionIds, setSharedTransactionIds, contributionMode, setContributionMode, mayaContributionPct, setMayaContributionPct, sharedAccess, setSharedAccess, creditScore, setCreditScore, creditUpdated, setCreditUpdated, modal, setModal, editing, setEditing, openModal, confirmAction, notify, navigate, totalBalance, projectedBalance, pendingNet, monthSpent, profile, setProfile };

  if(!isAuthenticated)return <LoginPage onLogin={(name,email)=>{setProfile(current=>({...current,name,email}));setPage("Dashboard");setIsAuthenticated(true);}}/>;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><span></span><span></span></div><strong>Current</strong><em>Campus</em></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><Icon name="close"/></button>
        <nav className="side-nav">
          <p className="nav-label">YOUR MONEY</p>
          {nav.map((item, index) => <div className={index === 7 ? "nav-group-start" : ""} key={item.label}>{index === 7 && <p className="nav-label">FINANCIAL HEALTH</p>}<button className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><Icon name={item.icon}/><span>{item.label}</span>{item.label === "AI Assistant" && <b>AI</b>}</button></div>)}
        </nav>
        <div className="sidebar-card">
          <div className="mini-orb"><Icon name="spark" size={16}/></div>
          <strong>Money feeling messy?</strong>
          <p>Ask me anything. Zero judgment, always.</p>
          <button onClick={() => navigate("AI Assistant")}>Chat with Nova <Icon name="arrow" size={15}/></button>
        </div>
        <div className="sidebar-profile">
          <div className="avatar">{initials(profile.name)}</div><div><strong>{profile.name}</strong><span>{profile.email}</span></div>
          <button onClick={() => navigate("Profile")} aria-label="Open profile settings"><Icon name="more"/></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Icon name="menu"/></button>
          <div className="mobile-brand">Current <span>Campus</span></div>
          <button className="search-trigger" onClick={() => navigate("Transactions")}><Icon name="search"/><span>Search anything...</span><kbd>⌘ K</kbd></button>
          <div className="top-actions"><button className="icon-btn notification-trigger" onClick={() => setNotificationOpen(true)} aria-label={`Open notifications, ${unreadCount} unread`}><Icon name="bell"/>{unreadCount>0&&<i>{unreadCount}</i>}</button><button className="avatar small avatar-button" onClick={()=>setProfileMenuOpen(!profileMenuOpen)} aria-label="Open profile menu" aria-expanded={profileMenuOpen}>{initials(profile.name)}</button>{profileMenuOpen&&<div className="profile-menu"><div><span className="avatar small">{initials(profile.name)}</span><span><strong>{profile.name}</strong><small>{profile.email}</small></span></div><button onClick={()=>navigate("Profile")}><Icon name="user" size={16}/><span><strong>Profile & settings</strong><small>Manage your personal details</small></span><Icon name="chevron" size={14}/></button><button className="logout-action" onClick={logout}><Icon name="arrow" size={16}/><span><strong>Log out</strong><small>Return to the login page</small></span></button></div>}</div>
        </header>

        <div className="page">
          {page === "Dashboard" && <Dashboard {...shared}/>}
          {page === "Budgets" && <Budgets {...shared}/>}
          {page === "Transactions" && <Transactions {...shared}/>}
          {page === "Accounts" && <Accounts {...shared}/>}
          {page === "Recurring Bills" && <Recurring {...shared}/>}
          {page === "Savings Goals" && <Savings {...shared}/>}
          {page === "Shared Finances" && <SharedFinances {...shared}/>}
          {page === "Financial Health" && <FinancialHealth {...shared}/>}
          {page === "Net Worth" && <NetWorth {...shared}/>}
          {page === "Credit Score" && <CreditScore {...shared}/>}
          {page === "Investments" && <Investments {...shared}/>}
          {page === "AI Assistant" && <Assistant {...shared}/>}
          {page === "Reports" && <Reports {...shared}/>}
          {page === "Profile" && <Profile {...shared} profile={profile} setProfile={setProfile} settings={notificationSettings} setSettings={setNotificationSettings} resetDemo={resetDemo} openNotifications={()=>setNotificationOpen(true)} notificationPermission={notificationPermission} requestBrowserNotifications={requestBrowserNotifications}/>}
        </div>
      </main>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay"></button>}
      {notificationOpen && <NotificationCenter notifications={notifications} read={readNotifications} close={()=>setNotificationOpen(false)} markRead={(id:string)=>setReadNotifications(current=>current.includes(id)?current:[...current,id])} markAll={()=>setReadNotifications(current=>Array.from(new Set([...current,...notifications.map(item=>item.id)])))} navigate={navigate} openModal={openModal} bills={bills} inAppEnabled={notificationSettings.inApp}/>}
      {modal && <FormModal type={modal} close={() => {setModal(null);setEditing(null)}} {...shared}/>}
      {confirmation && <ConfirmDialog title={confirmation.title} copy={confirmation.copy} cancel={()=>setConfirmation(null)} confirm={()=>{confirmation.action();setConfirmation(null)}}/>}
      {toast && <div className="toast"><Icon name="check" size={18}/>{toast}</div>}
    </div>
  );
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{action}</div>;
}

function NotificationCenter({notifications,read,close,markRead,markAll,navigate,openModal,bills,inAppEnabled}:{
  notifications:AppNotification[];read:string[];close:()=>void;markRead:(id:string)=>void;markAll:()=>void;navigate:(page:Page)=>void;openModal:(type:ModalType,item?:EditableItem)=>void;bills:Bill[];inAppEnabled:boolean;
}) {
  const [filter,setFilter]=useState("All");
  const filtered=notifications.filter(item=>(filter==="All"||filter==="Unread"&&!read.includes(item.id)||item.type===filter));
  const activate=(item:AppNotification)=>{
    markRead(item.id);
    if(item.type==="bill"&&item.itemId){
      const bill=bills.find(entry=>entry.id===item.itemId);
      if(bill){close();openModal("bill",bill);return;}
    }
    navigate(item.page);
  };
  const icons:Record<NotificationType,IconName>={budget:"wallet",bill:"calendar",spending:"receipt",balance:"bank",goal:"target",insight:"spark"};
  return <div className="notification-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}>
    <aside className="notification-center" role="dialog" aria-modal="true" aria-labelledby="notification-title">
      <div className="notification-head"><div><span>YOUR MONEY UPDATES</span><h2 id="notification-title">Notifications</h2></div><button onClick={close} aria-label="Close notifications"><Icon name="close"/></button></div>
      <div className="notification-tools"><div className="notification-filters">{["All","Unread","budget","bill","spending","balance","goal","insight"].map(option=><button key={option} className={filter===option?"active":""} onClick={()=>setFilter(option)}>{option==="bill"?"Bills":option==="budget"?"Budgets":option==="goal"?"Goals":option==="spending"?"Spending":option==="balance"?"Balances":option==="insight"?"Insights":option}</button>)}</div><button className="mark-all" onClick={markAll} disabled={!notifications.some(item=>!read.includes(item.id))}>Mark all as read</button></div>
      <div className="notification-list">
        {!inAppEnabled?<EmptyCompact icon="bell" title="In-app notifications are off" copy="Turn them on in Profile settings to see connected money updates." action={<Button variant="secondary" onClick={()=>navigate("Profile")}>Open settings</Button>}/>:filtered.length?filtered.map(item=><article className={`notification-item ${read.includes(item.id)?"read":""}`} key={item.id}>
          <button className="notification-main" onClick={()=>activate(item)}>
            <span className={`notification-type ${item.type}`}><Icon name={icons[item.type]} size={17}/></span>
            <span><small>{item.date} · {item.type === "insight" ? "Optional AI insight" : item.type}</small><strong>{item.title}</strong><p>{item.copy}</p><b>{item.action} <Icon name="arrow" size={14}/></b></span>
            {!read.includes(item.id)&&<i aria-label="Unread"></i>}
          </button>
          {!read.includes(item.id)&&<button className="read-action" onClick={()=>markRead(item.id)}>Mark as read</button>}
        </article>):<EmptyCompact icon="check" title="Nothing in this view" copy={filter==="Unread"?"You have read every notification.":"Try another notification filter."}/>}
      </div>
      <div className="notification-footer"><Icon name="shield" size={16}/><span>Prototype notifications are generated from this session. No email or phone push is sent.</span><button onClick={()=>navigate("Profile")}>Preferences</button></div>
    </aside>
  </div>;
}

function Dashboard(props: any) {
  const upcomingTotal = props.bills.filter((bill:Bill)=>!bill.paused).reduce((sum:number,bill:Bill)=>sum+bill.amount,0);
  const available = Math.max(0, props.projectedBalance - upcomingTotal);
  const budgetTotal = props.budgets.reduce((sum:number,budget:Budget)=>sum+budget.limit,0);
  const budgetSpent = props.budgets.reduce((sum:number,budget:Budget)=>sum+categorySpend(props.transactions,budget.category),0);
  const savedTotal = props.goals.reduce((sum:number,goal:Goal)=>sum+goal.saved,0);
  return <>
    <PageIntro eyebrow="TUESDAY, MARCH 18" title={`Hey ${props.profile.name}, you’re doing great.`} copy="Here’s the big picture on your money this month." action={<Button icon="plus" onClick={() => props.setModal("transaction")}>Add transaction</Button>}/>
    <div className="hero-balance">
      <div className="hero-copy">
        <span>Posted balance across accounts</span><strong>{money(props.totalBalance)}</strong>
        <div className="balance-change"><Icon name="trend" size={16}/> {money(props.projectedBalance)} projected with pending</div>
      </div>
      <div className="forecast-card">
        <div><span>Projected safe to spend</span><strong>{money(available)}</strong><small>pending activity + upcoming bills counted once</small></div>
        <div className="forecast-chart">
          <svg viewBox="0 0 260 70" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8f05a" stopOpacity=".3"/><stop offset="1" stopColor="#b8f05a" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 48 C35 43 42 25 75 33 S115 54 145 34 S190 18 220 28 S245 16 260 9 L260 70 L0 70Z"/><path className="line" d="M0 48 C35 43 42 25 75 33 S115 54 145 34 S190 18 220 28 S245 16 260 9"/></svg>
          <div className="forecast-labels"><span>Today</span><span>Apr 1</span></div>
        </div>
      </div>
    </div>
    <div className="stat-grid">
      <Stat label="Monthly income" value="$2,420" note="+8% vs last month" icon="trend" tone="lime"/>
      <Stat label="Committed spending" value={money(props.monthSpent, 0)} note="Posted + pending, plus upcoming rent" icon="receipt" tone="coral"/>
      <Stat label="Goal savings" value={money(savedTotal,0)} note={`Across ${props.goals.length} active goals`} icon="target" tone="purple"/>
      <Stat label="Financial health" value="Looking good" note="Score 78 / 100" icon="spark" tone="blue"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel budget-overview">
        <SectionTitle title="Monthly budget" subtitle="Includes posted and pending transactions" action={<button className="text-link" onClick={() => props.navigate("Budgets")}>View budget <Icon name="arrow" size={15}/></button>}/>
        <div className="budget-summary"><div><strong>{money(budgetSpent, 0)}</strong><span>committed of {money(budgetTotal,0)}</span></div><b>{budgetTotal?Math.round(budgetSpent / budgetTotal*100):0}%</b></div>
        <div className="progress large"><i style={{ width: `${budgetTotal?Math.min(budgetSpent / budgetTotal*100, 100):0}%` }}></i></div>
        <div className="budget-categories">
          {props.budgets.slice(0, 4).map((b: Budget) => {
            const spent = categorySpend(props.transactions, b.category);
            return <div key={b.id}><span className="category-dot" style={{ background: b.color }}></span><strong>{b.category}</strong><div className="mini-progress"><i style={{ width: `${Math.min(spent / b.limit * 100, 100)}%`, background: b.color }}></i></div><span>{money(spent, 0)} / {money(b.limit, 0)}</span></div>;
          })}
        </div>
      </section>
      <section className="panel insight-panel">
        <div className="insight-head"><div className="nova"><Icon name="spark"/></div><div><span>NOVA’S INSIGHT</span><strong>A small swap = big spring break energy</strong></div></div>
        <p>You spent <b>$74 less on dining</b> than last month. Keep that rhythm and you’ll reach your Lisbon goal 3 weeks early.</p>
        <button onClick={() => props.navigate("AI Assistant")}>Build me a savings plan <Icon name="arrow" size={16}/></button>
      </section>
      <section className="panel transactions-panel">
        <SectionTitle title="Recent activity" subtitle="Your latest transactions" action={<button className="text-link" onClick={() => props.navigate("Transactions")}>See all <Icon name="arrow" size={15}/></button>}/>
        <TransactionList transactions={props.transactions.slice(0, 5)}/>
      </section>
      <section className="panel goals-panel">
        <SectionTitle title="Your goals" subtitle="Small steps, real progress" action={<button className="text-link" onClick={() => props.navigate("Savings Goals")}>All goals <Icon name="arrow" size={15}/></button>}/>
        {props.goals.length ? props.goals.slice(0, 2).map((goal: Goal) => <GoalMini key={goal.id} goal={goal}/>) : <EmptyCompact icon="target" title="No savings goals yet" copy="Create one to start tracking progress."/>}
        <Button variant="secondary" icon="plus" onClick={() => props.setModal("goal")}>Create a new goal</Button>
      </section>
      <section className="panel upcoming-panel">
        <SectionTitle title="Coming up" subtitle="Next 14 days" action={<button className="text-link" onClick={() => props.navigate("Recurring Bills")}>View calendar <Icon name="arrow" size={15}/></button>}/>
        {props.bills.filter((b: Bill) => !b.paused).length ? props.bills.filter((b: Bill) => !b.paused).slice(0, 3).map((bill: Bill, i: number) => <div className="upcoming-row" key={bill.id}><div className="date-tile"><span>{bill.due.split(" ")[0]}</span><b>{bill.due.split(" ")[1]}</b></div><div><strong>{bill.name}</strong><span>Autopay · {bill.frequency}</span></div><strong>-{money(bill.amount)}</strong><small>Projected after: {money(props.projectedBalance-props.bills.filter((b:Bill)=>!b.paused).slice(0,i+1).reduce((sum:number,b:Bill)=>sum+b.amount,0),0)}</small></div>) : <EmptyCompact icon="calendar" title="Nothing coming up" copy="Add a recurring payment to see a forecast."/>}
      </section>
    </div>
    <section className="quick-actions"><SectionTitle title="What do you want to do?" subtitle="Quick actions"/><div>
      <button onClick={() => props.setModal("transaction")}><i><Icon name="plus"/></i><span><strong>Add a transaction</strong><small>Log cash or other spending</small></span><Icon name="chevron"/></button>
      <button onClick={() => props.setModal("budget")}><i><Icon name="wallet"/></i><span><strong>Create a budget</strong><small>Give every dollar a job</small></span><Icon name="chevron"/></button>
      <button onClick={() => props.setModal("goal")}><i><Icon name="target"/></i><span><strong>Set a savings goal</strong><small>Make future-you proud</small></span><Icon name="chevron"/></button>
      <button onClick={() => props.navigate("AI Assistant")}><i><Icon name="spark"/></i><span><strong>Ask Nova</strong><small>Get a personalized plan</small></span><Icon name="chevron"/></button>
    </div></section>
  </>;
}

function Stat({ label, value, note, icon, tone }: { label: string; value: string; note: string; icon: IconName; tone: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={icon}/></div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function categorySpend(transactions: Transaction[], category: string) {
  return transactions.filter(t => t.category === category && t.amount < 0 && ["Posted","Pending"].includes(t.status)).reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function TransactionList({ transactions, controls }: { transactions: Transaction[]; controls?: (t: Transaction) => ReactNode }) {
  if (!transactions.length) return <EmptyCompact icon="receipt" title="No transactions yet" copy="New activity will appear here." />;
  return <div className="transaction-list">{transactions.map(t => <div className={`transaction-row status-${t.status.toLowerCase()}`} key={t.id}>
    <div className="merchant-icon">{t.icon}</div><div className="merchant"><strong>{t.merchant}</strong><span>{t.date} · {t.account}</span></div>
    <span className="category-pill"><i style={{ background: categoryColors[t.category] || "#8b91a1" }}></i>{t.category}</span>
    <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span><strong className={t.amount > 0 ? "positive" : ""}>{t.amount > 0 ? "+" : ""}{money(t.amount)}</strong>{controls?.(t)}
  </div>)}</div>;
}

function EmptyCompact({icon,title,copy,action}:{icon:IconName;title:string;copy:string;action?:ReactNode}) {
  return <div className="empty-compact"><Icon name={icon} size={22}/><div><strong>{title}</strong><span>{copy}</span></div>{action}</div>;
}

function GoalMini({ goal }: { goal: Goal }) {
  const pct = Math.round(goal.saved / goal.target * 100);
  return <div className="goal-mini"><div className={`goal-icon ${goal.color}`}><Icon name="target"/></div><div><div><strong>{goal.name}</strong><span>{pct}%</span></div><div className="progress"><i style={{ width: `${pct}%` }}></i></div><small>{money(goal.saved, 0)} of {money(goal.target, 0)}</small></div></div>;
}

function Budgets(props: any) {
  const [period, setPeriod] = useState("Monthly");
  const factor=period==="Daily"?1/30:period==="Weekly"?7/30:1;
  const total = props.budgets.reduce((s: number, b: Budget) => s + b.limit, 0)*factor;
  const spent = props.budgets.reduce((s: number, b: Budget) => s + categorySpend(props.transactions, b.category), 0)*factor;
  return <>
    <PageIntro eyebrow="PLAN WITH PURPOSE" title="Your budget, your rules." copy="Build a plan that fits real student life—not the other way around." action={<Button icon="plus" onClick={() => props.setModal("budget")}>Create budget</Button>}/>
    <div className="toolbar"><div className="segmented">{["Daily", "Weekly", "Monthly"].map(p => <button className={period === p ? "active" : ""} onClick={() => setPeriod(p)} key={p}>{p}</button>)}</div><button className="month-picker" onClick={()=>props.notify("This prototype currently includes March 2025 demo data.")}><Icon name="calendar"/> March 2025 <Icon name="chevron"/></button></div>
    <div className="budget-hero panel">
      <div><span>Total {period.toLowerCase()} plan</span><strong>{money(total, 0)}</strong><p><b>{money(total - spent, 0)}</b> left to spend</p></div>
      <div className="ring" style={{ "--pct": `${total?Math.min(spent / total * 360, 360):0}deg` } as React.CSSProperties}><div><strong>{total?Math.round(spent / total * 100):0}%</strong><span>used</span></div></div>
      <div className="budget-breakdown"><div><span>Spent</span><strong>{money(spent)}</strong></div><div><span>Remaining</span><strong>{money(total - spent)}</strong></div><div><span>Per-day allowance</span><strong>{money(Math.max(0,(total - spent) / (period==="Daily"?1:period==="Weekly"?7:13)))}</strong></div></div>
    </div>
    <div className="alert-card"><Icon name="spark"/><div><strong>{props.budgets.length?"Pending spending is included once":"Start with one realistic category"}</strong><span>{props.budgets.length?`Budget progress includes posted and pending transactions, but excludes failed or cancelled activity. The ${period.toLowerCase()} view scales that same rule.`:"Create a category budget and Nova can help you tune it."}</span></div><button onClick={() => props.navigate("AI Assistant")}>Get suggestions</button></div>
    <section className="budget-list-section">
      <SectionTitle title="Category budgets" subtitle={`${props.budgets.length} active budgets · ${period} view`} action={<button className="text-link" onClick={() => props.setModal("budget")}><Icon name="plus"/> Add category</button>}/>
      {props.budgets.length ? <div className="budget-card-grid">{props.budgets.map((b: Budget) => {
        const limit=b.limit*factor;
        const current = categorySpend(props.transactions, b.category)*factor;
        const pct = Math.round(current / limit * 100);
        return <article className="budget-card" key={b.id}><div className="budget-card-head"><span className="category-icon" style={{ background: b.color }}><Icon name={b.category === "Subscriptions" ? "repeat" : b.category === "Transportation" ? "card" : "wallet"}/></span><button aria-label={`Edit ${b.category} budget`} onClick={() => props.openModal("budget",b)}><Icon name="edit"/></button></div><h3>{b.category}</h3><div className="budget-money"><strong>{money(current, 0)}</strong><span>of {money(limit, 0)}</span><b>{pct}%</b></div><div className="progress"><i style={{ width: `${Math.min(pct, 100)}%`, background: pct > 85 ? "#ff7a66" : b.color }}></i></div><small className={pct > 85 ? "warning" : ""}>{pct > 85 ? `${money(Math.max(0,limit-current), 0)} left—take it easy` : `${money(limit-current, 0)} left in this view`}</small></article>;
      })}</div> : <div className="panel"><EmptyCompact icon="wallet" title="No category budgets" copy="Create a budget to start planning your spending." action={<Button icon="plus" onClick={()=>props.setModal("budget")}>Create budget</Button>}/></div>}
    </section>
  </>;
}

function Transactions(props: any) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [account, setAccount] = useState("All accounts");
  const [status,setStatus]=useState("All");
  const filtered = props.transactions.filter((t: Transaction) => t.merchant.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || t.category === category) && (account === "All accounts" || t.account === account) && (status === "All" || t.status === status));
  const outflow = props.transactions.filter((t: Transaction) => t.amount < 0 && ["Posted","Pending"].includes(t.status)).reduce((s: number, t: Transaction) => s + Math.abs(t.amount), 0);
  const pendingOutflow=props.transactions.filter((t:Transaction)=>t.status==="Pending"&&t.amount<0).reduce((sum:number,t:Transaction)=>sum+Math.abs(t.amount),0);
  const postedOutflow=props.transactions.filter((t:Transaction)=>t.status==="Posted"&&t.amount<0).reduce((sum:number,t:Transaction)=>sum+Math.abs(t.amount),0);
  const updateCategory = (id: number, next: string) => {
    props.setTransactions((items: Transaction[]) => items.map(t => t.id === id ? { ...t, category: next } : t));
    props.notify("Category updated across your plan.");
  };
  const postTransaction=(transaction:Transaction)=>{
    if(transaction.status!=="Pending")return;
    props.setTransactions((items:Transaction[])=>items.map(item=>item.id===transaction.id?{...item,status:"Posted"}:item));
    props.setAccounts((items:Account[])=>items.map(item=>item.name===transaction.account?{...item,balance:item.balance+transaction.amount}:item));
    props.notify(`${transaction.merchant} posted. Posted balance updated; projected balance stayed consistent.`);
  };
  return <>
    <PageIntro eyebrow="KNOW WHERE IT GOES" title="Spending, minus the mystery." copy="Search, organize, and understand every dollar." action={<Button icon="plus" onClick={() => props.setModal("transaction")}>Add transaction</Button>}/>
    <div className="spending-summary">
      <section className="panel"><span>Committed spending</span><strong>{money(outflow + 780)}</strong><small>Posted + pending, with upcoming rent</small><div className="spark-bars">{[38,62,46,76,54,89,66,73,48,58,82,70].map((v,i)=><i style={{height:`${v}%`}} key={i}></i>)}</div></section>
      <section className="panel balance-summary-card"><div><span>Posted transactions</span><strong>{money(postedOutflow)}</strong><small>Settled activity in account balances</small></div><div><span>Pending transactions</span><strong>{money(pendingOutflow)}</strong><small>Included in projected availability</small></div></section>
      <section className="panel"><span>Budget calculation</span><strong>Committed</strong><small>Failed and cancelled activity is excluded</small><div className="daily-meter"><i></i></div></section>
    </div>
    <div className="transaction-rule"><Icon name="shield"/><span><b>Prototype status rule:</b> You can post a pending demo transaction below. In a connected product, status changes come from the financial data provider—not arbitrary user controls.</span></div>
    <section className="panel transaction-table">
      <div className="status-filter segmented" aria-label="Filter transactions by status">{["All","Pending","Posted"].map(option=><button className={status===option?"active":""} onClick={()=>setStatus(option)} key={option}>{option}{option!=="All"&&<span>{props.transactions.filter((item:Transaction)=>item.status===option).length}</span>}</button>)}</div>
      <div className="table-toolbar"><div className="search-box"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions"/></div><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select aria-label="Filter by account" value={account} onChange={e=>setAccount(e.target.value)}><option>All accounts</option>{props.accounts.map((a:Account)=><option key={a.id}>{a.name}</option>)}</select><button onClick={() => props.notify("Showing March 2025 demo activity with current status filters.")}><Icon name="calendar"/> March 2025</button></div>
      <div className="table-heading"><span>Transaction</span><span>Category</span><span>Status</span><span>Amount</span><span>Actions</span></div>
      {filtered.length ? <TransactionList transactions={filtered} controls={(t) => <div className="row-actions"><select aria-label={`Change category for ${t.merchant}`} value={t.category} onChange={e => updateCategory(t.id, e.target.value)}>{[...categories, "Income"].map(c=><option key={c}>{c}</option>)}</select>{t.status==="Pending"&&<button className="post-action" aria-label={`Post ${t.merchant}`} onClick={()=>postTransaction(t)}><Icon name="check" size={16}/><span>Post</span></button>}<button aria-label={`Edit ${t.merchant}`} onClick={()=>props.openModal("transaction",t)}><Icon name="edit" size={16}/></button><button aria-label={`Delete ${t.merchant}`} onClick={() => props.confirmAction("Delete this transaction?",`${t.merchant} for ${money(Math.abs(t.amount))} will be removed.${t.status==="Posted"?" Its posted account balance will be reversed.":" Posted balances will not change."}`,()=>{props.setTransactions((items: Transaction[]) => items.filter(i => i.id !== t.id));if(t.status==="Posted")props.setAccounts((items:Account[])=>items.map(a=>a.name===t.account?{...a,balance:a.balance-t.amount}:a));props.notify("Transaction deleted and balances recalculated.");})}><Icon name="trash" size={16}/></button></div>}/> : <div className="empty-state"><Icon name="search" size={30}/><strong>No transactions found</strong><span>{props.transactions.length?"Try a different search or status filter.":"Add your first transaction to start tracking spending."}</span></div>}
    </section>
  </>;
}

function Accounts(props: any) {
  return <>
    <PageIntro eyebrow="YOUR MONEY HUBS" title="All accounts, one calm view." copy="Demo balances only. No real banking credentials are requested or stored." action={<div className="action-pair"><Button variant="secondary" icon="plus" onClick={() => props.setModal("account")}>Add account</Button><Button icon="bank" onClick={() => props.setModal("bank")}>Link bank account</Button></div>}/>
    <div className="accounts-total"><div><span>Combined posted balance</span><strong>{money(props.totalBalance)}</strong><small>Settled activity across {props.accounts.length} demo accounts</small></div><div className="projected-total"><span>Projected with pending</span><strong>{money(props.projectedBalance)}</strong><small>{money(Math.abs(props.pendingNet))} pending net activity included once</small></div><div className="health-badge"><Icon name="shield"/><span><strong>Protected demo</strong><small>Simulated connection only</small></span></div></div>
    {props.accounts.length ? <div className="account-grid">{props.accounts.map((a: Account) => {const pending=props.transactions.filter((transaction:Transaction)=>transaction.account===a.name&&transaction.status==="Pending").reduce((sum:number,transaction:Transaction)=>sum+transaction.amount,0);const projected=a.balance+pending;return <article className={`account-card ${a.color}`} key={a.id} role="button" tabIndex={0} aria-label={`Open ${a.name} details`} onClick={()=>props.openModal("account-detail",a)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();props.openModal("account-detail",a)}}}><div><span>{a.type}</span><button aria-label={`Open ${a.name} details`} onClick={event => {event.stopPropagation();props.openModal("account-detail",a)}}><Icon name="more"/></button></div><h3>{a.name}</h3><strong>{money(a.balance)}</strong><small className="account-balance-label">Posted balance</small><footer><span>Projected {money(projected)}</span><b>{a.type === "Credit card" ? `${money(Math.max(0,2000-Math.abs(projected)),0)} available` : pending?`${money(Math.abs(pending),0)} pending`:"No pending activity"}</b></footer></article>})}</div> : <div className="panel accounts-empty"><EmptyCompact icon="bank" title="No demo accounts connected" copy="Add a manual account or try the simulated bank flow." action={<Button icon="bank" onClick={()=>props.setModal("bank")}>Link demo bank</Button>}/></div>}
    <div className="transaction-rule"><Icon name="shield"/><span>Posted balances include settled transactions. Projected balances apply pending transactions once; failed and cancelled transactions are excluded.</span></div>
    <section className="panel account-activity"><SectionTitle title="Activity across accounts" subtitle="Latest movement" action={<button className="text-link" onClick={() => props.navigate("Transactions")}>View transactions <Icon name="arrow" size={15}/></button>}/><TransactionList transactions={props.transactions.slice(0, 5)}/></section>
  </>;
}

function Recurring(props: any) {
  const active = props.bills.filter((b: Bill) => !b.paused);
  const monthly = active.reduce((s: number,b: Bill)=>s+b.amount,0);
  const checking=props.accounts.find((a:Account)=>a.type==="Checking");
  const checkingPending=props.transactions.filter((transaction:Transaction)=>transaction.account===checking?.name&&transaction.status==="Pending").reduce((sum:number,transaction:Transaction)=>sum+transaction.amount,0);
  const projectedChecking=(checking?.balance||0)+checkingPending;
  return <>
    <PageIntro eyebrow="NO SURPRISE CHARGES" title="See what’s coming next." copy="Keep subscriptions and bills visible before they hit." action={<Button icon="plus" onClick={() => props.setModal("bill")}>Add recurring payment</Button>}/>
    <div className="recurring-stats"><Stat label="Monthly recurring" value={money(monthly)} note={`${active.length} active payments`} icon="repeat" tone="purple"/><Stat label="Yearly cost" value={money(monthly*12,0)} note="Annualized estimate" icon="calendar" tone="coral"/><Stat label="Due in 7 days" value="$28.97" note="3 upcoming charges" icon="bell" tone="lime"/></div>
    <div className="recurring-layout">
      <section className="panel timeline"><SectionTitle title="Upcoming timeline" subtitle="Projected checking balance after each charge"/>
        <div className="timeline-start"><span>Today · projected checking after pending</span><strong>{money(projectedChecking)}</strong></div>
        {active.length ? active.map((bill: Bill, i: number) => <div className="timeline-item" key={bill.id}><div className="timeline-date">{bill.due}</div><div className="timeline-line"><i></i></div><div className="bill-info"><div className="merchant-icon">{bill.name.slice(0,2).toUpperCase()}</div><div><strong>{bill.name}</strong><span>{bill.frequency}</span></div></div><strong>-{money(bill.amount)}</strong><small>After: {money(projectedChecking-active.slice(0,i+1).reduce((s:number,b:Bill)=>s+b.amount,0))}</small></div>) : <EmptyCompact icon="calendar" title="No upcoming charges" copy="Active recurring payments will appear here."/>}
      </section>
      <section className="panel bills-list"><SectionTitle title="All recurring payments" subtitle={`${active.length} active · ${props.bills.length-active.length} paused`}/>
        {props.bills.length ? props.bills.map((bill: Bill) => <div className={`bill-row ${bill.paused ? "paused" : ""}`} key={bill.id}><div className="merchant-icon">{bill.name.slice(0,2).toUpperCase()}</div><div><strong>{bill.name}</strong><span>{bill.paused ? "Paused" : `Next: ${bill.due}`}</span></div><strong>{money(bill.amount)}</strong><div><button aria-label={`Edit ${bill.name}`} onClick={()=>props.openModal("bill",bill)}><Icon name="edit" size={16}/></button><button aria-label={`${bill.paused ? "Resume" : "Pause"} ${bill.name}`} onClick={()=>{props.setBills((items:Bill[])=>items.map(b=>b.id===bill.id?{...b,paused:!b.paused}:b));props.notify(`${bill.name} ${bill.paused?"resumed":"paused"}. Forecast updated.`)}}><Icon name={bill.paused ? "repeat" : "pause"} size={16}/></button><button aria-label={`Remove ${bill.name}`} onClick={()=>props.confirmAction("Remove recurring payment?",`${bill.name} will be removed from upcoming charges and balance forecasts.`,()=>{props.setBills((items:Bill[])=>items.filter(b=>b.id!==bill.id));props.notify("Recurring payment removed and forecast updated.")})}><Icon name="trash" size={16}/></button></div></div>) : <EmptyCompact icon="repeat" title="No recurring payments" copy="Add a bill or subscription to forecast upcoming charges."/>}
      </section>
    </div>
  </>;
}

function Savings(props: any) {
  const saved = props.goals.reduce((s: number,g:Goal)=>s+g.saved,0);
  const target = props.goals.reduce((s: number,g:Goal)=>s+g.target,0);
  const contribute = (goal: Goal) => {
    const checking=props.accounts.find((account:Account)=>account.type==="Checking");
    if(!checking || checking.balance<50){props.notify("A checking balance of at least $50 is required for this demo transfer.");return;}
    props.setGoals((items: Goal[]) => items.map(g => g.id === goal.id ? {...g, saved: Math.min(g.saved+50,g.target)} : g));
    const contribution=Math.min(50,goal.target-goal.saved);
    props.setAccounts((items:Account[])=>items.map(account=>account.type==="Checking"?{...account,balance:account.balance-contribution}:account.type==="Savings"?{...account,balance:account.balance+contribution}:account));
    props.notify(`Transferred ${money(contribution,0)} from checking to ${goal.name}.`);
  };
  return <>
    <PageIntro eyebrow="BUILD YOUR NEXT CHAPTER" title="Goals worth getting excited about." copy="Turn big plans into small, doable weekly wins." action={<Button icon="plus" onClick={()=>props.setModal("goal")}>Create savings goal</Button>}/>
    <div className="savings-hero"><div><span>Total goal savings</span><strong>{money(saved,0)}</strong><small>of {money(target,0)} across {props.goals.length} goals</small></div><div className="savings-visual"><div style={{width:`${target?Math.min(saved/target*100,100):0}%`}}></div></div><div><Icon name="trend"/><span><b>{props.goals.length?"$210":"$0"}</b> added this month</span></div></div>
    {props.goals.length ? <div className="goal-grid">{props.goals.map((goal: Goal) => {
      const pct=Math.round(goal.saved/goal.target*100); const left=goal.target-goal.saved;
      return <article className={`goal-card ${goal.color}`} key={goal.id}><div className="goal-card-top"><span><Icon name="target"/></span><div className="goal-card-actions"><button aria-label={`Edit ${goal.name}`} onClick={()=>props.openModal("goal",goal)}><Icon name="edit" size={17}/></button><button aria-label={`Delete ${goal.name}`} onClick={()=>props.confirmAction("Delete savings goal?",`${goal.name} will be removed. Account balances and past contributions will not change.`,()=>{props.setGoals((items:Goal[])=>items.filter(g=>g.id!==goal.id));props.notify("Savings goal deleted.")})}><Icon name="trash" size={17}/></button></div></div><span className="goal-label">SAVINGS GOAL</span><h3>{goal.name}</h3><div className="goal-amount"><strong>{money(goal.saved,0)}</strong><span>of {money(goal.target,0)}</span></div><div className="progress"><i style={{width:`${Math.min(pct,100)}%`}}></i></div><div className="goal-meta"><span>{pct}% funded</span><span>Due {goal.date}</span></div><div className="ai-suggestion"><Icon name="spark" size={16}/><span>{left>0?<>Save <b>{money(Math.ceil(left/14),0)}/week</b> to arrive on time.</>:<b>Goal reached—nice work.</b>}</span></div><Button variant="secondary" icon="plus" onClick={()=>contribute(goal)} disabled={left<=0}>Add $50 contribution</Button></article>;
    })}</div> : <div className="panel savings-empty"><EmptyCompact icon="target" title="No savings goals yet" copy="Create a goal for an emergency fund, trip, laptop, or anything else." action={<Button icon="plus" onClick={()=>props.setModal("goal")}>Create first goal</Button>}/></div>}
  </>;
}

function SharedFinances(props:any) {
  const [inviteMethod,setInviteMethod]=useState<"Email"|"Link">("Email");
  const [email,setEmail]=useState("");
  const [inviteError,setInviteError]=useState("");
  const [showExpenseForm,setShowExpenseForm]=useState(false);
  const [editingExpense,setEditingExpense]=useState<number|null>(null);
  const [expenseDraft,setExpenseDraft]=useState({description:"",amount:"",category:"Groceries",paidBy:"Maya",date:"Mar 18",note:""});
  const [showBudgetForm,setShowBudgetForm]=useState(false);
  const [budgetDraft,setBudgetDraft]=useState({category:"",limit:""});
  const [showGoalForm,setShowGoalForm]=useState(false);
  const [goalDraft,setGoalDraft]=useState({name:"",target:""});
  const invitation=props.sharedInvitation as SharedInvitation|null;
  const accepted=invitation?.status==="Accepted"&&invitation.ownerAccepted&&invitation.partnerAccepted;
  const partnerName=invitation?.email&&invitation.email!=="Shared invite link"?invitation.email.split("@")[0]:"Partner";

  const createInvitation=(method:"Email"|"Link")=>{
    if(method==="Email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setInviteError("Enter a valid email address for the simulated invitation.");return;}
    setInviteError("");
    props.setSharedInvitation({id:Date.now(),email:method==="Email"?email:"Shared invite link",status:"Pending",ownerAccepted:false,partnerAccepted:false,method,created:"Today"});
    if(method==="Link"){
      const link=`${window.location.origin}/shared/demo-${Date.now()}`;
      navigator.clipboard?.writeText(link);
      props.notify("Simulated invitation link copied. It does not connect another device.");
    }else props.notify("Simulated invitation created. No email was sent.");
  };
  const acceptOwner=()=>props.setSharedInvitation((current:SharedInvitation|null)=>current?{...current,ownerAccepted:true,status:current.partnerAccepted?"Accepted":"Pending"}:current);
  const acceptPartner=()=>props.setSharedInvitation((current:SharedInvitation|null)=>current?{...current,partnerAccepted:true,status:current.ownerAccepted?"Accepted":"Pending"}:current);
  const saveExpense=()=>{
    const amount=Number(expenseDraft.amount);
    if(!expenseDraft.description.trim()||!amount||amount<=0){props.notify("Add an expense description and valid amount.");return;}
    const next:SharedExpense={id:editingExpense||Date.now(),description:expenseDraft.description.trim(),amount,category:expenseDraft.category,paidBy:expenseDraft.paidBy as "Maya"|"Partner",date:expenseDraft.date||"Today",note:expenseDraft.note.trim()};
    props.setSharedExpenses((items:SharedExpense[])=>editingExpense?items.map(item=>item.id===editingExpense?next:item):[next,...items]);
    setExpenseDraft({description:"",amount:"",category:"Groceries",paidBy:"Maya",date:"Mar 18",note:""});setEditingExpense(null);setShowExpenseForm(false);props.notify(`Shared expense ${editingExpense?"updated":"added"}.`);
  };
  const editExpense=(expense:SharedExpense)=>{setExpenseDraft({description:expense.description,amount:String(expense.amount),category:expense.category,paidBy:expense.paidBy,date:expense.date,note:expense.note});setEditingExpense(expense.id);setShowExpenseForm(true);};
  const addBudget=()=>{
    const limit=Number(budgetDraft.limit);
    if(!budgetDraft.category.trim()||!limit||limit<=0){props.notify("Add a shared category and valid monthly limit.");return;}
    props.setSharedBudgets((items:SharedBudget[])=>[...items,{id:Date.now(),category:budgetDraft.category.trim(),limit}]);setBudgetDraft({category:"",limit:""});setShowBudgetForm(false);props.notify("Shared budget category added.");
  };
  const addGoal=()=>{
    const target=Number(goalDraft.target);
    if(!goalDraft.name.trim()||!target||target<=0){props.notify("Add a goal name and valid target.");return;}
    props.setSharedGoals((items:SharedGoal[])=>[...items,{id:Date.now(),name:goalDraft.name.trim(),target,maya:0,partner:0}]);setGoalDraft({name:"",target:""});setShowGoalForm(false);props.notify("Shared savings goal created.");
  };
  const selectedPersonal=(props.transactions as Transaction[]).filter(transaction=>props.sharedTransactionIds.includes(transaction.id));
  const directSpent=(props.sharedExpenses as SharedExpense[]).reduce((sum,expense)=>sum+expense.amount,0);
  const referencedSpent=selectedPersonal.reduce((sum,transaction)=>sum+Math.abs(transaction.amount),0);
  const sharedSpent=directSpent+referencedSpent;
  const budgetTotal=(props.sharedBudgets as SharedBudget[]).reduce((sum,budget)=>sum+budget.limit,0);
  const goalSaved=(props.sharedGoals as SharedGoal[]).reduce((sum,goal)=>sum+goal.maya+goal.partner,0);
  const goalTarget=(props.sharedGoals as SharedGoal[]).reduce((sum,goal)=>sum+goal.target,0);
  const mayaPaid=(props.sharedExpenses as SharedExpense[]).filter(expense=>expense.paidBy==="Maya").reduce((sum,expense)=>sum+expense.amount,0)+referencedSpent;
  const partnerPaid=directSpent-(props.sharedExpenses as SharedExpense[]).filter(expense=>expense.paidBy==="Maya").reduce((sum,expense)=>sum+expense.amount,0);
  const mayaPct=props.contributionMode==="Equal"?50:props.mayaContributionPct;
  const partnerPct=100-mayaPct;
  const sharedVisibleBalance=(props.accounts as Account[]).filter(account=>props.sharedAccountIds.includes(account.id)).reduce((sum,account)=>sum+account.balance,0);
  const sharedCategories=Array.from(new Set(["Rent","Groceries","Utilities","Transportation","Entertainment",...(props.sharedBudgets as SharedBudget[]).map(item=>item.category)]));

  if(!accepted){
    return <>
      <PageIntro eyebrow="SHARED FINANCES" title="Plan together. Keep personal money personal." copy="Invite a partner to collaborate only on the expenses, budgets, goals, and accounts you explicitly choose."/>
      <div className="shared-invite-layout">
        <section className="shared-invite-card">
          <div className="shared-people"><span className="avatar">MA</span><i><Icon name="plus" size={16}/></i><span className="partner-avatar"><Icon name="user"/></span></div>
          <span className="eyebrow">PRIVATE BY DEFAULT</span><h2>Start a shared money space</h2><p>Your personal transactions, account credentials, full account numbers, and unrelated goals stay private unless you explicitly share supported details.</p>
          <div className="segmented invite-method">{(["Email","Link"] as const).map(method=><button className={inviteMethod===method?"active":""} key={method} onClick={()=>setInviteMethod(method)}>{method==="Email"?"Invite by email":"Create invitation link"}</button>)}</div>
          {inviteMethod==="Email"?<div className="invite-email"><label>Partner email<input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="partner@university.edu"/></label>{inviteError&&<div className="form-error">{inviteError}</div>}<Button icon="send" onClick={()=>createInvitation("Email")}>Create simulated invitation</Button></div>:<div className="invite-link-box"><Icon name="shield"/><div><strong>One-time demo invitation link</strong><span>The link is copied locally. It cannot synchronize another browser or device.</span></div><Button icon="plus" onClick={()=>createInvitation("Link")}>Generate link</Button></div>}
          <small className="prototype-caption">No real email, account connection, or cross-device collaboration occurs in this frontend prototype.</small>
        </section>
        <section className="panel invitation-status-card">
          <SectionTitle title="Invitation status" subtitle={invitation?`${invitation.method} invitation · ${invitation.created}`:"No invitation created"}/>
          {invitation?<><div className={`invitation-status ${invitation.status.toLowerCase()}`}><span>{invitation.status}</span><strong>{invitation.email}</strong><small>{invitation.status==="Pending"?"Both people must explicitly accept before shared data unlocks.":invitation.status==="Declined"?"The partner declined this simulated invitation.":invitation.status==="Expired"?"This simulated invitation is no longer active.":"Both participants accepted."}</small></div>
            {invitation.status==="Pending"&&<div className="acceptance-steps"><div className={invitation.ownerAccepted?"complete":""}><span>{invitation.ownerAccepted?<Icon name="check"/>:"1"}</span><div><strong>Your consent</strong><small>Agree to create a separate shared ledger</small></div>{!invitation.ownerAccepted&&<Button variant="secondary" onClick={acceptOwner}>I accept</Button>}</div><div className={invitation.partnerAccepted?"complete":""}><span>{invitation.partnerAccepted?<Icon name="check"/>:"2"}</span><div><strong>Partner consent</strong><small>Simulate the invited partner's response</small></div>{!invitation.partnerAccepted&&<Button variant="secondary" onClick={acceptPartner}>Simulate accept</Button>}</div></div>}
            {invitation.status==="Pending"&&<div className="invite-simulation-actions"><button onClick={()=>props.setSharedInvitation({...invitation,status:"Declined",partnerAccepted:false})}>Simulate decline</button><button onClick={()=>props.setSharedInvitation({...invitation,status:"Expired",partnerAccepted:false})}>Expire invitation</button></div>}
            {["Declined","Expired"].includes(invitation.status)&&<Button variant="secondary" onClick={()=>props.setSharedInvitation(null)}>Start a new invitation</Button>}
          </>:<EmptyCompact icon="user" title="Invite someone you trust" copy="Shared information remains locked until both people accept."/>}
        </section>
      </div>
      <div className="shared-privacy-grid"><div><Icon name="shield"/><strong>Personal stays personal</strong><span>Nothing is shared automatically.</span></div><div><Icon name="check"/><strong>Two-sided consent</strong><span>Both people must accept first.</span></div><div><Icon name="card"/><strong>Masked account details</strong><span>Credentials are never shown or stored.</span></div></div>
    </>;
  }

  return <>
    <PageIntro eyebrow="SHARED FINANCES" title={`You and ${partnerName}, in sync.`} copy="A separate collaborative plan for the money you intentionally manage together." action={<Button variant="secondary" icon="shield" onClick={()=>document.getElementById("sharing-controls")?.scrollIntoView({behavior:"smooth"})}>Manage sharing</Button>}/>
    <section className="shared-status-banner"><div className="shared-avatars"><span>MA</span><span>{partnerName.slice(0,2).toUpperCase()}</span></div><div><span>SHARED SPACE · ACCEPTED</span><strong>Both people approved access</strong><small>Frontend simulation only · no cross-device sync</small></div><div className="shared-visible-balance"><span>Explicitly shared account balance</span><strong>{money(sharedVisibleBalance)}</strong><small>{props.sharedAccountIds.length} account{props.sharedAccountIds.length===1?"":"s"} selected</small></div></section>
    <div className="shared-kpis"><Stat label="Shared spending" value={money(sharedSpent,0)} note="Direct + selected transactions, counted once" icon="receipt" tone="coral"/><Stat label="Monthly shared plan" value={money(budgetTotal,0)} note={`${props.sharedBudgets.length} collaborative categories`} icon="wallet" tone="purple"/><Stat label="Shared goal savings" value={money(goalSaved,0)} note={`${goalTarget?Math.round(goalSaved/goalTarget*100):0}% of combined targets`} icon="target" tone="lime"/><Stat label="Upcoming shared bills" value={money(props.sharedBills.reduce((sum:number,bill:SharedBill)=>sum+bill.amount,0),0)} note={`${props.sharedBills.length} payments scheduled`} icon="calendar" tone="blue"/></div>
    <div className="shared-top-grid">
      <section className="panel contribution-card"><SectionTitle title="Contribution arrangement" subtitle="A planning suggestion—not an assumption about income"/><div className="segmented">{(["Equal","Custom"] as const).map(mode=><button className={props.contributionMode===mode?"active":""} key={mode} onClick={()=>props.setContributionMode(mode)}>{mode==="Equal"?"Equal split":"Custom percentages"}</button>)}</div>{props.contributionMode==="Custom"&&<div className="contribution-inputs"><label>Maya<input type="number" min="0" max="100" value={mayaPct} onChange={event=>props.setMayaContributionPct(Math.max(0,Math.min(100,Number(event.target.value))))}/><span>%</span></label><label>Partner<input type="number" value={partnerPct} disabled/><span>%</span></label></div>}<div className="contribution-bar"><i style={{width:`${mayaPct}%`}}></i></div><div className="contribution-legend"><span><i className="maya"></i>Maya · {mayaPct}%</span><span><i className="partner"></i>Partner · {partnerPct}%</span></div><div className="suggested-split"><div><span>Maya suggested</span><strong>{money(budgetTotal*mayaPct/100,0)}</strong></div><div><span>Partner suggested</span><strong>{money(budgetTotal*partnerPct/100,0)}</strong></div></div><p>Percentages apply only to the shared monthly plan. They do not infer either person's income or change personal accounts.</p></section>
      <section className="panel contribution-card actual-contributions"><SectionTitle title="Contributions so far" subtitle="Based on who paid each shared expense"/><div className="contribution-ring" style={{"--maya":`${sharedSpent?mayaPaid/sharedSpent*360:180}deg`} as React.CSSProperties}><div><strong>{money(sharedSpent,0)}</strong><span>shared total</span></div></div><div className="actual-row"><span><i className="maya"></i>Maya paid</span><strong>{money(mayaPaid)}</strong><small>{sharedSpent?Math.round(mayaPaid/sharedSpent*100):0}%</small></div><div className="actual-row"><span><i className="partner"></i>Partner paid</span><strong>{money(partnerPaid)}</strong><small>{sharedSpent?Math.round(partnerPaid/sharedSpent*100):0}%</small></div></section>
    </div>
    <section className="panel shared-budget-planner"><SectionTitle title="Shared budget planner" subtitle="Edit limits together without changing either personal budget" action={<Button variant="secondary" icon="plus" onClick={()=>setShowBudgetForm(!showBudgetForm)}>Add category</Button>}/>{showBudgetForm&&<div className="shared-inline-form"><input value={budgetDraft.category} onChange={event=>setBudgetDraft({...budgetDraft,category:event.target.value})} placeholder="Category name"/><div className="money-input"><span>$</span><input type="number" min="1" value={budgetDraft.limit} onChange={event=>setBudgetDraft({...budgetDraft,limit:event.target.value})} placeholder="Monthly limit"/></div><Button onClick={addBudget}>Add to shared plan</Button><Button variant="ghost" onClick={()=>setShowBudgetForm(false)}>Cancel</Button></div>}<div className="shared-budget-grid">{props.sharedBudgets.map((budget:SharedBudget)=>{const spent=props.sharedExpenses.filter((expense:SharedExpense)=>expense.category===budget.category).reduce((sum:number,expense:SharedExpense)=>sum+expense.amount,0)+selectedPersonal.filter((transaction:Transaction)=>transaction.category===budget.category).reduce((sum:number,transaction:Transaction)=>sum+Math.abs(transaction.amount),0);const pct=budget.limit?spent/budget.limit*100:0;return <article key={budget.id}><div><span className="category-dot" style={{background:categoryColors[budget.category]||"#7c5cff"}}></span><strong>{budget.category}</strong><button onClick={()=>props.confirmAction("Remove shared category?",`${budget.category} will be removed from the shared planner. Existing shared expenses remain.`,()=>props.setSharedBudgets((items:SharedBudget[])=>items.filter(item=>item.id!==budget.id)))} aria-label={`Remove ${budget.category} shared budget`}><Icon name="trash" size={15}/></button></div><label>Monthly limit<div className="money-input"><span>$</span><input type="number" min="1" value={budget.limit} onChange={event=>props.setSharedBudgets((items:SharedBudget[])=>items.map(item=>item.id===budget.id?{...item,limit:Math.max(1,Number(event.target.value))}:item))}/></div></label><div className="budget-money"><strong>{money(spent,0)}</strong><span>of {money(budget.limit,0)}</span><b>{Math.round(pct)}%</b></div><div className="progress"><i style={{width:`${Math.min(pct,100)}%`,background:pct>90?"#ff7a66":categoryColors[budget.category]||"#7c5cff"}}></i></div></article>})}</div></section>
    <div className="shared-main-grid">
      <section className="panel shared-expenses"><SectionTitle title="Shared expenses" subtitle={`${props.sharedExpenses.length+selectedPersonal.length} items in the shared ledger`} action={<Button icon="plus" onClick={()=>{setEditingExpense(null);setExpenseDraft({description:"",amount:"",category:"Groceries",paidBy:"Maya",date:"Mar 18",note:""});setShowExpenseForm(!showExpenseForm)}}>Add expense</Button>}/>{showExpenseForm&&<div className="shared-expense-form"><div className="form-grid"><label>Description<input value={expenseDraft.description} onChange={event=>setExpenseDraft({...expenseDraft,description:event.target.value})} placeholder="e.g. Grocery run"/></label><label>Amount<input type="number" min="0.01" step="0.01" value={expenseDraft.amount} onChange={event=>setExpenseDraft({...expenseDraft,amount:event.target.value})} placeholder="0.00"/></label><label>Category<select value={expenseDraft.category} onChange={event=>setExpenseDraft({...expenseDraft,category:event.target.value})}>{sharedCategories.map(category=><option key={category}>{category}</option>)}</select></label><label>Paid by<select value={expenseDraft.paidBy} onChange={event=>setExpenseDraft({...expenseDraft,paidBy:event.target.value})}><option>Maya</option><option>Partner</option></select></label><label>Date<input value={expenseDraft.date} onChange={event=>setExpenseDraft({...expenseDraft,date:event.target.value})}/></label><label>Note<input value={expenseDraft.note} onChange={event=>setExpenseDraft({...expenseDraft,note:event.target.value})} placeholder="Optional context"/></label></div><div className="form-actions"><Button variant="secondary" onClick={()=>setShowExpenseForm(false)}>Cancel</Button><Button onClick={saveExpense}>{editingExpense?"Save changes":"Add shared expense"}</Button></div></div>}<div className="shared-expense-list">{props.sharedExpenses.map((expense:SharedExpense)=><div className="shared-expense-row" key={expense.id}><span className="merchant-icon">{expense.description.slice(0,2).toUpperCase()}</span><div><strong>{expense.description}</strong><span>{expense.date} · {expense.category} · Paid by {expense.paidBy}</span>{expense.note&&<small>“{expense.note}”</small>}</div><strong>{money(expense.amount)}</strong><div><button onClick={()=>editExpense(expense)} aria-label={`Edit ${expense.description}`}><Icon name="edit" size={15}/></button><button onClick={()=>props.confirmAction("Delete shared expense?",`${expense.description} will be removed from the shared ledger and contribution totals.`,()=>props.setSharedExpenses((items:SharedExpense[])=>items.filter(item=>item.id!==expense.id)))} aria-label={`Delete ${expense.description}`}><Icon name="trash" size={15}/></button></div></div>)}{selectedPersonal.map((transaction:Transaction)=><div className="shared-expense-row referenced" key={`personal-${transaction.id}`}><span className="merchant-icon">{transaction.icon}</span><div><strong>{transaction.merchant}</strong><span>{transaction.date} · {transaction.category} · Shared from Maya's personal activity</span><small>Reference only · source transaction remains personal</small></div><strong>{money(Math.abs(transaction.amount))}</strong><button className="unshare-button" onClick={()=>props.confirmAction("Stop sharing this transaction?",`${transaction.merchant} will leave the shared view but remain in your personal transactions.`,()=>props.setSharedTransactionIds((ids:number[])=>ids.filter((id:number)=>id!==transaction.id)))}>Unshare</button></div>)}</div></section>
      <section className="panel shared-bills"><SectionTitle title="Upcoming shared bills" subtitle="Planned payments in this shared space"/>{props.sharedBills.map((bill:SharedBill)=><div className="shared-bill-row" key={bill.id}><div className="date-tile"><span>{bill.due.split(" ")[0]}</span><b>{bill.due.split(" ")[1]}</b></div><div><strong>{bill.name}</strong><small>Shared recurring payment</small></div><strong>{money(bill.amount)}</strong><button onClick={()=>props.confirmAction("Mark shared bill as paid?",`${bill.name} will become a shared expense paid by Maya and leave the upcoming list.`,()=>{props.setSharedExpenses((items:SharedExpense[])=>[{id:Date.now(),description:bill.name,amount:bill.amount,category:bill.name.toLowerCase().includes("rent")?"Rent":"Utilities",paidBy:"Maya",date:"Today",note:"Created from upcoming shared bills."},...items]);props.setSharedBills((items:SharedBill[])=>items.filter(item=>item.id!==bill.id));props.notify("Bill moved to shared expenses.");})}>Mark paid</button></div>)}</section>
    </div>
    <section className="shared-goals-section"><SectionTitle title="Shared savings goals" subtitle="Contributions stay in this collaborative tracker" action={<Button variant="secondary" icon="plus" onClick={()=>setShowGoalForm(!showGoalForm)}>Add goal</Button>}/>{showGoalForm&&<div className="shared-inline-form goal-form"><input value={goalDraft.name} onChange={event=>setGoalDraft({...goalDraft,name:event.target.value})} placeholder="Goal name"/><div className="money-input"><span>$</span><input type="number" min="1" value={goalDraft.target} onChange={event=>setGoalDraft({...goalDraft,target:event.target.value})} placeholder="Target"/></div><Button onClick={addGoal}>Create shared goal</Button><Button variant="ghost" onClick={()=>setShowGoalForm(false)}>Cancel</Button></div>}<div className="shared-goal-grid">{props.sharedGoals.map((goal:SharedGoal)=>{const saved=goal.maya+goal.partner;const pct=goal.target?saved/goal.target*100:0;return <article className="panel" key={goal.id}><div className="shared-goal-head"><span><Icon name="target"/></span><button onClick={()=>props.confirmAction("Remove shared goal?",`${goal.name} will be removed from the shared space. Personal goals are unaffected.`,()=>props.setSharedGoals((items:SharedGoal[])=>items.filter(item=>item.id!==goal.id)))} aria-label={`Remove ${goal.name}`}><Icon name="trash" size={16}/></button></div><h3>{goal.name}</h3><div className="goal-amount"><strong>{money(saved,0)}</strong><span>of {money(goal.target,0)}</span></div><div className="progress"><i style={{width:`${Math.min(pct,100)}%`}}></i></div><div className="shared-goal-split"><span>Maya {money(goal.maya,0)}</span><span>Partner {money(goal.partner,0)}</span></div><div className="shared-goal-actions"><Button variant="secondary" onClick={()=>props.setSharedGoals((items:SharedGoal[])=>items.map(item=>item.id===goal.id?{...item,maya:Math.min(item.target-item.partner,item.maya+25)}:item))} disabled={saved>=goal.target}>Maya +$25</Button><Button variant="secondary" onClick={()=>props.setSharedGoals((items:SharedGoal[])=>items.map(item=>item.id===goal.id?{...item,partner:Math.min(item.target-item.maya,item.partner+25)}:item))} disabled={saved>=goal.target}>Partner +$25</Button></div></article>})}</div></section>
    <section className="panel sharing-controls" id="sharing-controls"><SectionTitle title="Sharing and access controls" subtitle="Nothing below is shared without an explicit choice"/><div className="permissions-grid"><div><h3>Account visibility</h3><p>Only masked details and balances are shown. Credentials and full account numbers are never exposed.</p>{props.accounts.map((account:Account)=><div className="permission-row" key={account.id}><span className="worth-icon"><Icon name="bank"/></span><div><strong>{account.name}</strong><small>{account.type} · •••• {account.digits}</small></div><button className={props.sharedAccountIds.includes(account.id)?"shared":""} onClick={()=>props.confirmAction(props.sharedAccountIds.includes(account.id)?"Remove shared account view?":"Share this account view?",props.sharedAccountIds.includes(account.id)?`${account.name} will no longer appear in combined shared balances.`:`Only ${account.name}'s masked name, type, last four digits, and balance will appear.`,()=>props.setSharedAccountIds((ids:number[])=>ids.includes(account.id)?ids.filter(id=>id!==account.id):[...ids,account.id]))}>{props.sharedAccountIds.includes(account.id)?"Shared":"Private"}</button></div>)}</div><div><h3>Transaction visibility</h3><p>Select individual transactions. They appear once as references and remain in your personal ledger.</p>{props.transactions.slice(0,4).map((transaction:Transaction)=><div className="permission-row" key={transaction.id}><span className="merchant-icon">{transaction.icon}</span><div><strong>{transaction.merchant}</strong><small>{money(Math.abs(transaction.amount))} · {transaction.status}</small></div><button className={props.sharedTransactionIds.includes(transaction.id)?"shared":""} onClick={()=>props.confirmAction(props.sharedTransactionIds.includes(transaction.id)?"Stop sharing transaction?":"Share this transaction?",props.sharedTransactionIds.includes(transaction.id)?`${transaction.merchant} will be removed from the shared view only.`:`${transaction.merchant}, its amount, category, date, and status will be visible in the shared space.`,()=>props.setSharedTransactionIds((ids:number[])=>ids.includes(transaction.id)?ids.filter(id=>id!==transaction.id):[...ids,transaction.id]))}>{props.sharedTransactionIds.includes(transaction.id)?"Shared":"Private"}</button></div>)}</div></div><div className="access-level"><div><strong>Partner permission</strong><span>{props.sharedAccess==="Can edit"?"Partner can edit shared budgets, expenses, and goals.":"Partner can view shared information but not edit it."}</span></div><div className="segmented">{(["Can edit","View only"] as const).map(access=><button className={props.sharedAccess===access?"active":""} key={access} onClick={()=>{if(props.sharedAccess===access)return;props.confirmAction("Change partner permission?",`Partner access will change to “${access}” for this simulated shared space.`,()=>props.setSharedAccess(access));}}>{access}</button>)}</div></div><div className="danger-zone"><div><Icon name="shield"/><span><strong>End or revoke sharing</strong><small>Personal accounts, transactions, budgets, and goals remain unaffected.</small></span></div><Button variant="secondary" onClick={()=>props.confirmAction("Revoke partner access?","The shared dashboard will lock immediately. Shared demo data will remain available if you create a new accepted invitation.",()=>{props.setSharedInvitation({...invitation,status:"Declined",partnerAccepted:false});props.setSharedAccountIds([]);props.setSharedTransactionIds([]);props.notify("Partner access revoked.");})}>Revoke access</Button><Button variant="danger" onClick={()=>props.confirmAction("Leave and delete this shared space?","All shared expenses, budgets, goals, bills, permissions, and invitation details will be removed. Personal data will not change.",()=>{props.setSharedInvitation(null);props.setSharedExpenses([]);props.setSharedBudgets([]);props.setSharedGoals([]);props.setSharedBills([]);props.setSharedAccountIds([]);props.setSharedTransactionIds([]);props.notify("Shared arrangement removed. Personal finances were not changed.");})}>Leave arrangement</Button></div></section>
    <div className="data-disclosure"><Icon name="shield"/><p><b>Prototype boundary:</b> This shared workspace uses local in-browser state. It does not send invitations, authenticate a second user, synchronize devices, or expose bank credentials. A production version would require a secure backend, user accounts, audit logs, and permission enforcement.</p></div>
  </>;
}

function portfolioValue(holdings: Holding[]) {
  return holdings.reduce((sum, holding) => sum + holding.quantity * holding.price, 0);
}

function FinancialHealth(props: any) {
  const investments = portfolioValue(props.holdings);
  const cashAssets = props.accounts.filter((account: Account) => account.balance > 0).reduce((sum: number, account: Account) => sum + account.balance, 0);
  const liabilities = props.accounts.filter((account: Account) => account.balance < 0).reduce((sum: number, account: Account) => sum + Math.abs(account.balance), 0);
  const netWorth = cashAssets + investments - liabilities;
  const cards: { page: Page; icon: IconName; title: string; value: string; copy: string; tone: string }[] = [
    { page: "Net Worth", icon: "trend", title: "Net worth", value: money(netWorth, 0), copy: `${props.accounts.length} linked or manual accounts plus tracked investments`, tone: "lime" },
    { page: "Credit Score", icon: "card", title: "Credit score", value: String(props.creditScore), copy: "Sample score · credit reporting is not connected", tone: "purple" },
    { page: "Investments", icon: "chart", title: "Investments", value: money(investments, 0), copy: `${props.holdings.length} simulated or manually entered holdings`, tone: "coral" },
    { page: "Reports", icon: "receipt", title: "Monthly cash flow", value: money(2420 - props.monthSpent, 0), copy: "Income minus recorded and estimated March spending", tone: "blue" },
  ];
  return <>
    <PageIntro eyebrow="FINANCIAL HEALTH" title="A clearer view of your whole picture." copy="Explore your assets, debt, credit-building habits, investments, and cash-flow trends in one place."/>
    <section className="health-hero">
      <div><span>ESTIMATED NET WORTH</span><strong>{money(netWorth, 0)}</strong><p>Based only on accounts and holdings currently in this prototype.</p></div>
      <div className="health-score"><div className="health-ring"><strong>78</strong><span>of 100</span></div><div><b>Looking good</b><span>Your cash flow and savings are positive. Keep credit utilization and upcoming bills in view.</span></div></div>
    </section>
    <div className="health-card-grid">
      {cards.map(card => <button className="health-feature-card" key={card.page} onClick={() => props.navigate(card.page)}>
        <span className={`stat-icon ${card.tone}`}><Icon name={card.icon}/></span><Icon name="chevron" size={17}/>
        <small>{card.title}</small><strong>{card.value}</strong><p>{card.copy}</p><b>Explore details <Icon name="arrow" size={14}/></b>
      </button>)}
    </div>
    <section className="panel health-note"><Icon name="shield"/><div><strong>Know what is—and is not—included</strong><p>Current Campus uses only linked demo accounts, manual accounts, and explicitly tracked holdings. Unlinked property, student loans, cash, retirement plans, and other assets or liabilities are excluded until you add them.</p></div><Button variant="secondary" onClick={() => props.navigate("Accounts")}>Review accounts</Button></section>
  </>;
}

function NetWorth(props: any) {
  const [selected, setSelected] = useState(7);
  const investments = portfolioValue(props.holdings);
  const assetAccounts = props.accounts.filter((account: Account) => account.balance > 0);
  const liabilityAccounts = props.accounts.filter((account: Account) => account.balance < 0);
  const cashAssets = assetAccounts.reduce((sum: number, account: Account) => sum + account.balance, 0);
  const liabilities = liabilityAccounts.reduce((sum: number, account: Account) => sum + Math.abs(account.balance), 0);
  const netWorth = cashAssets + investments - liabilities;
  const history = [4210, 4380, 4715, 4890, 5260, 5675, 6120, netWorth];
  const labels = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const max = Math.max(...history, 1);
  const points = history.map((value, index) => `${(index / (history.length - 1)) * 100},${86 - value / max * 70}`).join(" ");
  return <>
    <PageIntro eyebrow="FINANCIAL HEALTH · NET WORTH" title="Everything you own, minus what you owe." copy="A live estimate from the accounts and investments you have chosen to track." action={<Button variant="secondary" icon="bank" onClick={() => props.navigate("Accounts")}>Manage accounts</Button>}/>
    <section className="net-worth-hero">
      <div><span>ESTIMATED NET WORTH</span><strong>{money(netWorth)}</strong><small><Icon name="trend" size={15}/> {money(netWorth - history[6], 0)} since February</small></div>
      <div><div><span>Total assets</span><strong>{money(cashAssets + investments)}</strong></div><div><span>Total liabilities</span><strong>{money(liabilities)}</strong></div></div>
    </section>
    <section className="panel worth-chart-panel">
      <SectionTitle title="Net worth over time" subtitle="Historical months use clearly labeled prototype estimates"/>
      <div className="worth-chart" aria-label={`Net worth trend. Selected ${labels[selected]}: ${money(history[selected])}`}>
        <svg viewBox="0 0 100 95" preserveAspectRatio="none" role="img" aria-label="Estimated net worth line chart"><defs><linearGradient id="worthArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c5cff" stopOpacity=".25"/><stop offset="1" stopColor="#7c5cff" stopOpacity="0"/></linearGradient></defs><polygon points={`0,90 ${points} 100,90`} fill="url(#worthArea)"/><polyline points={points} fill="none" stroke="#7c5cff" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>
        <div className="chart-selectors">{history.map((value, index) => <button key={labels[index]} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} aria-label={`${labels[index]} estimated net worth ${money(value)}`}><i style={{ bottom: `${value / max * 70 + 9}%` }}></i><span>{labels[index]}</span></button>)}</div>
        <div className="chart-tooltip"><span>{labels[selected]} {selected === history.length - 1 ? "· Current data" : "· Prototype estimate"}</span><strong>{money(history[selected])}</strong></div>
      </div>
    </section>
    <div className="worth-breakdown">
      <section className="panel"><SectionTitle title="Assets" subtitle={`${assetAccounts.length + (props.holdings.length ? 1 : 0)} included sources`}/>{assetAccounts.map((account: Account) => <div className="worth-row" key={account.id}><span className="worth-icon"><Icon name={account.type === "Savings" ? "wallet" : "bank"}/></span><div><strong>{account.name}</strong><small>{account.type} · •••• {account.digits}</small></div><strong>{money(account.balance)}</strong></div>)}{props.holdings.length > 0 && <div className="worth-row"><span className="worth-icon purple"><Icon name="chart"/></span><div><strong>Tracked investments</strong><small>{props.holdings.length} holdings · no account balances double-counted</small></div><strong>{money(investments)}</strong></div>}<footer><span>Total assets</span><strong>{money(cashAssets + investments)}</strong></footer></section>
      <section className="panel"><SectionTitle title="Liabilities" subtitle={`${liabilityAccounts.length} included account${liabilityAccounts.length === 1 ? "" : "s"}`}/>{liabilityAccounts.length ? liabilityAccounts.map((account: Account) => <div className="worth-row" key={account.id}><span className="worth-icon coral"><Icon name="card"/></span><div><strong>{account.name}</strong><small>{account.type} · •••• {account.digits}</small></div><strong>{money(Math.abs(account.balance))}</strong></div>) : <EmptyCompact icon="shield" title="No tracked liabilities" copy="Add a manual credit card or liability account to include it."/>}<footer><span>Total liabilities</span><strong>{money(liabilities)}</strong></footer></section>
    </div>
    <div className="data-disclosure"><Icon name="shield"/><p><b>Coverage note:</b> Unlinked assets and liabilities are excluded. Investment holdings are valued once from quantity × entered price and are not added again as an account balance. Values are estimates, not verified statements.</p></div>
  </>;
}

function CreditScore(props: any) {
  const [draft, setDraft] = useState(String(props.creditScore));
  const [expanded, setExpanded] = useState("Payment history");
  const history = [684, 691, 697, 704, 708, props.creditScore];
  const factors = [
    ["Payment history", "Largest influence", "Pay every bill by its due date. Autopay for the minimum plus a reminder to review the statement can help avoid misses."],
    ["Credit utilization", "Keep balances manageable", "Utilization compares card balances with credit limits. Paying down balances before the statement closes can lower the reported percentage."],
    ["Credit history", "Time builds context", "Keeping an older no-fee account open may preserve account age, but only if it remains easy to monitor responsibly."],
    ["Credit applications", "Apply intentionally", "Several hard inquiries in a short period may affect scores. Compare eligibility and fees before applying for new credit."],
  ];
  const save = () => {
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 300 || next > 850) { props.notify("Enter a sample score from 300 to 850."); return; }
    props.setCreditScore(next); props.setCreditUpdated("Updated manually today"); props.notify("Manual sample score updated.");
  };
  return <>
    <PageIntro eyebrow="FINANCIAL HEALTH · CREDIT" title="Build credit with context, not pressure." copy="Explore the habits that may influence a score and track a manual sample over time."/>
    <div className="credit-layout">
      <section className="credit-score-card">
        <span>SAMPLE CREDIT SCORE</span><div className="score-gauge" style={{ "--score": `${Math.max(0, Math.min((props.creditScore - 300) / 550 * 270, 270))}deg` } as React.CSSProperties}><div><strong>{props.creditScore}</strong><small>{props.creditScore >= 740 ? "Very good range" : props.creditScore >= 670 ? "Good range" : "Building range"}</small></div></div>
        <p>Credit reporting is <b>not connected</b>. This is manually entered prototype data, not a real credit report or lender decision.</p><small>Last updated: {props.creditUpdated}</small>
      </section>
      <section className="panel credit-history"><SectionTitle title="Score trend" subtitle="Six months of sample history"/><div className="credit-bars" aria-label="Sample credit score history">{history.map((score, index) => <button key={index} onClick={() => props.notify(`${["Oct","Nov","Dec","Jan","Feb","Mar"][index]} sample score: ${score}`)} aria-label={`${["Oct","Nov","Dec","Jan","Feb","Mar"][index]} sample score ${score}`}><i style={{height:`${Math.max(10,(score-600)/2.5)}%`}}></i><b>{score}</b><span>{["Oct","Nov","Dec","Jan","Feb","Mar"][index]}</span></button>)}</div><div className="manual-score"><div><strong>Update manual sample</strong><span>Enter a number from 300–850</span></div><input type="number" min="300" max="850" value={draft} onChange={event => setDraft(event.target.value)} aria-label="Manual sample credit score"/><Button onClick={save}>Save score</Button></div></section>
    </div>
    <section className="credit-education"><SectionTitle title="What can influence a credit score?" subtitle="Select a factor for practical, responsible next steps"/><div className="factor-grid">{factors.map(([title, label, copy]) => <button className={expanded === title ? "expanded" : ""} key={title} onClick={() => setExpanded(expanded === title ? "" : title)} aria-expanded={expanded === title}><span><Icon name={title === "Payment history" ? "calendar" : title === "Credit utilization" ? "card" : title === "Credit history" ? "trend" : "plus"}/></span><small>{label}</small><strong>{title}</strong><p>{copy}</p><b>{expanded === title ? "Hide guidance" : "Explore guidance"} <Icon name="chevron" size={14}/></b></button>)}</div></section>
    <div className="data-disclosure"><Icon name="shield"/><p>Educational content only. Score models differ, and building credit takes time. Current Campus does not access a credit bureau or guarantee score changes.</p></div>
  </>;
}

function Investments(props: any) {
  const [selectedAccount, setSelectedAccount] = useState("All accounts");
  const total = portfolioValue(props.holdings);
  const accounts = Array.from(new Set(props.holdings.map((holding: Holding) => holding.account))) as string[];
  const visible = props.holdings.filter((holding: Holding) => selectedAccount === "All accounts" || holding.account === selectedAccount);
  const allocation = [
    ["US stocks", props.holdings.filter((h: Holding) => h.ticker === "VTI").reduce((sum: number, h: Holding) => sum + h.quantity * h.price, 0), "purple"],
    ["International", props.holdings.filter((h: Holding) => h.ticker === "VXUS").reduce((sum: number, h: Holding) => sum + h.quantity * h.price, 0), "lime"],
    ["Bonds & other", props.holdings.filter((h: Holding) => !["VTI","VXUS"].includes(h.ticker)).reduce((sum: number, h: Holding) => sum + h.quantity * h.price, 0), "coral"],
  ] as [string, number, string][];
  return <>
    <PageIntro eyebrow="FINANCIAL HEALTH · INVESTMENTS" title="Learn what your portfolio holds." copy="Monitor simulated and manually entered investments without personalized buy or sell recommendations." action={<Button icon="plus" onClick={() => props.openModal("holding")}>Add holding</Button>}/>
    <div className="investment-summary">
      <div><span>ESTIMATED PORTFOLIO VALUE</span><strong>{money(total)}</strong><small><Icon name="trend" size={15}/> +{money(86.42)} simulated change this month</small></div>
      <div className="mini-history" aria-label="Simulated six month portfolio trend">{[42,48,51,58,70,76,88,84].map((height,index)=><button key={index} style={{height:`${height}%`}} onClick={()=>props.notify(`${["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"][index]} uses simulated historical portfolio data.`)} aria-label={`${["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"][index]} simulated portfolio point`}></button>)}</div>
    </div>
    <div className="investment-account-grid">{accounts.map(account => {const value=portfolioValue(props.holdings.filter((h:Holding)=>h.account===account));return <button className={selectedAccount===account?"selected":""} key={account} onClick={()=>setSelectedAccount(selectedAccount===account?"All accounts":account)}><span className="worth-icon purple"><Icon name="chart"/></span><div><small>{account === "Campus Roth IRA" ? "SIMULATED ACCOUNT" : "MANUAL ACCOUNT"}</small><strong>{account}</strong><span>{props.holdings.filter((h:Holding)=>h.account===account).length} holdings</span></div><b>{money(value)}</b><Icon name="chevron" size={16}/></button>})}</div>
    <div className="investments-layout">
      <section className="panel holdings-panel"><SectionTitle title="Holdings" subtitle={`${selectedAccount} · prices are simulated or manually entered`} action={selectedAccount !== "All accounts" ? <button className="text-link" onClick={()=>setSelectedAccount("All accounts")}>Clear filter</button> : undefined}/>{visible.length ? <div className="holdings-table"><div className="holdings-head"><span>Investment</span><span>Quantity</span><span>Price</span><span>Value</span><span>Actions</span></div>{visible.map((holding: Holding) => <div className="holding-row" key={holding.id}><span className="ticker">{holding.ticker}</span><div><strong>{holding.name}</strong><small>{holding.account} · {holding.source} value</small></div><span>{holding.quantity}</span><span>{money(holding.price)}</span><strong>{money(holding.quantity * holding.price)}</strong><div><button aria-label={`Edit ${holding.name}`} onClick={() => props.openModal("holding", holding)}><Icon name="edit" size={16}/></button><button aria-label={`Remove ${holding.name}`} onClick={() => props.confirmAction("Remove this holding?", `${holding.name} will be removed from your portfolio and net worth estimate.`, () => { props.setHoldings((items: Holding[]) => items.filter(item => item.id !== holding.id)); props.notify("Holding removed. Net worth updated."); })}><Icon name="trash" size={16}/></button></div></div>)}</div> : <EmptyCompact icon="chart" title="No holdings in this view" copy="Add an investment to start tracking its estimated value." action={<Button icon="plus" onClick={()=>props.openModal("holding")}>Add holding</Button>}/>}</section>
      <section className="panel allocation-card"><SectionTitle title="Asset allocation" subtitle="Estimated by current value"/><div className="allocation-donut" style={{"--stock": `${total ? allocation[0][1]/total*100 : 0}%`, "--international": `${total ? (allocation[0][1]+allocation[1][1])/total*100 : 0}%`} as React.CSSProperties}><div><strong>{money(total,0)}</strong><span>total</span></div></div>{allocation.map(([name,value,tone])=><button key={name} onClick={()=>props.notify(`${name}: ${money(value)} of the current estimated portfolio.`)}><i className={tone}></i><span>{name}</span><strong>{total?Math.round(value/total*100):0}%</strong><small>{money(value,0)}</small></button>)}</section>
    </div>
    <section className="panel activity-panel"><SectionTitle title="Investment activity" subtitle="Prototype history · not brokerage records"/>{props.investmentActivity.map((activity: InvestmentActivity)=><div className="investment-activity" key={activity.id}><span className="worth-icon"><Icon name={activity.action==="Dividend"?"trend":"plus"}/></span><div><strong>{activity.action} · {activity.holding}</strong><small>{activity.date} · Simulated activity</small></div><strong>{money(activity.amount)}</strong></div>)}</section>
    <div className="data-disclosure"><Icon name="shield"/><p>Values are simulated or manually entered and may be delayed or inaccurate. This tracker provides general education, not personalized investment advice or buy/sell instructions.</p></div>
  </>;
}

function Assistant(props: any) {
  type PlanItem = { name: string; type: "Essential" | "Flexible" | "Savings"; amount: number; selected: boolean };
  type GoalDraft = { name: string; target: number; saved: number; date: string; monthly: number };
  type TaxChecklistItem = { id: number; category: string; title: string; collected: boolean; note: string };
  const income = 2420;
  const activeBills = props.bills.filter((bill: Bill) => !bill.paused);
  const recurringTotal = activeBills.reduce((sum: number, bill: Bill) => sum + bill.amount, 0);
  const checkingBalance = props.accounts
    .filter((account: Account) => account.type === "Checking")
    .reduce((sum: number, account: Account) => sum + account.balance, 0);
  const safeThisWeek = Math.max(0, Math.min(128, (checkingBalance - recurringTotal - 500) / 4));
  const basePlan: PlanItem[] = [
    { name: "Rent", type: "Essential", amount: 780, selected: true },
    { name: "Required bills", type: "Essential", amount: Math.round(recurringTotal - 780), selected: true },
    { name: "Groceries", type: "Essential", amount: 280, selected: true },
    { name: "Transportation", type: "Essential", amount: 90, selected: true },
    { name: "Dining", type: "Flexible", amount: 160, selected: true },
    { name: "Entertainment", type: "Flexible", amount: 120, selected: true },
    { name: "Shopping", type: "Flexible", amount: 140, selected: true },
    { name: "Savings", type: "Savings", amount: 420, selected: true },
  ];
  const [messages, setMessages] = useState<{from:"ai"|"user"; text:string}[]>([
    {from:"ai",text:"Hey! Let’s make your money work for you. I can help you figure out what you can spend, build a savings plan, and make your next financial goal feel achievable."},
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [plan,setPlan]=useState<PlanItem[] | null>(null);
  const [planNote,setPlanNote]=useState("");
  const [goalDraft,setGoalDraft]=useState<GoalDraft | null>(null);
  const [applied,setApplied]=useState(false);
  const [expandedInsight,setExpandedInsight]=useState<number | null>(null);
  const [showReasoning,setShowReasoning]=useState(false);
  const [assistantMode,setAssistantMode]=useState<"Money"|"Tax">("Money");
  const [taxMessages,setTaxMessages]=useState<{from:"ai"|"user";text:string}[]>([{from:"ai",text:"Hi—Tax Help can explain common concepts, organize sample records, and help you prepare questions for a qualified tax professional. I can’t determine eligibility, file a return, or access tax records."}]);
  const [taxInput,setTaxInput]=useState("");
  const [taxLoading,setTaxLoading]=useState(false);
  const [taxContext,setTaxContext]=useState({year:"",jurisdiction:"",income:"",education:""});
  const [taxChecklist,setTaxChecklist]=useState<TaxChecklistItem[]>([
    {id:1,category:"Income",title:"Wage statements, such as Form W-2",collected:false,note:""},
    {id:2,category:"Education",title:"Tuition statement, such as Form 1098-T",collected:false,note:""},
    {id:3,category:"Banking",title:"Bank interest statements, such as Form 1099-INT",collected:false,note:""},
    {id:4,category:"Scholarships",title:"Scholarship or grant award letters",collected:false,note:""},
    {id:5,category:"Expenses",title:"Receipts for potentially relevant education expenses",collected:false,note:""},
    {id:6,category:"Other income",title:"Records for freelance, gig, or campus stipend income",collected:false,note:""},
  ]);
  const [taxReviewEnabled,setTaxReviewEnabled]=useState(false);
  const [taxLabelDrafts,setTaxLabelDrafts]=useState<Record<number,string>>({});
  const [taxLabels,setTaxLabels]=useState<Record<number,string>>({});
  const [taxReviewConfirmed,setTaxReviewConfirmed]=useState(false);
  const [expandedTaxTopic,setExpandedTaxTopic]=useState<number|null>(0);
  const [showTaxSummary,setShowTaxSummary]=useState(false);

  const planTotal = plan?.filter(item => item.selected).reduce((sum,item)=>sum+item.amount,0) || 0;
  const planRemaining = income - planTotal;
  const topGoal = props.goals[0] as Goal | undefined;
  const prompts = [
    "Help me build a monthly budget.",
    "Where is most of my money going?",
    "Help me save $1,000.",
    "Can I afford this purchase?",
    "Find subscriptions I could cut back on.",
    "How much money can I safely spend this week?",
  ];
  const taxPrompts = [
    "What tax documents might I need?",
    "How do scholarships and grants affect taxes?",
    "What is the difference between a tax credit and a tax deduction?",
    "What education-related tax benefits should I learn about?",
    "What records should I keep for tax time?",
    "Can you help me organize my income and expenses?",
  ];
  const taxTopics = [
    {title:"Scholarships and grants",label:"Qualified vs. nonqualified use",copy:"In the U.S., scholarship amounts used for qualified tuition and required course materials may be treated differently from amounts used for room, board, travel, or optional equipment. Rules depend on the award, degree status, and jurisdiction, so keep the award terms and school account statement."},
    {title:"Credits and deductions",label:"Two different mechanisms",copy:"A deduction generally reduces income used in a tax calculation. A credit generally reduces calculated tax, and some credits may have refundable portions. Limits, income rules, dependency status, and eligible expenses can change the result."},
    {title:"Education benefits",label:"Learn the names, then verify",copy:"U.S. students may hear about the American Opportunity Tax Credit, Lifetime Learning Credit, student loan interest deduction, and tax-free scholarship treatment. These have different eligibility rules and cannot always be combined for the same expense."},
    {title:"Recordkeeping",label:"Keep source documents together",copy:"Save forms, receipts, account statements, scholarship terms, and notes showing what an expense was for. A budgeting category alone is not evidence that an expense qualifies for tax treatment."},
  ];
  const insights = [
    {
      title: "Dining is close to its limit",
      impact: "$37 left",
      tone: "coral",
      evidence: `You’ve used ${Math.round((categorySpend(props.transactions,"Dining")+104)/160*100)}% of your $160 dining plan. That includes recorded dining plus an estimated $104 from this month’s demo summary.`,
      suggestion: "Try two at-home meals this week, or move money from entertainment if dining matters more.",
    },
    {
      title: "Subscriptions add up quietly",
      impact: `${money(activeBills.filter((b: Bill)=>b.name!=="Apartment Rent").reduce((s:number,b:Bill)=>s+b.amount,0))}/mo`,
      tone: "purple",
      evidence: `${activeBills.filter((b: Bill)=>b.name!=="Apartment Rent").length} active non-rent recurring payments are scheduled. This figure is calculated from your current demo bills.`,
      suggestion: "Review Adobe and Spotify first. Pause only what you are not actively using.",
    },
    {
      title: "Bills will tighten cash flow",
      impact: `${money(recurringTotal,0)} upcoming`,
      tone: "lime",
      evidence: `Your active recurring list includes ${activeBills.length} payments. After those charges, your checking balance is estimated at ${money(checkingBalance-recurringTotal)}.`,
      suggestion: "Keep a $500 checking buffer before making a larger optional purchase.",
    },
  ];

  const updatePlan = (name: string, amount: number) => {
    setPlan(items => items?.map(item => item.name === name ? {...item,amount:Math.max(0,amount)} : item) || null);
    setApplied(false);
  };
  const responseFor = (question: string) => {
    const lower = question.toLowerCase();
    const amounts = [...question.matchAll(/\$?(\d[\d,]*(?:\.\d{1,2})?)/g)].map(match=>Number(match[1].replace(",","")));
    let nextPlan: PlanItem[] | null = null;
    let nextGoal: GoalDraft | null = null;
    let response = "";
    let note = "";

    if (lower.includes("monthly budget") || lower.includes("spending plan") || lower.includes("weekly plan")) {
      nextPlan = basePlan;
      note = "A balanced starting point based on $2,420 monthly income, current budgets, and active recurring payments.";
      response = `Here’s a realistic starting plan. Essentials come first, flexible categories still leave room for student life, and $420 goes toward savings. The plan leaves about ${money(income-basePlan.reduce((s,i)=>s+i.amount,0),0)} as a cushion. You can edit any amount before applying it.`;
    } else if (lower.includes("save more")) {
      const current = plan || basePlan;
      nextPlan = current.map(item => item.name==="Savings" ? {...item,amount:item.amount+100} : item.name==="Entertainment" ? {...item,amount:Math.max(40,item.amount-50)} : item.name==="Dining" ? {...item,amount:Math.max(80,item.amount-50)} : item);
      note = "Moves $100 more to savings by splitting the trade-off between dining and entertainment.";
      response = "You can save $100 more each month without touching rent, groceries, transportation, or required bills. I reduced dining and entertainment by $50 each. If either feels too tight, edit the amounts before applying.";
    } else if (lower.includes("more money for groceries")) {
      const increase = amounts[0] || 50;
      const current = plan || basePlan;
      nextPlan = current.map(item => item.name==="Groceries" ? {...item,amount:item.amount+increase} : item.name==="Entertainment" ? {...item,amount:Math.max(30,item.amount-increase)} : item);
      note = `Adds ${money(increase,0)} to groceries and offsets it from entertainment, keeping required bills and savings intact.`;
      response = `Absolutely—groceries are an essential need, not a spending failure. I added ${money(increase,0)} there and reduced entertainment by the same amount so the total plan stays balanced.`;
    } else if (lower.includes("reduce") && lower.includes("entertainment")) {
      const reduction = amounts[0] || 40;
      const current = plan || basePlan;
      nextPlan = current.map(item => item.name==="Entertainment" ? {...item,amount:Math.max(0,item.amount-reduction)} : item.name==="Savings" ? {...item,amount:item.amount+reduction} : item);
      note = `Redirects ${money(reduction,0)} from entertainment into savings.`;
      response = `I reduced entertainment by ${money(reduction,0)} and directed the difference to savings. Your essentials and day-to-day food budget stay unchanged.`;
    } else if (lower.includes("unexpected") || lower.includes("expense")) {
      const expense = amounts[0] || 200;
      const current = plan || basePlan;
      nextPlan = current.map(item => item.name==="Shopping" ? {...item,amount:Math.max(20,item.amount-expense*.4)} : item.name==="Entertainment" ? {...item,amount:Math.max(20,item.amount-expense*.3)} : item.name==="Savings" ? {...item,amount:Math.max(100,item.amount-expense*.3)} : item);
      note = `Makes room for a one-time ${money(expense,0)} expense across flexible spending and this month’s savings—without changing essentials.`;
      response = `An unexpected ${money(expense,0)} expense is manageable. This option spreads the impact across shopping, entertainment, and this month’s savings rather than cutting groceries or risking a bill.`;
    } else if (lower.includes("rent") && (lower.includes("increase") || lower.includes("higher"))) {
      const increase = amounts[0] || 100;
      const current = plan || basePlan;
      nextPlan = current.map(item => item.name==="Rent" ? {...item,amount:item.amount+increase} : item.name==="Shopping" ? {...item,amount:Math.max(30,item.amount-50)} : item.name==="Entertainment" ? {...item,amount:Math.max(40,item.amount-50)} : item);
      note = `Models a ${money(increase,0)} rent increase by reducing shopping and entertainment first.`;
      response = `If rent rises by ${money(increase,0)}, your essential costs increase before anything else. This version trims shopping and entertainment by $50 each. It preserves groceries and savings, but you can choose a different trade-off.`;
    } else if (lower.includes("laptop") || lower.includes("car") || lower.includes("apartment") || lower.includes("emergency fund") || lower.includes("vacation") || lower.includes("save $") || lower.includes("save for")) {
      const existingLaptop = props.goals.find((goal: Goal)=>goal.name.toLowerCase().includes("macbook"));
      const target = amounts[0] || (lower.includes("laptop") ? existingLaptop?.target || 1600 : lower.includes("car") ? 5000 : 1000);
      const saved = lower.includes("current") && amounts[1] ? amounts[1] : lower.includes("laptop") ? existingLaptop?.saved || 0 : 0;
      const months = lower.includes("december") ? 9 : 8;
      const name = lower.includes("laptop") ? "Laptop fund" : lower.includes("car") ? "Car fund" : lower.includes("apartment") ? "Apartment deposit" : lower.includes("emergency") ? "Emergency fund" : lower.includes("vacation") ? "Vacation fund" : `${money(target,0)} savings goal`;
      nextGoal = {name,target,saved,date:lower.includes("december")?"December 2025":"November 2025",monthly:Math.ceil((target-saved)/months)};
      response = `To reach ${money(target,0)} by ${lower.includes("december")?"December":"November"}, you’d need about ${money(Math.ceil((target-saved)/months),0)} per month. That assumes ${money(saved,0)} already saved and no investment growth. Edit the assumptions below to explore a pace that works for you.`;
    } else if (lower.includes("where") && lower.includes("money")) {
      response = `Housing is your largest cost at $780, about ${Math.round(780/props.monthSpent*100)}% of this month’s estimated spending. Food is next: groceries and dining total ${money(categorySpend(props.transactions,"Groceries")+categorySpend(props.transactions,"Dining")+104)} in the demo activity. Open the insight cards above to see what is calculated versus estimated.`;
    } else if (lower.includes("subscription")) {
      const subscriptions = activeBills.filter((bill: Bill)=>bill.name!=="Apartment Rent");
      const total = subscriptions.reduce((sum:number,bill:Bill)=>sum+bill.amount,0);
      response = `You have ${subscriptions.length} active non-rent recurring payments totaling ${money(total)} per month, or about ${money(total*12,0)} per year. Adobe is the largest at $19.99. I’d check whether you used it recently before pausing it—its category alone doesn’t make it unnecessary.`;
    } else if (lower.includes("credit") || lower.includes("loan") || lower.includes("down payment")) {
      response = "A credit score is one input—not a guarantee of approval or affordability. Lenders may also consider income, debt, down payment, payment history, and loan terms. Compare the full monthly payment, interest, insurance, and fees against your budget before deciding.";
    } else if (lower.includes("afford") || lower.includes("purchase")) {
      if (!amounts[0]) {
        response = `I can help you test it. What does the purchase cost, is it a need or a want, and when would you need to pay? Right now, I estimate ${money(safeThisWeek,0)} is safe for optional spending this week while preserving upcoming bills and a $500 checking buffer.`;
      } else {
        const cost = amounts[0];
        response = cost <= safeThisWeek
          ? `A ${money(cost,0)} purchase fits inside this week’s estimated ${money(safeThisWeek,0)} flexible amount, leaving ${money(safeThisWeek-cost,0)}. That assumes no unlisted cash expenses before your next income.`
          : `A ${money(cost,0)} purchase is ${money(cost-safeThisWeek,0)} above this week’s estimated flexible amount. Waiting, splitting the cost across months, or intentionally moving money from another flexible category would reduce the risk of dipping into bill money.`;
      }
    } else if (lower.includes("safe") || lower.includes("this week")) {
      response = `I estimate you can safely spend ${money(safeThisWeek,0)} on flexible purchases this week. I started with your ${money(checkingBalance)} checking balance, reserved ${money(recurringTotal)} for active recurring payments and a $500 buffer, then limited the result to your current monthly budget pace. This is an estimate because cash or unrecorded expenses may not be included.`;
    } else {
      response = "I can work through that with you. Tell me the amount, timing, and whether it’s required or flexible. I’ll show the trade-offs using your current income, bills, budgets, and goals—and nothing changes until you approve it.";
    }
    return {response,nextPlan,nextGoal,note};
  };
  const ask=(text:string)=>{
    if(!text.trim() || loading) return;
    setMessages(current=>[...current,{from:"user",text}]);
    setInput("");
    setLoading(true);
    window.setTimeout(()=>{
      const result=responseFor(text);
      setMessages(current=>[...current,{from:"ai",text:result.response}]);
      if(result.nextPlan){setPlan(result.nextPlan);setPlanNote(result.note);setGoalDraft(null);setApplied(false);}
      if(result.nextGoal){setGoalDraft(result.nextGoal);setPlan(null);setApplied(false);}
      setLoading(false);
    },650);
  };
  const applyChanges=()=>{
    if(plan){
      const categoryItems=plan.filter(item=>item.selected && !["Required bills"].includes(item.name));
      props.setBudgets((current:Budget[])=>{
        const next=current.map(budget=>{
          const match=categoryItems.find(item=>item.name===budget.category);
          return match?{...budget,limit:match.amount}:budget;
        });
        categoryItems.forEach(item=>{
          if(!next.some((budget:Budget)=>budget.category===item.name)){
            next.push({id:Date.now()+next.length,category:item.name,limit:item.amount,color:categoryColors[item.name]||"#b8f05a"});
          }
        });
        return next;
      });
    }
    if(goalDraft){
      props.setGoals((current:Goal[])=>{
        const existing=current.find(goal=>goal.name.toLowerCase().includes(goalDraft.name.split(" ")[0].toLowerCase()));
        return existing
          ? current.map(goal=>goal.id===existing.id?{...goal,target:goalDraft.target,saved:goalDraft.saved,date:goalDraft.date}:goal)
          : [...current,{id:Date.now(),name:goalDraft.name,target:goalDraft.target,saved:goalDraft.saved,date:goalDraft.date,color:"purple"}];
      });
    }
    setApplied(true);
    props.notify("Nova’s changes were applied to your financial plan.");
    setMessages(current=>[...current,{from:"ai",text:"Done—your approved changes are now reflected in the app. You’re still in control, and you can edit them anytime from Budgets or Savings Goals."}]);
  };

  const taxContextComplete=Boolean(taxContext.year&&taxContext.jurisdiction&&taxContext.income&&taxContext.education);
  const taxChecklistDone=taxChecklist.filter(item=>item.collected).length;
  const taxResponseFor=(question:string)=>{
    const lower=question.toLowerCase();
    const asksSpecific=/\b(my|eligible|refund|owe|estimate|how much|calculate)\b/.test(lower);
    if(asksSpecific&&!taxContextComplete){
      return "Before I get more specific, please choose a tax year, jurisdiction, income type, and education-expense context above. I can then explain which assumptions matter, but I still won’t determine eligibility or guarantee a result.";
    }
    const contextNote=taxContextComplete?` For context, you selected ${taxContext.year}, ${taxContext.jurisdiction}, ${taxContext.income}, and ${taxContext.education}.`:"";
    if(lower.includes("document")||lower.includes("forms")){
      return `A student might receive a wage statement such as a W-2, a tuition statement such as a 1098-T, bank-interest forms such as a 1099-INT, scholarship award records, and forms for freelance or stipend income. Not everyone receives every form. Compare the checklist with your school portal, employers, banks, and any income platforms.${contextNote}`;
    }
    if(lower.includes("scholarship")||lower.includes("grant")){
      return `Scholarships and grants are not automatically all taxable or all tax-free. In the U.S., how funds were used—such as required tuition versus room and board—can matter, along with degree status and award terms. Keep the award letter and school billing statement, and ask a qualified professional how the rules apply to your situation.${contextNote}`;
    }
    if(lower.includes("credit")&&lower.includes("deduction")){
      return `A deduction generally reduces the income used in a tax calculation. A credit generally reduces calculated tax, and some credits may have refundable portions. That does not mean a credit always creates a refund: eligibility, limits, tax owed, dependency status, and other rules still matter.${contextNote}`;
    }
    if(lower.includes("education")&&(lower.includes("benefit")||lower.includes("credit"))){
      return `Common U.S. topics to learn about include the American Opportunity Tax Credit, Lifetime Learning Credit, student-loan interest deduction, and tax treatment of scholarships. Each has different rules, and the same expense generally cannot be used for multiple benefits. Treat these as research topics, not a conclusion that you qualify.${contextNote}`;
    }
    if(lower.includes("record")||lower.includes("keep")){
      return "Keep source documents, receipts, school account statements, scholarship terms, bank statements, and notes about what each expense was for. A budgeting category like “Tuition” does not prove tax eligibility. Retention periods vary, so confirm the right timeline for your jurisdiction and circumstances.";
    }
    if(lower.includes("organize")||lower.includes("income")||lower.includes("expense")){
      return `Start with income forms, then education forms, bank statements, scholarship records, and receipts. You can open the transaction review below to apply separate organizational labels. Those labels are suggestions only, require your review before saving, and never change budget categories.${contextNote}`;
    }
    if(lower.includes("refund")||lower.includes("owe")||lower.includes("estimate")){
      return `I can explain inputs that may affect an estimate, but I cannot guarantee a refund or calculate a reliable result from this prototype. Missing withholding, dependency status, filing status, other income, jurisdiction rules, and eligible expenses could materially change an outcome.${contextNote}`;
    }
    return `I can help break that into plain-language questions. Tell me whether you are asking about a document, income source, scholarship, education expense, or tax concept. For situation-specific guidance, complete the context fields first and bring the resulting questions to a qualified tax professional.${contextNote}`;
  };
  const askTax=(text:string)=>{
    if(!text.trim()||taxLoading)return;
    setTaxMessages(current=>[...current,{from:"user",text}]);setTaxInput("");setTaxLoading(true);
    window.setTimeout(()=>{setTaxMessages(current=>[...current,{from:"ai",text:taxResponseFor(text)}]);setTaxLoading(false);},600);
  };
  const saveTaxLabels=()=>{
    if(!taxReviewConfirmed){props.notify("Confirm that you reviewed the suggested labels before saving.");return;}
    setTaxLabels({...taxLabelDrafts});props.notify("Tax-organizing labels saved separately from budget categories.");
  };
  const clearTaxWorkspace=()=>{
    setTaxMessages([{from:"ai",text:"Tax Help is ready for a fresh start. I can explain concepts and help organize sample records without requesting sensitive identifiers."}]);
    setTaxChecklist(items=>items.map(item=>({...item,collected:false,note:""})));setTaxLabelDrafts({});setTaxLabels({});setTaxReviewConfirmed(false);setShowTaxSummary(false);setTaxContext({year:"",jurisdiction:"",income:"",education:""});
  };

  if(assistantMode==="Tax"){
    const taxQuestions=taxMessages.filter(message=>message.from==="user").map(message=>message.text);
    const outstanding=taxChecklist.filter(item=>!item.collected);
    return <div className="assistant-page tax-assistant-page">
      <div className="assistant-header tax-header">
        <div className="assistant-welcome"><div className="nova large tax-orb"><Icon name="receipt" size={27}/></div><div><span>NOVA · TAX HELP</span><h1>Organize tax questions without the jargon.</h1><p>Learn common concepts, prepare records, and build a question list for a qualified tax professional.</p></div></div>
        <button className="mode-switch" onClick={()=>setAssistantMode("Money")}><Icon name="arrow" size={16}/> Back to money coach</button>
      </div>
      <div className="assistant-content tax-content">
        <section className="tax-boundary"><Icon name="shield"/><div><strong>Educational organization only</strong><span>This prototype does not access tax records, determine eligibility, file returns, submit payments, or request tax identification numbers.</span></div><b>SAMPLE DATA</b></section>
        <section className="panel tax-context-card"><div className="tax-section-heading"><div><span>STEP 1 · CONTEXT</span><h2>Tell Nova what rules and records may be relevant</h2><p>Complete these before asking for situation-specific guidance. Avoid entering sensitive identifiers.</p></div><small>{taxContextComplete?"Context ready":"General guidance only until complete"}</small></div><div className="tax-context-grid"><label>Tax year<select value={taxContext.year} onChange={event=>setTaxContext({...taxContext,year:event.target.value})}><option value="">Choose a year</option><option>2024</option><option>2025</option></select></label><label>Jurisdiction<select value={taxContext.jurisdiction} onChange={event=>setTaxContext({...taxContext,jurisdiction:event.target.value})}><option value="">Choose a location</option><option>United States — federal</option><option>United States — federal + California</option><option>United States — federal + New York</option><option>Outside the United States / not sure</option></select></label><label>Income involved<select value={taxContext.income} onChange={event=>setTaxContext({...taxContext,income:event.target.value})}><option value="">Choose an income type</option><option>W-2 wages</option><option>W-2 wages + scholarship</option><option>Freelance or gig income</option><option>Campus stipend or multiple income types</option></select></label><label>Education expenses<select value={taxContext.education} onChange={event=>setTaxContext({...taxContext,education:event.target.value})}><option value="">Choose a context</option><option>Tuition and required course materials</option><option>Scholarship used for tuition and living costs</option><option>Student loan interest</option><option>No education expenses / not sure</option></select></label></div></section>
        <div className="tax-layout">
          <aside className="tax-sidebar">
            <section className="panel tax-checklist"><div className="tax-card-head"><div><span>STEP 2 · CHECKLIST</span><strong>Prepare your records</strong></div><b>{taxChecklistDone}/{taxChecklist.length}</b></div><div className="progress"><i style={{width:`${taxChecklist.length?taxChecklistDone/taxChecklist.length*100:0}%`}}></i></div><p>General organizational aid only. Some items may not apply, and other documents may be required.</p>{taxChecklist.map(item=><div className={`tax-check-item ${item.collected?"complete":""}`} key={item.id}><button onClick={()=>setTaxChecklist(items=>items.map(entry=>entry.id===item.id?{...entry,collected:!entry.collected}:entry))} aria-label={`${item.collected?"Mark missing":"Mark collected"} ${item.title}`}><i>{item.collected&&<Icon name="check" size={13}/>}</i><span><small>{item.category}</small><strong>{item.title}</strong></span></button><input value={item.note} onChange={event=>setTaxChecklist(items=>items.map(entry=>entry.id===item.id?{...entry,note:event.target.value}:entry))} placeholder="Add a note, source, or question" aria-label={`Note for ${item.title}`}/></div>)}</section>
            <section className="panel tax-privacy-card"><div className="tax-card-head"><div><span>PRIVACY</span><strong>Transaction access</strong></div><Icon name="shield" size={18}/></div><p>Tax Help does not inspect transactions unless you open the local review. Never enter Social Security numbers, tax IDs, passwords, or full account numbers.</p><button className={`privacy-toggle ${taxReviewEnabled?"on":""}`} onClick={()=>setTaxReviewEnabled(!taxReviewEnabled)} aria-pressed={taxReviewEnabled}><i></i><span>{taxReviewEnabled?"Transaction review visible":"Transaction review hidden"}</span></button><Button variant="ghost" onClick={()=>props.confirmAction("Clear Tax Help workspace?","Checklist progress, notes, tax labels, context, and the tax conversation will reset. Your financial data will not change.",clearTaxWorkspace)}>Clear tax workspace</Button></section>
          </aside>
          <main className="tax-main">
            <section className="chat-panel tax-chat-panel">
              <div className="chat-panel-head"><div><span>DEDICATED TAX CONVERSATION</span><strong>Ask Nova Tax Help</strong></div><button onClick={()=>setTaxMessages([{from:"ai",text:"Fresh start. Ask a general tax question, or complete your context for more tailored educational guidance."}])}>Start over</button></div>
              <div className="messages">{taxMessages.map((message,index)=><div className={`message ${message.from}`} key={index}>{message.from==="ai"&&<div className="nova tax-mini"><Icon name="receipt" size={15}/></div>}<div>{message.text}</div></div>)}{taxLoading&&<div className="message ai loading-message"><div className="nova tax-mini"><Icon name="receipt" size={15}/></div><div><i></i><i></i><i></i><span>Preparing a plain-language explanation</span></div></div>}</div>
              <div className="suggestions tax-suggestions">{taxPrompts.map(prompt=><button key={prompt} onClick={()=>askTax(prompt)} disabled={taxLoading}>{prompt}</button>)}</div>
              <form className="chat-input" onSubmit={event=>{event.preventDefault();askTax(taxInput)}}><div><Icon name="receipt" size={18}/><input value={taxInput} onChange={event=>setTaxInput(event.target.value)} placeholder="Ask a follow-up about documents, scholarships, or education benefits"/></div><button aria-label="Send tax question" type="submit" disabled={taxLoading||!taxInput.trim()}><Icon name="send"/></button></form>
              <small className="ai-disclaimer">General educational information only. Nova cannot guarantee a refund, determine eligibility, or replace a qualified tax professional.</small>
            </section>
            <section className="tax-explainers"><div className="tax-section-heading compact"><div><span>EXPLORE CONCEPTS</span><h2>Plain-language tax topics</h2></div></div>{taxTopics.map((topic,index)=><article className={expandedTaxTopic===index?"expanded":""} key={topic.title}><button onClick={()=>setExpandedTaxTopic(expandedTaxTopic===index?null:index)} aria-expanded={expandedTaxTopic===index}><span><small>{topic.label}</small><strong>{topic.title}</strong></span><Icon name="chevron" size={16}/></button>{expandedTaxTopic===index&&<p>{topic.copy}</p>}</article>)}</section>
          </main>
        </div>
        {taxReviewEnabled&&<section className="panel tax-transaction-review"><div className="tax-section-heading"><div><span>STEP 3 · OPTIONAL REVIEW</span><h2>Organize potentially relevant transaction records</h2><p>Suggestions are not deductions. Eligibility depends on facts, documentation, and applicable rules.</p></div><small>{Object.keys(taxLabels).length} labels saved</small></div><div className="tax-review-table"><div className="tax-review-head"><span>Transaction</span><span>Budget category</span><span>Suggested organization</span><span>Your reviewed label</span></div>{props.transactions.slice(0,7).map((transaction:Transaction)=>{const suggestion=transaction.category==="Income"?"Income record":transaction.category==="Tuition"?"Education record":transaction.category==="Subscriptions"?"Review only":"General record";return <div className="tax-review-row" key={transaction.id}><div><span className="merchant-icon">{transaction.icon}</span><span><strong>{transaction.merchant}</strong><small>{transaction.date} · {money(Math.abs(transaction.amount))}</small></span></div><span>{transaction.category}</span><span><b>{suggestion}</b><small>Not a tax conclusion</small></span><select value={taxLabelDrafts[transaction.id]||"Unreviewed"} onChange={event=>{setTaxLabelDrafts({...taxLabelDrafts,[transaction.id]:event.target.value});setTaxReviewConfirmed(false)}} aria-label={`Tax organization label for ${transaction.merchant}`}><option>Unreviewed</option><option>Income record</option><option>Education record</option><option>Potential expense record</option><option>General record</option><option>Not relevant for my organizer</option></select></div>})}</div><div className="tax-review-actions"><label><input type="checkbox" checked={taxReviewConfirmed} onChange={event=>setTaxReviewConfirmed(event.target.checked)}/><span>I reviewed these organizational labels. I understand they do not determine deductibility or eligibility.</span></label><Button onClick={saveTaxLabels} disabled={!taxReviewConfirmed}>Save reviewed labels</Button></div></section>}
        <section className="tax-summary-action"><div><span>STEP 4 · PREPARE</span><strong>Turn your progress into a conversation starter</strong><p>Summarize collected documents, sample transaction labels, context, and questions to discuss with a qualified professional.</p></div><Button icon="receipt" onClick={()=>setShowTaxSummary(true)}>Summarize my preparation</Button></section>
        {showTaxSummary&&<section className="panel tax-summary-card"><div className="tax-card-head"><div><span>PREPARATION SUMMARY · SAMPLE</span><strong>Tax organizer for {taxContext.year||"year not selected"}</strong></div><button onClick={()=>setShowTaxSummary(false)}>Hide summary</button></div><div className="tax-summary-grid"><div><small>Context</small><strong>{taxContext.jurisdiction||"Jurisdiction not selected"}</strong><span>{taxContext.income||"Income type not selected"} · {taxContext.education||"Education context not selected"}</span></div><div><small>Documents collected</small><strong>{taxChecklistDone} of {taxChecklist.length}</strong><span>{taxChecklist.filter(item=>item.collected).map(item=>item.category).join(", ")||"No items marked collected yet"}</span></div><div><small>Saved transaction labels</small><strong>{Object.values(taxLabels).filter(label=>label!=="Unreviewed").length}</strong><span>Separate from budgeting categories</span></div></div><div className="tax-summary-lists"><div><strong>Still outstanding</strong>{outstanding.length?<ul>{outstanding.map(item=><li key={item.id}>{item.title}{item.note?` — ${item.note}`:""}</li>)}</ul>:<p>All checklist items are marked collected. Confirm whether any other forms apply.</p>}</div><div><strong>Questions you asked</strong>{taxQuestions.length?<ul>{taxQuestions.slice(-5).map((question,index)=><li key={index}>{question}</li>)}</ul>:<p>No questions captured yet. Use a suggestion above to start.</p>}</div></div><div className="data-disclosure"><Icon name="shield"/><p>This summary is a general organizational aid based on local prototype inputs. Review it for accuracy and bring questions—not assumptions—to a qualified tax professional.</p></div></section>}
      </div>
    </div>;
  }

  return <div className="assistant-page">
    <div className="assistant-header">
      <div className="assistant-welcome">
        <div className="nova large"><Icon name="spark" size={28}/></div>
        <div><span>YOUR AI MONEY COACH</span><h1>Hey {props.profile.name}, let’s make your money work for you.</h1><p>I can help you decide what’s safe to spend, build a realistic plan, and make your next goal feel achievable.</p></div>
      </div>
      <div className="assistant-header-actions"><button className="mode-switch tax-entry" onClick={()=>setAssistantMode("Tax")}><Icon name="receipt" size={16}/> Tax Help</button><div className="online"><i></i> Using your demo finances</div></div>
    </div>
    <div className="assistant-content">
      <section className="insight-strip">
        <div className="insight-strip-title"><div><span>PROACTIVE INSIGHTS</span><h2>Worth a closer look</h2></div><small>Calculated from current demo activity</small></div>
        <div className="insight-card-grid">{insights.map((insight,index)=><article className={`coach-insight ${insight.tone} ${expandedInsight===index?"expanded":""}`} key={insight.title}>
          <button onClick={()=>setExpandedInsight(expandedInsight===index?null:index)}>
            <i><Icon name={index===0?"receipt":index===1?"repeat":"calendar"}/></i><span><small>{insight.impact}</small><strong>{insight.title}</strong></span><Icon name="chevron" size={16}/>
          </button>
          {expandedInsight===index&&<div className="insight-detail"><p><b>Evidence:</b> {insight.evidence}</p><p><b>Try this:</b> {insight.suggestion}</p></div>}
        </article>)}</div>
      </section>
      <div className="assistant-layout">
        <aside className="coach-sidebar">
          <section className="coach-snapshot"><div className="coach-card-title"><span>YOUR SNAPSHOT</span><button onClick={()=>props.navigate("Dashboard")}>View dashboard</button></div><div className="snapshot-primary"><small>Safe this week <b>ESTIMATE</b></small><strong>{money(safeThisWeek,0)}</strong><span>After upcoming bills + $500 buffer</span></div><div className="snapshot-grid"><div><small>Income</small><strong>{money(income,0)}</strong></div><div><small>Active bills</small><strong>{money(recurringTotal,0)}</strong></div></div></section>
          <section className="goal-summary"><div className="coach-card-title"><span>YOUR GOALS</span><button onClick={()=>props.navigate("Savings Goals")}>View all</button></div>{props.goals.length?props.goals.slice(0,3).map((goal:Goal)=>{const pct=Math.round(goal.saved/goal.target*100);return <div className="coach-goal" key={goal.id}><div><strong>{goal.name}</strong><span>{pct}%</span></div><div className="progress"><i style={{width:`${Math.min(pct,100)}%`}}></i></div><small>{money(goal.saved,0)} of {money(goal.target,0)}</small></div>}):<EmptyCompact icon="target" title="No goals yet" copy="Create one to get personalized planning."/>}{topGoal&&<button className="goal-chat-button" onClick={()=>ask(`Help me plan for ${topGoal.name}`)}><Icon name="spark" size={15}/> Plan my top goal</button>}</section>
          <div className="privacy-note"><Icon name="shield"/><span>Nova uses only this prototype’s demo data. You approve every plan change.</span></div>
        </aside>
        <section className="chat-panel">
          <div className="chat-panel-head"><div><span>CONVERSATION</span><strong>Plan with Nova</strong></div><button onClick={()=>{setMessages([{from:"ai",text:"Fresh start. What money question should we work through?"}]);setPlan(null);setGoalDraft(null);setApplied(false)}}>Start over</button></div>
          <div className="messages">{messages.map((message,index)=><div className={`message ${message.from}`} key={index}>{message.from==="ai"&&<div className="nova"><Icon name="spark" size={16}/></div>}<div>{message.text}</div></div>)}{loading&&<div className="message ai loading-message"><div className="nova"><Icon name="spark" size={16}/></div><div><i></i><i></i><i></i><span>Reviewing your numbers</span></div></div>}</div>
          {plan&&<section className="plan-card">
            <div className="plan-card-head"><div><span>EDITABLE MONTHLY PLAN</span><h3>Your recommended plan</h3><p>{planNote}</p></div><div className={planRemaining<0?"negative":""}><small>Left after plan</small><strong>{money(planRemaining,0)}</strong></div></div>
            <div className="plan-summary"><div><span>Monthly income</span><strong>{money(income,0)}</strong></div>{(["Essential","Flexible","Savings"] as const).map(type=><div key={type}><span>{type}</span><strong>{money(plan.filter(item=>item.type===type&&item.selected).reduce((sum,item)=>sum+item.amount,0),0)}</strong></div>)}</div>
            <div className="plan-items">{plan.map(item=><label className={`plan-item ${!item.selected?"excluded":""}`} key={item.name}><input type="checkbox" checked={item.selected} onChange={()=>{setPlan(current=>current?.map(row=>row.name===item.name?{...row,selected:!row.selected}:row)||null);setApplied(false)}}/><i className={item.type.toLowerCase()}></i><span><strong>{item.name}</strong><small>{item.type}</small></span><div className="plan-amount"><b>$</b><input aria-label={`${item.name} monthly amount`} type="number" min="0" value={item.amount} onChange={event=>updatePlan(item.name,Number(event.target.value))}/></div></label>)}</div>
            {planRemaining<0&&<div className="plan-warning">This version is {money(Math.abs(planRemaining),0)} over monthly income. Reduce a flexible amount before applying.</div>}
            <button className="reasoning-toggle" onClick={()=>setShowReasoning(!showReasoning)}>{showReasoning?"Hide":"Show"} how Nova calculated this <Icon name="chevron" size={15}/></button>
            {showReasoning&&<div className="plan-reasoning"><p><b>1. Protect obligations:</b> Rent and active recurring bills are included first.</p><p><b>2. Cover everyday needs:</b> Groceries and transit use your current budget limits.</p><p><b>3. Balance life and goals:</b> Flexible spending remains available while savings gets a dedicated amount.</p><p>Figures are estimates based on current demo data; unrecorded cash expenses are not included.</p></div>}
            <div className="plan-actions"><span>{applied?<><Icon name="check" size={16}/> Changes applied</>:<>Nothing updates until you approve.</>}</span><Button onClick={applyChanges} disabled={planRemaining<0||applied}>{applied?"Plan applied":"Apply changes to budget"}</Button></div>
          </section>}
          {goalDraft&&<section className="plan-card goal-explorer">
            <div className="plan-card-head"><div><span>FINANCIAL GOAL EXPLORER</span><h3>{goalDraft.name}</h3><p>Adjust the assumptions to explore a comfortable timeline.</p></div><div><small>Suggested monthly</small><strong>{money(goalDraft.monthly,0)}</strong></div></div>
            <div className="goal-editor"><label>Target cost<div><span>$</span><input type="number" value={goalDraft.target} onChange={event=>{const target=Number(event.target.value);setGoalDraft({...goalDraft,target,monthly:Math.ceil((target-goalDraft.saved)/8)});setApplied(false)}}/></div></label><label>Already saved<div><span>$</span><input type="number" value={goalDraft.saved} onChange={event=>{const saved=Number(event.target.value);setGoalDraft({...goalDraft,saved,monthly:Math.ceil((goalDraft.target-saved)/8)});setApplied(false)}}/></div></label><label>Target date<input value={goalDraft.date} onChange={event=>{setGoalDraft({...goalDraft,date:event.target.value});setApplied(false)}}/></label></div>
            <div className="goal-forecast"><div><span>Current progress</span><strong>{Math.max(0,Math.round(goalDraft.saved/goalDraft.target*100))}%</strong></div><div className="progress"><i style={{width:`${Math.max(0,Math.min(goalDraft.saved/goalDraft.target*100,100))}%`}}></i></div><p>At {money(goalDraft.monthly,0)} per month, this goal uses {Math.round(goalDraft.monthly/income*100)}% of monthly income. Extending the date would lower the contribution; reaching it sooner would require a larger trade-off elsewhere.</p></div>
            <div className="plan-actions"><span>{applied?<><Icon name="check" size={16}/> Goal applied</>:<>Educational estimate—no return or loan approval is assumed.</>}</span><Button onClick={applyChanges} disabled={applied}>{applied?"Goal applied":"Apply goal to savings"}</Button></div>
          </section>}
          {!plan&&!goalDraft&&messages.length===1&&<div className="chat-empty"><Icon name="spark" size={24}/><strong>What can we figure out together?</strong><span>Choose a starting point or ask in your own words.</span></div>}
          <div className="suggestions">{prompts.map(prompt=><button key={prompt} onClick={()=>ask(prompt)} disabled={loading}>{prompt}</button>)}</div>
          <form className="chat-input" onSubmit={event=>{event.preventDefault();ask(input)}}><div><Icon name="spark" size={18}/><input value={input} onChange={event=>setInput(event.target.value)} placeholder="Try “I need $50 more for groceries”"/></div><button aria-label="Send message" type="submit" disabled={loading||!input.trim()}><Icon name="send"/></button></form>
          <small className="ai-disclaimer">Nova provides educational guidance, not professional financial advice. Estimates may not include unrecorded expenses.</small>
        </section>
      </div>
    </div>
  </div>;
}

function Reports(props:any) {
  const [range,setRange]=useState("6 months");
  const [selectedMonth,setSelectedMonth]=useState(11);
  const months=["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const recordedIncome=props.transactions.filter((transaction:Transaction)=>transaction.amount>0&&["Posted","Pending"].includes(transaction.status)).reduce((sum:number,transaction:Transaction)=>sum+transaction.amount,0);
  const data=[
    {income:2180,expense:1760},{income:2320,expense:1840},{income:2050,expense:1960},{income:2280,expense:1710},
    {income:2350,expense:1880},{income:2260,expense:1930},{income:2420,expense:1740},{income:2380,expense:1890},
    {income:2510,expense:2140},{income:2320,expense:1810},{income:2240,expense:1965},{income:recordedIncome||2420,expense:props.monthSpent},
  ];
  const start=range==="6 months"?6:0;
  const visible=data.slice(start);
  const selected=data[selectedMonth];
  const previous=data[Math.max(0,selectedMonth-1)];
  const spendingChange=previous.expense?(selected.expense-previous.expense)/previous.expense*100:0;
  const reportIncome=selected.income;
  const reportExpenses=selected.expense;
  const currentCategories=[
    {name:"Housing",value:props.bills.find((bill:Bill)=>bill.name.toLowerCase().includes("rent"))?.amount||0,previous:780},
    {name:"Food & dining",value:categorySpend(props.transactions,"Groceries")+categorySpend(props.transactions,"Dining"),previous:356},
    {name:"Shopping",value:categorySpend(props.transactions,"Shopping"),previous:204},
    {name:"Transport",value:categorySpend(props.transactions,"Transportation"),previous:68},
  ].sort((a,b)=>Math.abs(b.value-b.previous)-Math.abs(a.value-a.previous));
  const representedSpending=currentCategories.reduce((sum,category)=>sum+category.value,0);
  const breakdownCategories=[...currentCategories.map(category=>({name:category.name,value:category.value})),{name:"Other",value:Math.max(0,props.monthSpent-representedSpending)}];
  const breakdownTotal=props.monthSpent;
  const exportCsv=()=>{
    const csv=["Description,Date,Amount,Category,Account,Status",...props.transactions.map((t:Transaction)=>`${t.merchant},${t.date},${t.amount},${t.category},${t.account},${t.status}`)].join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const a=document.createElement("a");a.href=url;a.download="current-campus-transactions.csv";a.click();URL.revokeObjectURL(url);props.notify("CSV export downloaded.");
  };
  return <>
    <PageIntro eyebrow="ZOOM OUT" title="Your progress, in perspective." copy="Spot patterns, celebrate wins, and make your next move." action={<div className="action-pair"><Button variant="secondary" icon="download" onClick={()=>window.print()}>Export PDF</Button><Button icon="download" onClick={exportCsv}>Export CSV</Button></div>}/>
    <div className="toolbar"><div className="segmented">{["6 months","12 months"].map(option=><button key={option} className={range===option?"active":""} onClick={()=>{setRange(option);if(option==="6 months"&&selectedMonth<6)setSelectedMonth(6)}}>{option}</button>)}</div><button className="month-picker" onClick={()=>props.notify("March expenses update from current transactions and active rent; earlier months are prototype estimates.")}><Icon name="calendar"/> Monthly comparison <Icon name="chevron"/></button></div>
    <div className="report-kpis"><div><span>{months[selectedMonth]} income</span><strong>{money(reportIncome,0)}</strong><small>{selectedMonth===11?"Recorded income in current activity":"Prototype estimate"}</small></div><div><span>{months[selectedMonth]} expenses</span><strong>{money(reportExpenses,0)}</strong><small className={spendingChange>0?"negative-note":""}>{spendingChange>0?"+":""}{spendingChange.toFixed(1)}% vs {months[Math.max(0,selectedMonth-1)]}</small></div><div><span>Income minus expenses</span><strong>{money(reportIncome-reportExpenses,0)}</strong><small>{reportIncome?Math.round((reportIncome-reportExpenses)/reportIncome*100):0}% of income remained</small></div></div>
    <div className="reports-grid">
      <section className="panel income-chart comparison-chart"><SectionTitle title="Month-to-month comparison" subtitle={`${range} · select a month for exact figures`}/><div className="chart-legend"><span><i className="income"></i>Income</span><span><i className="expense"></i>Expenses</span></div><div className="bar-chart" role="group" aria-label="Monthly income and expense comparison">{visible.map((month,i)=>{const index=i+start;const maxValue=Math.max(...visible.flatMap(item=>[item.income,item.expense]),1);return <button key={months[index]} className={selectedMonth===index?"selected":""} onClick={()=>setSelectedMonth(index)} aria-label={`${months[index]}: income ${money(month.income)}, expenses ${money(month.expense)}`}><div className="bars"><i style={{height:`${month.income/maxValue*100}%`}}></i><b style={{height:`${month.expense/maxValue*100}%`}}></b></div><span>{months[index]}</span></button>})}</div><div className="selected-month-detail"><div><span>{months[selectedMonth]} income</span><strong>{money(selected.income,0)}</strong></div><div><span>{months[selectedMonth]} expenses</span><strong>{money(selected.expense,0)}</strong></div><div><span>Difference</span><strong className={selected.income-selected.expense<0?"negative":""}>{money(selected.income-selected.expense,0)}</strong></div><div><span>Spending vs previous</span><strong>{spendingChange>0?"+":""}{spendingChange.toFixed(1)}%</strong></div></div><small className="chart-source">Prototype monthly estimates. March uses posted + pending committed activity once and excludes failed or cancelled transactions.</small></section>
      <section className="panel category-report"><SectionTitle title="Committed spending breakdown" subtitle="Posted + pending, with failed and cancelled excluded"/><div className="big-donut"><div><strong>{money(breakdownTotal,0)}</strong><span>tracked</span></div></div><div className="report-categories">{breakdownCategories.map(category=><div key={category.name}><i style={{background:categoryColors[category.name==="Food & dining"?"Dining":category.name==="Shopping"?"Shopping":category.name==="Transport"?"Transportation":category.name==="Other"?"Utilities":"Rent"]}}></i><span>{category.name}</span><strong>{money(category.value,0)}</strong><small>{breakdownTotal?Math.round(category.value/breakdownTotal*100):0}%</small></div>)}</div></section>
      <section className="panel compare-card change-drivers"><SectionTitle title="What changed most?" subtitle="Current March categories vs February prototype estimates"/>{currentCategories.map(category=>{const difference=category.value-category.previous;return <button key={category.name} onClick={()=>props.notify(`${category.name}: ${money(category.value,0)} in current March data vs ${money(category.previous,0)} estimated for February.`)}><span>{category.name}</span><div><i style={{width:`${Math.min(Math.abs(difference)/Math.max(category.previous,1)*100,100)}%`}}></i></div><strong className={difference>0?"negative":""}>{difference>0?"+":""}{money(difference,0)}</strong><small>{difference>0?"more":"less"}</small></button>})}</section>
      <section className="panel report-win"><Icon name="spark"/><span>{months[selectedMonth].toUpperCase()} VIEW</span><strong>Income was {money(reportIncome-reportExpenses,0)} {reportIncome-reportExpenses>=0?"above":"below"} expenses.</strong><p>Use the month controls to compare exact figures. Earlier months remain labeled prototype estimates because the app does not have full historical transactions.</p><Button variant="secondary" onClick={()=>props.navigate("AI Assistant")}>Plan next month with Nova</Button></section>
    </div>
  </>;
}

function Profile(props:any) {
  const [draft,setDraft]=useState<ProfileData>(props.profile);
  const downloadData=()=>{
    const payload={profile:props.profile,accounts:props.accounts,transactions:props.transactions,budgets:props.budgets,bills:props.bills,goals:props.goals,exportedAt:new Date().toISOString(),notice:"Simulated prototype data only"};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));const anchor=document.createElement("a");anchor.href=url;anchor.download="current-campus-demo-data.json";anchor.click();URL.revokeObjectURL(url);props.notify("Demo data export downloaded.");
  };
  return <>
    <PageIntro eyebrow="MAKE IT YOURS" title="Profile & settings" copy="Tune Current Campus to your goals and routines."/>
    <div className="profile-layout">
      <aside className="profile-card panel"><div className="avatar xl">{initials(props.profile.name)}</div><h2>{props.profile.name}</h2><p>{props.profile.email}</p><span>Verified student</span><div><Icon name="shield"/><small>Demo profile. No real financial credentials stored.</small></div></aside>
      <div className="settings-stack">
        <section className="panel settings-section"><SectionTitle title="Personal details" subtitle="How we address and personalize your experience"/><div className="form-grid"><label>Display name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Email address<input type="email" value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/></label><label>Student status<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}><option>Full-time student</option><option>Part-time student</option><option>Recent graduate</option></select></label><label>Currency<select value={draft.currency} onChange={e=>setDraft({...draft,currency:e.target.value})}><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — Pound Sterling</option></select></label><label>Default budget period<select value={draft.period} onChange={e=>setDraft({...draft,period:e.target.value})}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label></div><Button onClick={()=>{if(!draft.name.trim()){props.notify("Display name cannot be empty.");return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)){props.notify("Enter a valid email address.");return;}props.setProfile(draft);props.notify("Profile preferences saved for this session.")}}>Save profile changes</Button></section>
        <section className="panel settings-section notification-settings"><SectionTitle title="Notifications" subtitle="Choose each update and how prototype delivery should behave" action={<Button variant="secondary" icon="bell" onClick={props.openNotifications}>Open notification center</Button>}/>
          <div className="settings-subhead"><span>NOTIFICATION TYPES</span><small>These controls update the in-app center immediately.</small></div>
          {[["budget","Budget limits","Approaching or exceeding a category budget"],["bills","Upcoming bills","Reminders before active recurring payments"],["spending","High spending","Activity that is higher than your normal pattern"],["balance","Low projected balance","Warnings before pending activity and bills reduce your buffer"],["goals","Savings milestones","Progress worth celebrating"],["insights","Optional Nova insights","Helpful AI-generated education and planning ideas"]].map(([key,title,copy])=><div className="toggle-row" key={key}><div><strong>{title}</strong><span>{copy}</span></div><button className={props.settings[key as keyof NotificationSettings]?"on":""} onClick={()=>{props.setSettings((current:NotificationSettings)=>({...current,[key]:!current[key as keyof NotificationSettings]}));props.notify(`${title} preference saved.`)}} aria-label={`Toggle ${title}`} aria-pressed={props.settings[key as keyof NotificationSettings]}><i></i></button></div>)}
          <div className="settings-subhead delivery-head"><span>DELIVERY METHODS</span><small>No backend delivery service is configured.</small></div>
          <div className="toggle-row"><div><strong>In-app notifications</strong><span>Show connected updates in the bell notification center</span></div><button className={props.settings.inApp?"on":""} onClick={()=>{props.setSettings((current:NotificationSettings)=>({...current,inApp:!current.inApp}));props.notify(`In-app notifications ${props.settings.inApp?"turned off":"turned on"}.`)}} aria-label="Toggle in-app notifications" aria-pressed={props.settings.inApp}><i></i></button></div>
          <div className="toggle-row"><div><strong>Browser notifications</strong><span>{props.notificationPermission==="granted"?"Permission granted · delivery remains simulated":props.notificationPermission==="denied"?"Permission blocked in browser settings":props.notificationPermission==="unsupported"?"Not supported in this browser":"Permission is required before browser alerts"}</span></div><button className={props.settings.push?"on":""} onClick={()=>props.settings.push?props.setSettings((current:NotificationSettings)=>({...current,push:false})):props.requestBrowserNotifications()} aria-label="Toggle browser notifications" aria-pressed={props.settings.push} disabled={props.notificationPermission==="denied"||props.notificationPermission==="unsupported"}><i></i></button></div>
          <div className="toggle-row"><div><strong>Email summaries</strong><span>Simulated preference only; this prototype cannot send email</span></div><button className={props.settings.email?"on":""} onClick={()=>{props.setSettings((current:NotificationSettings)=>({...current,email:!current.email}));props.notify(`Email summary preference ${props.settings.email?"disabled":"enabled"} for the prototype. No email will be sent.`)}} aria-label="Toggle simulated email summaries" aria-pressed={props.settings.email}><i></i></button></div>
          <div className="delivery-demo"><Icon name="shield"/><span>Phone push and email require a permission-aware delivery service and backend. Current Campus only saves these prototype preferences for this session.</span><Button variant="secondary" onClick={()=>props.notify("Example delivered: Your dining budget is nearing its limit. This is an in-app simulation only.")}>Send test example</Button></div>
        </section>
        <section className="panel settings-section privacy"><SectionTitle title="Privacy & account" subtitle="You stay in control"/><button onClick={downloadData}><Icon name="download"/><span><strong>Download my data</strong><small>Export your prototype information as JSON</small></span><Icon name="chevron"/></button><button onClick={()=>props.notify("This prototype stores data only in temporary in-browser memory and does not connect to a real bank or server.")}><Icon name="shield"/><span><strong>Privacy center</strong><small>Review how demo data is handled</small></span><Icon name="chevron"/></button><Button variant="danger" onClick={()=>props.confirmAction("Clear all demo data?","This removes every transaction, account, budget, bill, and goal from the current session. This cannot be undone.",props.resetDemo)}>Delete demo account</Button></section>
      </div>
    </div>
  </>;
}

function FormModal({type,close,...props}:any) {
  const [error,setError]=useState("");
  const [bankStep,setBankStep]=useState(1);
  const [institution,setInstitution]=useState("Northstar Credit Union");
  const item=props.editing as any;
  if(type==="account-detail"){
    const account=item as Account;
    const activity=props.transactions.filter((transaction:Transaction)=>transaction.account===account.name);
    const pending=activity.filter((transaction:Transaction)=>transaction.status==="Pending").reduce((sum:number,transaction:Transaction)=>sum+transaction.amount,0);
    return <div className="modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}><div className="modal account-detail-modal" role="dialog" aria-modal="true" aria-labelledby="account-detail-title"><div className="modal-head"><div><span>DEMO ACCOUNT</span><h2 id="account-detail-title">{account.name}</h2></div><button onClick={close} aria-label="Close account details"><Icon name="close"/></button></div><div className="account-detail-body"><div className={`detail-balance ${account.color}`}><span>{account.type} · •••• {account.digits}</span><strong>{money(account.balance)}</strong><small>Posted balance</small><div className="detail-projected"><span>Projected with pending</span><b>{money(account.balance+pending)}</b></div></div><SectionTitle title="Recent account activity" subtitle={`${activity.length} recorded transactions · statuses shown below`}/><TransactionList transactions={activity.slice(0,5)}/><div className="account-detail-actions"><Button variant="secondary" onClick={()=>{close();props.navigate("Transactions")}}>View all transactions</Button><Button variant="danger" onClick={()=>{close();props.confirmAction("Remove demo account?",`${account.name} and its associated transactions will be removed from this session.`,()=>{props.setAccounts((accounts:Account[])=>accounts.filter(a=>a.id!==account.id));props.setTransactions((transactions:Transaction[])=>transactions.filter(t=>t.account!==account.name));props.notify("Demo account and associated activity removed.")})}}>Remove account</Button></div></div></div></div>;
  }
  if(type==="bank"){
    const connect=()=>{
      if(bankStep===1){setBankStep(2);return;}
      props.setAccounts((accounts:Account[])=>[...accounts,{id:Date.now(),name:`${institution} Checking`,type:"Checking",balance:1250,digits:String(Math.floor(1000+Math.random()*8999)),color:"purple"}]);
      props.notify(`${institution} demo account linked. No credentials were requested.`);close();
    };
    return <div className="modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}><div className="modal bank-modal" role="dialog" aria-modal="true" aria-labelledby="bank-modal-title"><div className="modal-head"><div><span>SIMULATED BANK LINK</span><h2 id="bank-modal-title">{bankStep===1?"Choose a demo institution":"Review demo connection"}</h2></div><button onClick={close} aria-label="Close bank connection"><Icon name="close"/></button></div><div className="bank-flow"><div className="demo-notice"><Icon name="shield"/><span>This demonstration never requests or stores real bank usernames, passwords, or credentials.</span></div>{bankStep===1?<div className="bank-options">{["Northstar Credit Union","Campus Community Bank","Demo National Bank"].map(bank=><button className={institution===bank?"selected":""} onClick={()=>setInstitution(bank)} key={bank}><span className="bank-logo"><Icon name="bank"/></span><span><strong>{bank}</strong><small>Simulated institution</small></span>{institution===bank&&<Icon name="check"/>}</button>)}</div>:<div className="bank-review"><span className="bank-logo"><Icon name="bank"/></span><h3>{institution}</h3><p>A demo checking account with a $1,250 sample balance will be added. No external service is connected.</p><div><span>Account type</span><strong>Demo checking</strong></div><div><span>Data source</span><strong>Simulated locally</strong></div></div>}<div className="modal-actions"><Button variant="secondary" onClick={bankStep===2?()=>setBankStep(1):close}>{bankStep===2?"Back":"Cancel"}</Button><Button onClick={connect}>{bankStep===1?"Continue":"Link demo account"}</Button></div></div></div></div>;
  }
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get("name")||"").trim();const amount=Number(data.get("amount"));
    if(!name||!amount||amount<=0){setError("Please add a name and a valid amount.");return;}
    if(type==="holding"){
      const quantity=Number(data.get("quantity"));const ticker=String(data.get("ticker")||"").trim().toUpperCase();const account=String(data.get("investmentAccount")||"").trim();
      if(!quantity||quantity<=0||!ticker||!account){setError("Add an account, ticker, quantity, and valid price.");return;}
      const next:Holding={id:item?.id||Date.now(),name,ticker,account,quantity,price:amount,source:String(data.get("source")) as "Simulated"|"Manual"};
      props.setHoldings((items:Holding[])=>item?items.map(holding=>holding.id===item.id?next:holding):[...items,next]);
      if(!item)props.setInvestmentActivity((items:InvestmentActivity[])=>[{id:Date.now(),date:"Today",action:"Added",holding:name,amount:quantity*amount},...items]);
    }
    if(type==="transaction"){
      const account=String(data.get("account")||"");
      if(!account){setError("Add an account before recording a transaction.");return;}
      const signedAmount=data.get("direction")==="income"?amount:-amount;
      const next:Transaction={id:item?.id||Date.now(),merchant:name,date:String(data.get("date")||"Mar 18"),amount:signedAmount,category:String(data.get("category")),account,icon:name.slice(0,2).toUpperCase(),status:String(data.get("status")||"Posted") as TransactionStatus};
      props.setTransactions((items:Transaction[])=>item?items.map(transaction=>transaction.id===item.id?next:transaction):[next,...items]);
      props.setAccounts((accounts:Account[])=>accounts.map(current=>{let balance=current.balance;if(item?.status==="Posted"&&current.name===item.account)balance-=item.amount;if(next.status==="Posted"&&current.name===next.account)balance+=next.amount;return {...current,balance}}));
    }
    if(type==="budget"){
      const next:Budget={id:item?.id||Date.now(),category:name,limit:amount,color:item?.color||categoryColors[name]||"#b8f05a"};
      props.setBudgets((items:Budget[])=>item?items.map(budget=>budget.id===item.id?next:budget):[...items,next]);
      if(item&&item.category!==name)props.setTransactions((items:Transaction[])=>items.map(transaction=>transaction.category===item.category?{...transaction,category:name}:transaction));
    }
    if(type==="goal"){
      const saved=Number(data.get("saved"))||0;if(saved>amount){setError("Current savings cannot be greater than the target amount.");return;}
      const next:Goal={id:item?.id||Date.now(),name,target:amount,saved,date:String(data.get("date")||"Dec 31, 2025"),color:item?.color||"purple"};
      props.setGoals((items:Goal[])=>item?items.map(goal=>goal.id===item.id?next:goal):[...items,next]);
    }
    if(type==="bill"){
      const due=String(data.get("date")||"").trim();if(!due){setError("Add the next charge date.");return;}
      const next:Bill={id:item?.id||Date.now(),name,amount,due,frequency:String(data.get("frequency")||"Monthly"),paused:item?.paused||false};
      props.setBills((items:Bill[])=>item?items.map(bill=>bill.id===item.id?next:bill):[...items,next]);
    }
    if(type==="account"){
      const accountType=String(data.get("accountType"));const balance=["Credit card","Loan"].includes(accountType)?-Math.abs(amount):amount;
      props.setAccounts((items:Account[])=>[...items,{id:Date.now(),name,type:accountType,balance,digits:String(Math.floor(1000+Math.random()*8999)),color:"purple"}]);
    }
    props.notify(type==="account"?"Manual demo account added. No bank is connected.":type==="holding"?`Holding ${item?"updated":"added"}. Portfolio and net worth refreshed.`:`${type[0].toUpperCase()+type.slice(1)} ${item?"updated":"added"} successfully.`);close();
  };
  const titles:Record<string,string>={transaction:item?"Edit transaction":"Add a transaction",budget:item?"Edit category budget":"Create a category budget",goal:item?"Edit savings goal":"Create a savings goal",bill:item?"Edit recurring payment":"Add recurring payment",account:"Add a manual account",holding:item?"Edit holding":"Add an investment holding"};
  return <div className="modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span>{type==="account"?"SIMULATED ACCOUNT":item?"EDIT DETAILS":"QUICK ADD"}</span><h2 id="modal-title">{titles[type]}</h2></div><button onClick={close} aria-label="Close form"><Icon name="close"/></button></div><form onSubmit={submit}>
    {type==="account"&&<div className="demo-notice"><Icon name="shield"/><span>This is a manual demo account. Never enter real bank usernames, passwords, or credentials.</span></div>}
    {type==="holding"&&<div className="demo-notice"><Icon name="chart"/><span>Enter a simulated or manual price. Current Campus does not fetch live market quotes.</span></div>}
    {type==="transaction"&&<div className="demo-notice"><Icon name="shield"/><span>Status is editable only to demonstrate the prototype. A real connected account must use status updates from its financial data provider.</span></div>}
    <label>{type==="transaction"?"Description":type==="budget"?"Category name":type==="account"?"Account name":type==="holding"?"Investment name":"Name"}<input name="name" defaultValue={item?.merchant||item?.category||item?.name||""} placeholder={type==="transaction"?"e.g. Campus coffee":type==="goal"?"e.g. Spring break":type==="holding"?"e.g. Total Market ETF":"Enter a name"} autoFocus/></label>
    <label>{type==="account"?"Current demo balance":type==="budget"?"Spending limit":type==="goal"?"Target amount":type==="holding"?"Price per unit":"Amount"}<div className="money-input"><span>$</span><input name="amount" type="number" min="0.01" step="0.01" defaultValue={item?Math.abs(item.amount??item.limit??item.target??item.price):""} placeholder="0.00"/></div></label>
    {type==="holding"&&<><div className="form-grid"><label>Ticker or symbol<input name="ticker" defaultValue={item?.ticker||""} placeholder="VTI"/></label><label>Quantity<input name="quantity" type="number" min="0.0001" step="0.0001" defaultValue={item?.quantity||""} placeholder="0"/></label></div><label>Investment account<input name="investmentAccount" defaultValue={item?.account||"Campus Roth IRA"} placeholder="Account name"/></label><label>Value source<select name="source" defaultValue={item?.source||"Manual"}><option>Manual</option><option>Simulated</option></select></label></>}
    {type==="transaction"&&<><div className="form-grid"><label>Type<select name="direction" defaultValue={item?.amount>0?"income":"expense"}><option value="expense">Expense</option><option value="income">Income</option></select></label><label>Category<select name="category" defaultValue={item?.category||"Groceries"}>{[...categories,"Income"].map(category=><option key={category}>{category}</option>)}</select></label></div><div className="form-grid"><label>Date<input name="date" defaultValue={item?.date||"Mar 18"}/></label><label>Account<select name="account" defaultValue={item?.account}>{props.accounts.map((account:Account)=><option key={account.id}>{account.name}</option>)}</select></label></div><label>Transaction status<select name="status" defaultValue={item?.status||"Posted"}><option>Pending</option><option>Posted</option><option>Failed</option><option>Cancelled</option></select></label></>}
    {type==="goal"&&<div className="form-grid"><label>Already saved<input name="saved" type="number" min="0" step="0.01" defaultValue={item?.saved||0}/></label><label>Target date<input name="date" defaultValue={item?.date||""} placeholder="Dec 31, 2025"/></label></div>}
    {type==="bill"&&<div className="form-grid"><label>Next charge<input name="date" defaultValue={item?.due||""} placeholder="Apr 5"/></label><label>Frequency<select name="frequency" defaultValue={item?.frequency||"Monthly"}><option>Monthly</option><option>Weekly</option><option>Yearly</option></select></label></div>}
    {type==="account"&&<label>Account type<select name="accountType"><option>Checking</option><option>Savings</option><option>Credit card</option><option>Loan</option></select></label>}
    {error&&<div className="form-error" role="alert">{error}</div>}<div className={`modal-actions ${type==="budget"&&item?"budget-modal-actions":""}`}>{type==="budget"&&item&&<Button variant="danger" icon="trash" onClick={()=>{const budget=item as Budget;close();props.confirmAction("Delete category budget?",`${budget.category} will be removed from your budget plan. Existing transactions keep their categories, and all dashboard and budget totals will recalculate immediately.`,()=>{props.setBudgets((items:Budget[])=>items.filter(entry=>entry.id!==budget.id));props.notify(`${budget.category} budget deleted. Financial totals updated.`);})}}>Delete budget</Button>}<Button variant="secondary" onClick={close}>Cancel</Button><Button type="submit">{item?"Save changes":type==="account"?"Add demo account":titles[type]}</Button></div>
  </form></div></div>;
}

function ConfirmDialog({title,copy,cancel,confirm}:{title:string;copy:string;cancel:()=>void;confirm:()=>void}) {
  return <div className="modal-backdrop"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><div className="confirm-icon"><Icon name="trash"/></div><h2 id="confirm-title">{title}</h2><p>{copy}</p><div className="modal-actions"><Button variant="secondary" onClick={cancel}>Cancel</Button><Button variant="danger" onClick={confirm}>Confirm and continue</Button></div></div></div>;
}

export default App;
