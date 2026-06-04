import { Layout } from "../components/Layout"
import { locales } from "@workspace/locales"
import { useAppStore } from "@workspace/store"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/index"
import { Users, Activity, CreditCard, DollarSign } from "lucide-react"

export function Home() {
  const { language } = useAppStore()
  const t = locales[language].app

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign,
    },
    {
      title: "Subscriptions",
      value: "+2350",
      description: "+180.1% from last month",
      icon: Users,
    },
    {
      title: "Sales",
      value: "+12,234",
      description: "+19% from last month",
      icon: CreditCard,
    },
    {
      title: "Active Now",
      value: "+573",
      description: "+201 since last hour",
      icon: Activity,
    },
  ]

  return (
    <Layout className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t.hello} 👋
          </h1>
          <p className="text-muted-foreground">
            {t.welcome}
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both" style={{ animationDelay: `400ms` }}>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] flex items-center justify-center border-2 border-dashed border-muted rounded-xl mx-4 mb-4 bg-muted/5">
                <p className="text-muted-foreground text-sm">Chart Placeholder (e.g. Recharts)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mx-4 space-y-1">
                      <p className="text-sm font-medium leading-none">New User Registered</p>
                      <p className="text-sm text-muted-foreground">User {i + 1} created an account.</p>
                    </div>
                    <div className="mr-auto rtl:mr-0 rtl:ml-auto font-medium text-xs text-muted-foreground">
                      Just now
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  )
}
