import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.statCard.deleteMany();
  await prisma.salesPoint.deleteMany();
  await prisma.activeUsersPoint.deleteMany();
  await prisma.activeUsersStat.deleteMany();
  await prisma.satisfactionRate.deleteMany();
  await prisma.referralPoint.deleteMany();
  await prisma.referralSummary.deleteMany();
  await prisma.project.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.author.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.scoreRing.deleteMany();

  await prisma.statCard.createMany({
    data: [
      {
        key: "money",
        title: "Today's Money",
        value: "$53,000",
        changePct: 55,
        changeLabel: "since last month",
        icon: "wallet",
        color: "dark",
        order: 0,
      },
      {
        key: "users",
        title: "Today's Users",
        value: "2,300",
        changePct: 5,
        changeLabel: "since last week",
        icon: "globe",
        color: "info",
        order: 1,
      },
      {
        key: "clients",
        title: "New Clients",
        value: "+3,052",
        changePct: -14,
        changeLabel: "since last quarter",
        icon: "file-text",
        color: "success",
        order: 2,
      },
      {
        key: "sales",
        title: "Total Sales",
        value: "$173,000",
        changePct: 8,
        changeLabel: "than last month",
        icon: "cart",
        color: "primary",
        order: 3,
      },
    ],
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesValues = [190, 210, 235, 350, 355, 460, 430, 310, 355, 320, 180, 430];
  const salesSecondary = [500, 210, 215, 260, 290, 250, 275, 230, 120, 150, 370, 130];
  await prisma.salesPoint.createMany({
    data: months.map((month, i) => ({
      month,
      value: salesValues[i],
      secondary: salesSecondary[i],
      order: i,
    })),
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activeValues = [120, 350, 150, 80, 500, 190, 500];
  await prisma.activeUsersPoint.createMany({
    data: days.map((day, i) => ({ day, value: activeValues[i], order: i })),
  });

  await prisma.activeUsersStat.createMany({
    data: [
      { label: "Users", value: "32,984", icon: "users", order: 0 },
      { label: "Clicks", value: "2.42m", icon: "cursor", order: 1 },
      { label: "Sales", value: "2,400$", icon: "cart", order: 2 },
      { label: "Items", value: "320", icon: "package", order: 3 },
    ],
  });

  await prisma.satisfactionRate.create({
    data: { value: 95, label: "Based on likes", totalVotes: 1284 },
  });

  await prisma.scoreRing.create({
    data: { label: "Safety", value: 9.3, maxValue: 10, caption: "Total Score" },
  });

  const referralMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const invitedValues = [10, 18, 14, 26, 20, 32];
  const bonusValues = [5, 8, 6, 14, 11, 19];
  await prisma.referralPoint.createMany({
    data: [
      ...referralMonths.map((month, i) => ({
        series: "invited",
        month,
        value: invitedValues[i],
        order: i,
      })),
      ...referralMonths.map((month, i) => ({
        series: "bonus",
        month,
        value: bonusValues[i],
        order: i,
      })),
    ],
  });

  await prisma.referralSummary.createMany({
    data: [
      { series: "invited", total: "145 people", changePct: 24 },
      { series: "bonus", total: "1,465", changePct: 12 },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        name: "Material UI XD",
        icon: "figma",
        members: "AB,CD,EF",
        budget: "$14,000",
        completion: 60,
        status: "working",
        order: 0,
      },
      {
        name: "Add Progress Track",
        icon: "atlassian",
        members: "GH,IJ",
        budget: "$3,000",
        completion: 10,
        status: "working",
        order: 1,
      },
      {
        name: "Fix Platform Errors",
        icon: "slack",
        members: "KL,MN,OP",
        budget: "Not set",
        completion: 100,
        status: "done",
        order: 2,
      },
      {
        name: "Launch our Mobile App",
        icon: "spotify",
        members: "QR,ST",
        budget: "$20,500",
        completion: 100,
        status: "done",
        order: 3,
      },
      {
        name: "Add the New Pricing Page",
        icon: "jira",
        members: "UV,WX,YZ",
        budget: "$500",
        completion: 25,
        status: "working",
        order: 4,
      },
      {
        name: "Redesign New Online Store",
        icon: "invision",
        members: "AB,GH",
        budget: "$2,000",
        completion: 40,
        status: "cancelled",
        order: 5,
      },
    ],
  });

  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  await prisma.orderEvent.createMany({
    data: [
      {
        title: "$2400, Design changes",
        description: "22 DEC 7:20 PM",
        date: daysAgo(0),
        color: "info",
        icon: "bell",
        order: 0,
      },
      {
        title: "New order #4219423",
        description: "21 DEC 11:21 PM",
        date: daysAgo(1),
        color: "danger",
        icon: "credit-card",
        order: 1,
      },
      {
        title: "Server Payments for April",
        description: "21 DEC 9:28 PM",
        date: daysAgo(1),
        color: "info",
        icon: "cart",
        order: 2,
      },
      {
        title: "New card added for order #3210145",
        description: "20 DEC 3:52 PM",
        date: daysAgo(2),
        color: "warning",
        icon: "wallet",
        order: 3,
      },
      {
        title: "Unlock packages for Development",
        description: "19 DEC 11:35 PM",
        date: daysAgo(4),
        color: "dark",
        icon: "none",
        order: 4,
      },
      {
        title: "New order #9851258",
        description: "18 DEC 4:41 PM",
        date: daysAgo(5),
        color: "primary",
        icon: "figma",
        order: 5,
      },
    ],
  });

  await prisma.author.createMany({
    data: [
      {
        name: "John Michael",
        email: "john@creative-tim.com",
        avatarColor: "primary",
        function: "Manager",
        department: "Organization",
        status: "online",
        employed: "23/04/18",
        order: 0,
      },
      {
        name: "Alexa Liras",
        email: "alexa@creative-tim.com",
        avatarColor: "info",
        function: "Programmer",
        department: "Developer",
        status: "offline",
        employed: "11/01/19",
        order: 1,
      },
      {
        name: "Laurent Perrier",
        email: "laurent@creative-tim.com",
        avatarColor: "success",
        function: "Executive",
        department: "Projects",
        status: "online",
        employed: "19/09/17",
        order: 2,
      },
      {
        name: "Michael Levi",
        email: "michael@creative-tim.com",
        avatarColor: "warning",
        function: "Programmer",
        department: "Developer",
        status: "online",
        employed: "24/12/08",
        order: 3,
      },
      {
        name: "Richard Gran",
        email: "richard@creative-tim.com",
        avatarColor: "danger",
        function: "Manager",
        department: "Executive",
        status: "offline",
        employed: "04/10/21",
        order: 4,
      },
      {
        name: "Miriam Eric",
        email: "miriam@creative-tim.com",
        avatarColor: "dark",
        function: "Programmer",
        department: "Developer",
        status: "offline",
        employed: "14/09/20",
        order: 5,
      },
      {
        name: "Priya Kapoor",
        email: "priya@creative-tim.com",
        avatarColor: "info",
        function: "Designer",
        department: "UI/UX",
        status: "online",
        employed: "02/02/22",
        order: 6,
      },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      { date: "March, 01 2026", code: "#MS-415646", amount: "$180", order: 0 },
      { date: "February, 10 2026", code: "#RV-126749", amount: "$250", order: 1 },
      { date: "January, 12 2026", code: "#RV-115313", amount: "$305", order: 2 },
      { date: "November, 28 2025", code: "#FB-212562", amount: "$180", order: 3 },
      { date: "October, 04 2025", code: "#QW-103578", amount: "$400", order: 4 },
      { date: "September, 02 2025", code: "#AR-803481", amount: "$95", order: 5 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
