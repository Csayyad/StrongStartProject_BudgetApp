import { FormEvent, ReactNode, useState } from "react";

type Page =
  | "Dashboard"
  | "Budgets"
  | "Transactions"
  | "Accounts"
  | "Recurring Bills"
  | "Savings Goals"
  | "AI Assistant"
  | "Reports"
  | "Profile";
type ModalType = "transaction" | "budget" | "goal" | "bill" | "account" | "bank" | "account-detail" | null;

type Transaction = {
  id: number;
  merchant: string;
  date: string;
  amount: number;
  category: string;
  account: string;
  icon: string;
};
type Budget = { id: number; category: string; limit: number; color: string };
type Account = { id: number; name: string; type: string; balance: number; digits: string; color: string };
type Bill = { id: number; name: string; amount: number; due: string; frequency: string; paused: boolean };
type Goal = { id: number; name: string; target: number; saved: number; date: string; color: string };
type EditableItem = Transaction | Budget | Account | Bill | Goal | null;
type ProfileData = { name: string; status: string; currency: string; period: string };
type NotificationSettings = { weekly: boolean; bills: boolean; insights: boolean; marketing: boolean };
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
  { id: 1, merchant: "Campus Bookstore", date: "Mar 18", amount: -48.9, category: "Tuition", account: "Everyday Checking", icon: "CB" },
  { id: 2, merchant: "Whole Foods Market", date: "Mar 17", amount: -67.42, category: "Groceries", account: "Everyday Checking", icon: "WF" },
  { id: 3, merchant: "Design Lab Pay", date: "Mar 15", amount: 620, category: "Income", account: "Everyday Checking", icon: "DL" },
  { id: 4, merchant: "Metro Transit", date: "Mar 14", amount: -22.5, category: "Transportation", account: "Student Credit", icon: "MT" },
  { id: 5, merchant: "Momo Ramen", date: "Mar 13", amount: -18.75, category: "Dining", account: "Everyday Checking", icon: "MR" },
  { id: 6, merchant: "Figma", date: "Mar 12", amount: -15, category: "Subscriptions", account: "Student Credit", icon: "FI" },
  { id: 7, merchant: "Target", date: "Mar 10", amount: -36.18, category: "Shopping", account: "Student Credit", icon: "TG" },
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

function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [bills, setBills] = useState(initialBills);
  const [goals, setGoals] = useState(initialGoals);
  const [modal, setModal] = useState<ModalType>(null);
  const [editing, setEditing] = useState<EditableItem>(null);
  const [confirmation, setConfirmation] = useState<{title:string;copy:string;action:()=>void} | null>(null);
  const [profile, setProfile] = useState<ProfileData>({name:"Maya",status:"Full-time student",currency:"USD — US Dollar",period:"Monthly"});
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({weekly:true,bills:true,insights:true,marketing:false});
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const navigate = (next: Page) => {
    setPage(next);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const postedSpending = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const unpostedRent = bills.find(bill => !bill.paused && bill.name.toLowerCase().includes("rent"))?.amount || 0;
  const monthSpent = postedSpending + unpostedRent;
  const openModal = (type: ModalType, item: EditableItem = null) => { setEditing(item); setModal(type); };
  const confirmAction = (title:string,copy:string,action:()=>void) => setConfirmation({title,copy,action});
  const resetDemo = () => {
    setTransactions([]); setBudgets([]); setAccounts([]); setBills([]); setGoals([]);
    setConfirmation(null); navigate("Dashboard"); notify("Demo data cleared. Empty states are now visible.");
  };

  const shared = { transactions, setTransactions, budgets, setBudgets, accounts, setAccounts, bills, setBills, goals, setGoals, modal, setModal, editing, setEditing, openModal, confirmAction, notify, navigate, totalBalance, monthSpent, profile, setProfile };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><span></span><span></span></div><strong>Current</strong><em>Campus</em></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><Icon name="close"/></button>
        <nav className="side-nav">
          <p className="nav-label">YOUR MONEY</p>
          {nav.map(item => <button key={item.label} className={page === item.label ? "active" : ""} onClick={() => navigate(item.label)}><Icon name={item.icon}/><span>{item.label}</span>{item.label === "AI Assistant" && <b>AI</b>}</button>)}
        </nav>
        <div className="sidebar-card">
          <div className="mini-orb"><Icon name="spark" size={16}/></div>
          <strong>Money feeling messy?</strong>
          <p>Ask me anything. Zero judgment, always.</p>
          <button onClick={() => navigate("AI Assistant")}>Chat with Nova <Icon name="arrow" size={15}/></button>
        </div>
        <div className="sidebar-profile">
          <div className="avatar">{profile.name.slice(0,2).toUpperCase()}</div><div><strong>{profile.name} Allen</strong><span>Design student</span></div>
          <button onClick={() => navigate("Profile")} aria-label="Open profile settings"><Icon name="more"/></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Icon name="menu"/></button>
          <div className="mobile-brand">Current <span>Campus</span></div>
          <button className="search-trigger" onClick={() => navigate("Transactions")}><Icon name="search"/><span>Search anything...</span><kbd>⌘ K</kbd></button>
          <div className="top-actions"><button className="icon-btn" onClick={() => notify("You’re all caught up.")} aria-label="View notifications"><Icon name="bell"/><i></i></button><button className="avatar small avatar-button" onClick={()=>navigate("Profile")} aria-label="Open profile">{profile.name.slice(0,2).toUpperCase()}</button></div>
        </header>

        <div className="page">
          {page === "Dashboard" && <Dashboard {...shared}/>}
          {page === "Budgets" && <Budgets {...shared}/>}
          {page === "Transactions" && <Transactions {...shared}/>}
          {page === "Accounts" && <Accounts {...shared}/>}
          {page === "Recurring Bills" && <Recurring {...shared}/>}
          {page === "Savings Goals" && <Savings {...shared}/>}
          {page === "AI Assistant" && <Assistant {...shared}/>}
          {page === "Reports" && <Reports {...shared}/>}
          {page === "Profile" && <Profile {...shared} profile={profile} setProfile={setProfile} settings={notificationSettings} setSettings={setNotificationSettings} resetDemo={resetDemo}/>}
        </div>
      </main>
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay"></button>}
      {modal && <FormModal type={modal} close={() => {setModal(null);setEditing(null)}} {...shared}/>}
      {confirmation && <ConfirmDialog title={confirmation.title} copy={confirmation.copy} cancel={()=>setConfirmation(null)} confirm={()=>{confirmation.action();setConfirmation(null)}}/>}
      {toast && <div className="toast"><Icon name="check" size={18}/>{toast}</div>}
    </div>
  );
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>{action}</div>;
}

function Dashboard(props: any) {
  const upcomingTotal = props.bills.filter((bill:Bill)=>!bill.paused).reduce((sum:number,bill:Bill)=>sum+bill.amount,0);
  const available = Math.max(0, props.totalBalance - upcomingTotal);
  const budgetTotal = props.budgets.reduce((sum:number,budget:Budget)=>sum+budget.limit,0);
  const savedTotal = props.goals.reduce((sum:number,goal:Goal)=>sum+goal.saved,0);
  return <>
    <PageIntro eyebrow="TUESDAY, MARCH 18" title={`Hey ${props.profile.name}, you’re doing great.`} copy="Here’s the big picture on your money this month." action={<Button icon="plus" onClick={() => props.setModal("transaction")}>Add transaction</Button>}/>
    <div className="hero-balance">
      <div className="hero-copy">
        <span>Total across your accounts</span><strong>{money(props.totalBalance)}</strong>
        <div className="balance-change"><Icon name="trend" size={16}/> Up $428.60 this month</div>
      </div>
      <div className="forecast-card">
        <div><span>Safe to spend</span><strong>{money(available)}</strong><small>after upcoming bills</small></div>
        <div className="forecast-chart">
          <svg viewBox="0 0 260 70" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8f05a" stopOpacity=".3"/><stop offset="1" stopColor="#b8f05a" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 48 C35 43 42 25 75 33 S115 54 145 34 S190 18 220 28 S245 16 260 9 L260 70 L0 70Z"/><path className="line" d="M0 48 C35 43 42 25 75 33 S115 54 145 34 S190 18 220 28 S245 16 260 9"/></svg>
          <div className="forecast-labels"><span>Today</span><span>Apr 1</span></div>
        </div>
      </div>
    </div>
    <div className="stat-grid">
      <Stat label="Monthly income" value="$2,420" note="+8% vs last month" icon="trend" tone="lime"/>
      <Stat label="Monthly spending" value={money(props.monthSpent, 0)} note="$496 below budget" icon="receipt" tone="coral"/>
      <Stat label="Goal savings" value={money(savedTotal,0)} note={`Across ${props.goals.length} active goals`} icon="target" tone="purple"/>
      <Stat label="Financial health" value="Looking good" note="Score 78 / 100" icon="spark" tone="blue"/>
    </div>
    <div className="dashboard-grid">
      <section className="panel budget-overview">
        <SectionTitle title="Monthly budget" subtitle="March 1–31" action={<button className="text-link" onClick={() => props.navigate("Budgets")}>View budget <Icon name="arrow" size={15}/></button>}/>
        <div className="budget-summary"><div><strong>{money(props.monthSpent, 0)}</strong><span>spent of {money(budgetTotal,0)}</span></div><b>{budgetTotal?Math.round(props.monthSpent / budgetTotal*100):0}%</b></div>
        <div className="progress large"><i style={{ width: `${budgetTotal?Math.min(props.monthSpent / budgetTotal*100, 100):0}%` }}></i></div>
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
        {props.bills.filter((b: Bill) => !b.paused).length ? props.bills.filter((b: Bill) => !b.paused).slice(0, 3).map((bill: Bill, i: number) => <div className="upcoming-row" key={bill.id}><div className="date-tile"><span>{bill.due.split(" ")[0]}</span><b>{bill.due.split(" ")[1]}</b></div><div><strong>{bill.name}</strong><span>Autopay · {bill.frequency}</span></div><strong>-{money(bill.amount)}</strong><small>Balance after: {money(props.totalBalance-props.bills.filter((b:Bill)=>!b.paused).slice(0,i+1).reduce((sum:number,b:Bill)=>sum+b.amount,0),0)}</small></div>) : <EmptyCompact icon="calendar" title="Nothing coming up" copy="Add a recurring payment to see a forecast."/>}
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
  return transactions.filter(t => t.category === category && t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function TransactionList({ transactions, controls }: { transactions: Transaction[]; controls?: (t: Transaction) => ReactNode }) {
  if (!transactions.length) return <EmptyCompact icon="receipt" title="No transactions yet" copy="New activity will appear here." />;
  return <div className="transaction-list">{transactions.map(t => <div className="transaction-row" key={t.id}>
    <div className="merchant-icon">{t.icon}</div><div className="merchant"><strong>{t.merchant}</strong><span>{t.date} · {t.account}</span></div>
    <span className="category-pill"><i style={{ background: categoryColors[t.category] || "#8b91a1" }}></i>{t.category}</span>
    <strong className={t.amount > 0 ? "positive" : ""}>{t.amount > 0 ? "+" : ""}{money(t.amount)}</strong>{controls?.(t)}
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
    <div className="alert-card"><Icon name="spark"/><div><strong>{props.budgets.length?"Your plan responds to every change":"Start with one realistic category"}</strong><span>{props.budgets.length?`This ${period.toLowerCase()} view scales your monthly category limits and recorded spending.`:"Create a category budget and Nova can help you tune it."}</span></div><button onClick={() => props.navigate("AI Assistant")}>Get suggestions</button></div>
    <section className="budget-list-section">
      <SectionTitle title="Category budgets" subtitle={`${props.budgets.length} active budgets · ${period} view`} action={<button className="text-link" onClick={() => props.setModal("budget")}><Icon name="plus"/> Add category</button>}/>
      {props.budgets.length ? <div className="budget-card-grid">{props.budgets.map((b: Budget) => {
        const limit=b.limit*factor;
        const current = (categorySpend(props.transactions, b.category) + (b.category === "Dining" ? 104 : b.category === "Groceries" ? 112 : b.category === "Entertainment" ? 62 : 0))*factor;
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
  const filtered = props.transactions.filter((t: Transaction) => t.merchant.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || t.category === category) && (account === "All accounts" || t.account === account));
  const outflow = props.transactions.filter((t: Transaction) => t.amount < 0).reduce((s: number, t: Transaction) => s + Math.abs(t.amount), 0);
  const updateCategory = (id: number, next: string) => {
    props.setTransactions((items: Transaction[]) => items.map(t => t.id === id ? { ...t, category: next } : t));
    props.notify("Category updated across your plan.");
  };
  return <>
    <PageIntro eyebrow="KNOW WHERE IT GOES" title="Spending, minus the mystery." copy="Search, organize, and understand every dollar." action={<Button icon="plus" onClick={() => props.setModal("transaction")}>Add transaction</Button>}/>
    <div className="spending-summary">
      <section className="panel"><span>This month’s spending</span><strong>{money(outflow + 780)}</strong><small><b>↓ 12%</b> from February</small><div className="spark-bars">{[38,62,46,76,54,89,66,73,48,58,82,70].map((v,i)=><i style={{height:`${v}%`}} key={i}></i>)}</div></section>
      <section className="panel donut-card"><div className="donut"></div><div><span>Top category</span><strong>Housing</strong><small>$780 · 62% of spending</small></div></section>
      <section className="panel"><span>Average per day</span><strong>$42.18</strong><small>$8.40 below your limit</small><div className="daily-meter"><i></i></div></section>
    </div>
    <section className="panel transaction-table">
      <div className="table-toolbar"><div className="search-box"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions"/></div><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}><option>All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select aria-label="Filter by account" value={account} onChange={e=>setAccount(e.target.value)}><option>All accounts</option>{props.accounts.map((a:Account)=><option key={a.id}>{a.name}</option>)}</select><button onClick={() => props.notify("Showing all March 2025 demo activity.")}><Icon name="calendar"/> March 2025</button></div>
      <div className="table-heading"><span>Transaction</span><span>Category</span><span>Amount</span><span>Actions</span></div>
      {filtered.length ? <TransactionList transactions={filtered} controls={(t) => <div className="row-actions"><select aria-label={`Change category for ${t.merchant}`} value={t.category} onChange={e => updateCategory(t.id, e.target.value)}>{[...categories, "Income"].map(c=><option key={c}>{c}</option>)}</select><button aria-label={`Edit ${t.merchant}`} onClick={()=>props.openModal("transaction",t)}><Icon name="edit" size={16}/></button><button aria-label={`Delete ${t.merchant}`} onClick={() => props.confirmAction("Delete this transaction?",`${t.merchant} for ${money(Math.abs(t.amount))} will be removed and its account balance will be reversed.`,()=>{props.setTransactions((items: Transaction[]) => items.filter(i => i.id !== t.id));props.setAccounts((items:Account[])=>items.map(a=>a.name===t.account?{...a,balance:a.balance-t.amount}:a));props.notify("Transaction deleted and balance updated.");})}><Icon name="trash" size={16}/></button></div>}/> : <div className="empty-state"><Icon name="search" size={30}/><strong>No transactions found</strong><span>{props.transactions.length?"Try a different search or filter.":"Add your first transaction to start tracking spending."}</span></div>}
    </section>
  </>;
}

function Accounts(props: any) {
  return <>
    <PageIntro eyebrow="YOUR MONEY HUBS" title="All accounts, one calm view." copy="Demo balances only. No real banking credentials are requested or stored." action={<div className="action-pair"><Button variant="secondary" icon="plus" onClick={() => props.setModal("account")}>Add account</Button><Button icon="bank" onClick={() => props.setModal("bank")}>Link bank account</Button></div>}/>
    <div className="accounts-total"><div><span>Combined balance</span><strong>{money(props.totalBalance)}</strong><small>Across {props.accounts.length} demo accounts</small></div><div className="health-badge"><Icon name="shield"/><span><strong>Protected demo</strong><small>Simulated connection only</small></span></div></div>
    {props.accounts.length ? <div className="account-grid">{props.accounts.map((a: Account) => <article className={`account-card ${a.color}`} key={a.id} role="button" tabIndex={0} aria-label={`Open ${a.name} details`} onClick={()=>props.openModal("account-detail",a)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();props.openModal("account-detail",a)}}}><div><span>{a.type}</span><button aria-label={`Open ${a.name} details`} onClick={event => {event.stopPropagation();props.openModal("account-detail",a)}}><Icon name="more"/></button></div><h3>{a.name}</h3><strong>{money(a.balance)}</strong><footer><span>•••• {a.digits}</span><b>{a.type === "Credit card" ? `${money(Math.max(0,2000-Math.abs(a.balance)),0)} available` : "Demo account"}</b></footer></article>)}</div> : <div className="panel accounts-empty"><EmptyCompact icon="bank" title="No demo accounts connected" copy="Add a manual account or try the simulated bank flow." action={<Button icon="bank" onClick={()=>props.setModal("bank")}>Link demo bank</Button>}/></div>}
    <section className="panel account-activity"><SectionTitle title="Activity across accounts" subtitle="Latest movement" action={<button className="text-link" onClick={() => props.navigate("Transactions")}>View transactions <Icon name="arrow" size={15}/></button>}/><TransactionList transactions={props.transactions.slice(0, 5)}/></section>
  </>;
}

function Recurring(props: any) {
  const active = props.bills.filter((b: Bill) => !b.paused);
  const monthly = active.reduce((s: number,b: Bill)=>s+b.amount,0);
  return <>
    <PageIntro eyebrow="NO SURPRISE CHARGES" title="See what’s coming next." copy="Keep subscriptions and bills visible before they hit." action={<Button icon="plus" onClick={() => props.setModal("bill")}>Add recurring payment</Button>}/>
    <div className="recurring-stats"><Stat label="Monthly recurring" value={money(monthly)} note={`${active.length} active payments`} icon="repeat" tone="purple"/><Stat label="Yearly cost" value={money(monthly*12,0)} note="Annualized estimate" icon="calendar" tone="coral"/><Stat label="Due in 7 days" value="$28.97" note="3 upcoming charges" icon="bell" tone="lime"/></div>
    <div className="recurring-layout">
      <section className="panel timeline"><SectionTitle title="Upcoming timeline" subtitle="Projected checking balance after each charge"/>
        <div className="timeline-start"><span>Today · checking</span><strong>{money(props.accounts.find((a:Account)=>a.type==="Checking")?.balance||0)}</strong></div>
        {active.length ? active.map((bill: Bill, i: number) => <div className="timeline-item" key={bill.id}><div className="timeline-date">{bill.due}</div><div className="timeline-line"><i></i></div><div className="bill-info"><div className="merchant-icon">{bill.name.slice(0,2).toUpperCase()}</div><div><strong>{bill.name}</strong><span>{bill.frequency}</span></div></div><strong>-{money(bill.amount)}</strong><small>After: {money((props.accounts.find((a:Account)=>a.type==="Checking")?.balance||0)-active.slice(0,i+1).reduce((s:number,b:Bill)=>s+b.amount,0))}</small></div>) : <EmptyCompact icon="calendar" title="No upcoming charges" copy="Active recurring payments will appear here."/>}
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

function Assistant(props: any) {
  type PlanItem = { name: string; type: "Essential" | "Flexible" | "Savings"; amount: number; selected: boolean };
  type GoalDraft = { name: string; target: number; saved: number; date: string; monthly: number };
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

  return <div className="assistant-page">
    <div className="assistant-header">
      <div className="assistant-welcome">
        <div className="nova large"><Icon name="spark" size={28}/></div>
        <div><span>YOUR AI MONEY COACH</span><h1>Hey {props.profile.name}, let’s make your money work for you.</h1><p>I can help you decide what’s safe to spend, build a realistic plan, and make your next goal feel achievable.</p></div>
      </div>
      <div className="online"><i></i> Using your demo finances</div>
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
  const [period,setPeriod]=useState("Monthly");
  const factor=period==="Weekly"?7/30:period==="Yearly"?12:1;
  const reportIncome=2420*factor;
  const reportExpenses=props.monthSpent*factor;
  const exportCsv=()=>{
    const csv=["Description,Date,Amount,Category,Account",...props.transactions.map((t:Transaction)=>`${t.merchant},${t.date},${t.amount},${t.category},${t.account}`)].join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const a=document.createElement("a");a.href=url;a.download="current-campus-transactions.csv";a.click();URL.revokeObjectURL(url);props.notify("CSV export downloaded.");
  };
  return <>
    <PageIntro eyebrow="ZOOM OUT" title="Your progress, in perspective." copy="Spot patterns, celebrate wins, and make your next move." action={<div className="action-pair"><Button variant="secondary" icon="download" onClick={()=>window.print()}>Export PDF</Button><Button icon="download" onClick={exportCsv}>Export CSV</Button></div>}/>
    <div className="toolbar"><div className="segmented">{["Weekly","Monthly","Yearly"].map(p=><button key={p} className={period===p?"active":""} onClick={()=>setPeriod(p)}>{p}</button>)}</div><button className="month-picker" onClick={()=>props.notify("Reports currently use the March 2025 demo period.")}><Icon name="calendar"/> March 2025 <Icon name="chevron"/></button></div>
    <div className="report-kpis"><div><span>Income</span><strong>{money(reportIncome,0)}</strong><small>+8% vs prior period</small></div><div><span>Expenses</span><strong>{money(reportExpenses,0)}</strong><small>-12% vs prior period</small></div><div><span>Net cash flow</span><strong>{money(reportIncome-reportExpenses,0)}</strong><small>{reportIncome?Math.round((reportIncome-reportExpenses)/reportIncome*100):0}% of income</small></div></div>
    <div className="reports-grid">
      <section className="panel income-chart"><SectionTitle title="Income vs. expenses" subtitle={`${period} cash flow`}/><div className="chart-legend"><span><i className="income"></i>Income</span><span><i className="expense"></i>Expenses</span></div><div className="bar-chart">{["Oct","Nov","Dec","Jan","Feb","Mar"].map((m,i)=><div key={m}><div className="bars"><i style={{height:`${[65,78,72,82,76,90][i]}%`}}></i><b style={{height:`${[52,64,69,59,66,62][i]}%`}}></b></div><span>{m}</span></div>)}</div></section>
      <section className="panel category-report"><SectionTitle title="Spending breakdown" subtitle="Where your money went"/><div className="big-donut"><div><strong>$1.7k</strong><span>spent</span></div></div><div className="report-categories">{[["Housing","$780","45%"],["Food & dining","$412","24%"],["Shopping","$204","12%"],["Other","$340","19%"]].map(([n,v,p])=><div key={n}><i style={{background:categoryColors[n==="Food & dining"?"Dining":n==="Shopping"?"Shopping":"Rent"]}}></i><span>{n}</span><strong>{v}</strong><small>{p}</small></div>)}</div></section>
      <section className="panel compare-card"><SectionTitle title="Budget vs. actual" subtitle="How the plan is holding up"/>{props.budgets.slice(0,5).map((b:Budget)=><div className="compare-row" key={b.id}><span>{b.category}</span><div><i style={{width:`${Math.min((categorySpend(props.transactions,b.category)+50)/b.limit*100,100)}%`,background:b.color}}></i></div><strong>{money(categorySpend(props.transactions,b.category)+50,0)}</strong><small>/ {money(b.limit,0)}</small></div>)}</section>
      <section className="panel report-win"><Icon name="spark"/><span>{period.toUpperCase()} VIEW</span><strong>Your estimated net cash flow is {money(reportIncome-reportExpenses,0)}.</strong><p>This comparison scales the current March demo assumptions to the selected period. Recorded activity may not repeat at the same rate.</p><Button variant="secondary" onClick={()=>props.navigate("AI Assistant")}>Plan next month with Nova</Button></section>
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
      <aside className="profile-card panel"><div className="avatar xl">{props.profile.name.slice(0,2).toUpperCase()}</div><h2>{props.profile.name} Allen</h2><p>maya.allen@university.edu</p><span>Verified student</span><div><Icon name="shield"/><small>Demo profile. No real financial credentials stored.</small></div></aside>
      <div className="settings-stack">
        <section className="panel settings-section"><SectionTitle title="Personal details" subtitle="How we address and personalize your experience"/><div className="form-grid"><label>Display name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Student status<select value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}><option>Full-time student</option><option>Part-time student</option><option>Recent graduate</option></select></label><label>Currency<select value={draft.currency} onChange={e=>setDraft({...draft,currency:e.target.value})}><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — Pound Sterling</option></select></label><label>Default budget period<select value={draft.period} onChange={e=>setDraft({...draft,period:e.target.value})}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label></div><Button onClick={()=>{if(!draft.name.trim()){props.notify("Display name cannot be empty.");return;}props.setProfile(draft);props.notify("Profile preferences saved for this session.")}}>Save profile changes</Button></section>
        <section className="panel settings-section"><SectionTitle title="Notifications" subtitle="Choose what deserves your attention"/>{[["weekly","Weekly money check-in","A Sunday summary of spending and goals"],["bills","Upcoming bill reminders","Get a heads-up three days before charges"],["insights","Nova insights","Helpful nudges based on your demo activity"],["marketing","Product updates","Occasional news and feature announcements"]].map(([key,title,copy])=><div className="toggle-row" key={key}><div><strong>{title}</strong><span>{copy}</span></div><button className={props.settings[key as keyof NotificationSettings]?"on":""} onClick={()=>{props.setSettings((current:NotificationSettings)=>({...current,[key]:!current[key as keyof NotificationSettings]}));props.notify(`${title} preference saved.`)}} aria-label={`Toggle ${title}`} aria-pressed={props.settings[key as keyof NotificationSettings]}><i></i></button></div>)}</section>
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
    return <div className="modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}><div className="modal account-detail-modal" role="dialog" aria-modal="true" aria-labelledby="account-detail-title"><div className="modal-head"><div><span>DEMO ACCOUNT</span><h2 id="account-detail-title">{account.name}</h2></div><button onClick={close} aria-label="Close account details"><Icon name="close"/></button></div><div className="account-detail-body"><div className={`detail-balance ${account.color}`}><span>{account.type} · •••• {account.digits}</span><strong>{money(account.balance)}</strong><small>Current simulated balance</small></div><SectionTitle title="Recent account activity" subtitle={`${activity.length} recorded transactions`}/><TransactionList transactions={activity.slice(0,5)}/><div className="account-detail-actions"><Button variant="secondary" onClick={()=>{close();props.navigate("Transactions")}}>View all transactions</Button><Button variant="danger" onClick={()=>{close();props.confirmAction("Remove demo account?",`${account.name} and its associated transactions will be removed from this session.`,()=>{props.setAccounts((accounts:Account[])=>accounts.filter(a=>a.id!==account.id));props.setTransactions((transactions:Transaction[])=>transactions.filter(t=>t.account!==account.name));props.notify("Demo account and associated activity removed.")})}}>Remove account</Button></div></div></div></div>;
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
    if(type==="transaction"){
      const account=String(data.get("account")||"");
      if(!account){setError("Add an account before recording a transaction.");return;}
      const signedAmount=data.get("direction")==="income"?amount:-amount;
      const next:Transaction={id:item?.id||Date.now(),merchant:name,date:String(data.get("date")||"Mar 18"),amount:signedAmount,category:String(data.get("category")),account,icon:name.slice(0,2).toUpperCase()};
      props.setTransactions((items:Transaction[])=>item?items.map(transaction=>transaction.id===item.id?next:transaction):[next,...items]);
      props.setAccounts((accounts:Account[])=>accounts.map(current=>{let balance=current.balance;if(item&&current.name===item.account)balance-=item.amount;if(current.name===next.account)balance+=next.amount;return {...current,balance}}));
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
      const accountType=String(data.get("accountType"));const balance=accountType==="Credit card"?-Math.abs(amount):amount;
      props.setAccounts((items:Account[])=>[...items,{id:Date.now(),name,type:accountType,balance,digits:String(Math.floor(1000+Math.random()*8999)),color:"purple"}]);
    }
    props.notify(type==="account"?"Manual demo account added. No bank is connected.":`${type[0].toUpperCase()+type.slice(1)} ${item?"updated":"added"} successfully.`);close();
  };
  const titles:Record<string,string>={transaction:item?"Edit transaction":"Add a transaction",budget:item?"Edit category budget":"Create a category budget",goal:item?"Edit savings goal":"Create a savings goal",bill:item?"Edit recurring payment":"Add recurring payment",account:"Add a manual account"};
  return <div className="modal-backdrop" onMouseDown={event=>{if(event.currentTarget===event.target)close()}}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><span>{type==="account"?"SIMULATED ACCOUNT":item?"EDIT DETAILS":"QUICK ADD"}</span><h2 id="modal-title">{titles[type]}</h2></div><button onClick={close} aria-label="Close form"><Icon name="close"/></button></div><form onSubmit={submit}>
    {type==="account"&&<div className="demo-notice"><Icon name="shield"/><span>This is a manual demo account. Never enter real bank usernames, passwords, or credentials.</span></div>}
    <label>{type==="transaction"?"Description":type==="budget"?"Category name":type==="account"?"Account name":"Name"}<input name="name" defaultValue={item?.merchant||item?.category||item?.name||""} placeholder={type==="transaction"?"e.g. Campus coffee":type==="goal"?"e.g. Spring break":"Enter a name"} autoFocus/></label>
    <label>{type==="account"?"Current demo balance":type==="budget"?"Spending limit":type==="goal"?"Target amount":"Amount"}<div className="money-input"><span>$</span><input name="amount" type="number" min="0.01" step="0.01" defaultValue={item?Math.abs(item.amount??item.limit??item.target):""} placeholder="0.00"/></div></label>
    {type==="transaction"&&<><div className="form-grid"><label>Type<select name="direction" defaultValue={item?.amount>0?"income":"expense"}><option value="expense">Expense</option><option value="income">Income</option></select></label><label>Category<select name="category" defaultValue={item?.category||"Groceries"}>{[...categories,"Income"].map(category=><option key={category}>{category}</option>)}</select></label></div><div className="form-grid"><label>Date<input name="date" defaultValue={item?.date||"Mar 18"}/></label><label>Account<select name="account" defaultValue={item?.account}>{props.accounts.map((account:Account)=><option key={account.id}>{account.name}</option>)}</select></label></div></>}
    {type==="goal"&&<div className="form-grid"><label>Already saved<input name="saved" type="number" min="0" step="0.01" defaultValue={item?.saved||0}/></label><label>Target date<input name="date" defaultValue={item?.date||""} placeholder="Dec 31, 2025"/></label></div>}
    {type==="bill"&&<div className="form-grid"><label>Next charge<input name="date" defaultValue={item?.due||""} placeholder="Apr 5"/></label><label>Frequency<select name="frequency" defaultValue={item?.frequency||"Monthly"}><option>Monthly</option><option>Weekly</option><option>Yearly</option></select></label></div>}
    {type==="account"&&<label>Account type<select name="accountType"><option>Checking</option><option>Savings</option><option>Credit card</option></select></label>}
    {error&&<div className="form-error" role="alert">{error}</div>}<div className="modal-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button type="submit">{item?"Save changes":type==="account"?"Add demo account":titles[type]}</Button></div>
  </form></div></div>;
}

function ConfirmDialog({title,copy,cancel,confirm}:{title:string;copy:string;cancel:()=>void;confirm:()=>void}) {
  return <div className="modal-backdrop"><div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"><div className="confirm-icon"><Icon name="trash"/></div><h2 id="confirm-title">{title}</h2><p>{copy}</p><div className="modal-actions"><Button variant="secondary" onClick={cancel}>Cancel</Button><Button variant="danger" onClick={confirm}>Confirm and continue</Button></div></div></div>;
}

export default App;
