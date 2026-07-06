import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FilePlus2,
    ShieldCheck,
    Ticket,
    UserCog,
} from 'lucide-react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="dashboardPage">
                <section className="dashboardHero">
                    <div>
                        <p className="dashboardEyebrow">Dashboard</p>
                        <h1>Good morning, Lucas</h1>
                        <p>Here's what's happening with your tickets today.</p>
                    </div>

                    <button className="dateSelector" type="button">
                        <CalendarDays size={16} />
                        <span>May 20, 2024</span>
                    </button>
                </section>

                <section className="summaryGrid" aria-label="Ticket summary">
                    <article className="dashboardCard summaryCard">
                        <div className="summaryIcon summaryIconBlue">
                            <Ticket size={22} />
                        </div>
                        <div>
                            <span>Open Tickets</span>
                            <strong>28</strong>
                            <small>
                                <ArrowUpRight size={13} />
                                8% vs yesterday
                            </small>
                        </div>
                    </article>

                    <article className="dashboardCard summaryCard">
                        <div className="summaryIcon summaryIconAmber">
                            <Clock3 size={22} />
                        </div>
                        <div>
                            <span>Due Today</span>
                            <strong>7</strong>
                            <small className="warningTrend">
                                <ArrowUpRight size={13} />
                                3% vs yesterday
                            </small>
                        </div>
                    </article>

                    <article className="dashboardCard summaryCard">
                        <div className="summaryIcon summaryIconRed">
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <span>SLA Breached</span>
                            <strong>2</strong>
                            <small className="dangerTrend">
                                <ArrowUpRight size={13} />1 vs yesterday
                            </small>
                        </div>
                    </article>

                    <article className="dashboardCard summaryCard">
                        <div className="summaryIcon summaryIconGreen">
                            <CheckCircle2 size={22} />
                        </div>
                        <div>
                            <span>Resolved Today</span>
                            <strong>15</strong>
                            <small>
                                <ArrowUpRight size={13} />
                                20% vs yesterday
                            </small>
                        </div>
                    </article>
                </section>

                <section className="dashboardGrid">
                    <article className="dashboardCard dashboardPanel priorityPanel">
                        <div className="panelHeader">
                            <div className="panelTitleGroup">
                                <h2>Priority Tickets</h2>
                                <span className="countBadge">2</span>
                            </div>
                            <a href="#">View all</a>
                        </div>

                        <div className="ticketList">
                            <div className="priorityTicket">
                                <div>
                                    <strong>TKT-1048</strong>
                                    <p>Payment gateway not responding</p>
                                    <span>Sarah Johnson · High Priority</span>
                                </div>
                                <div className="ticketMeta">
                                    <span className="dangerBadge">
                                        SLA Breached
                                    </span>
                                    <small>15m ago</small>
                                </div>
                            </div>

                            <div className="priorityTicket">
                                <div>
                                    <strong>TKT-1032</strong>
                                    <p>Unable to access reports</p>
                                    <span>Acme Corp · High Priority</span>
                                </div>
                                <div className="ticketMeta">
                                    <span className="warningBadge">
                                        Due in 30m
                                    </span>
                                    <small>30m ago</small>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="dashboardCard dashboardPanel statusPanel">
                        <div className="panelHeader">
                            <h2>Ticket Status Overview</h2>
                        </div>

                        <div className="statusOverview">
                            <div className="statusDonut">
                                <div>
                                    <strong>28</strong>
                                    <span>Total</span>
                                </div>
                            </div>

                            <div className="statusLegend">
                                <div>
                                    <span className="legendDot legendBlue" />
                                    <p>Open</p>
                                    <strong>28 (40%)</strong>
                                </div>
                                <div>
                                    <span className="legendDot legendSky" />
                                    <p>In Progress</p>
                                    <strong>20 (28%)</strong>
                                </div>
                                <div>
                                    <span className="legendDot legendAmber" />
                                    <p>Waiting</p>
                                    <strong>12 (17%)</strong>
                                </div>
                                <div>
                                    <span className="legendDot legendGreen" />
                                    <p>Resolved</p>
                                    <strong>10 (15%)</strong>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="dashboardCard dashboardPanel activityPanel">
                        <div className="panelHeader">
                            <h2>Recent Activity</h2>
                            <a href="#">View all</a>
                        </div>

                        <div className="activityList">
                            <div className="activityItem">
                                <span className="activityIcon activityIconBlue">
                                    <Ticket size={16} />
                                </span>
                                <div>
                                    <strong>TKT-1047 Updated</strong>
                                    <p>Email configuration issue</p>
                                </div>
                                <small>10m ago</small>
                            </div>
                            <div className="activityItem">
                                <span className="activityIcon activityIconGreen">
                                    <CheckCircle2 size={16} />
                                </span>
                                <div>
                                    <strong>TKT-1046 Resolved</strong>
                                    <p>Login page error</p>
                                </div>
                                <small>1h ago</small>
                            </div>
                            <div className="activityItem">
                                <span className="activityIcon activityIconAmber">
                                    <Clock3 size={16} />
                                </span>
                                <div>
                                    <strong>
                                        TKT-1045 Waiting for customer
                                    </strong>
                                    <p>Need additional information</p>
                                </div>
                                <small>2h ago</small>
                            </div>
                            <div className="activityItem">
                                <span className="activityIcon activityIconBlue">
                                    <Ticket size={16} />
                                </span>
                                <div>
                                    <strong>TKT-1044 Created</strong>
                                    <p>Performance issues on dashboard</p>
                                </div>
                                <small>3h ago</small>
                            </div>
                        </div>
                    </article>

                    <article className="dashboardCard dashboardPanel slaPanel">
                        <div className="panelHeader">
                            <h2>Tickets Approaching SLA</h2>
                            <a href="#">View all</a>
                        </div>

                        <div className="slaList">
                            <div className="slaItem">
                                <span className="slaIcon">
                                    <Clock3 size={15} />
                                </span>
                                <div>
                                    <strong>TKT-1031</strong>
                                    <p>Data sync failure</p>
                                    <small>Acme Corp · Medium</small>
                                </div>
                                <time>1h 20m</time>
                            </div>
                            <div className="slaItem">
                                <span className="slaIcon">
                                    <Clock3 size={15} />
                                </span>
                                <div>
                                    <strong>TKT-1042</strong>
                                    <p>Cannot upload files</p>
                                    <small>Globex Inc · Medium</small>
                                </div>
                                <time>2h 15m</time>
                            </div>
                            <div className="slaItem">
                                <span className="slaIcon">
                                    <Clock3 size={15} />
                                </span>
                                <div>
                                    <strong>TKT-1043</strong>
                                    <p>Notification not working</p>
                                    <small>Initech · Low</small>
                                </div>
                                <time>3h 45m</time>
                            </div>
                        </div>
                    </article>

                    <article className="dashboardCard dashboardPanel performancePanel">
                        <div className="panelHeader">
                            <div className="panelTitleGroup">
                                <h2>My Performance</h2>
                                <span>This Month</span>
                            </div>
                            <a href="#">View insights</a>
                        </div>

                        <div className="performanceStats">
                            <div>
                                <span>Resolved</span>
                                <strong>142</strong>
                                <small>18%</small>
                            </div>
                            <div>
                                <span>Response Time</span>
                                <strong>2h 34m</strong>
                                <small>12%</small>
                            </div>
                            <div>
                                <span>SLA Compliance</span>
                                <strong>96%</strong>
                                <small>5%</small>
                            </div>
                            <div>
                                <span>CSAT Score</span>
                                <strong>4.7</strong>
                                <small>0.3</small>
                            </div>
                        </div>

                        <div
                            className="performanceChart"
                            aria-label="Static performance chart"
                        >
                            <svg viewBox="0 0 420 140" role="img">
                                <path
                                    className="performanceChartGlow"
                                    d="M12 118 C 48 98, 70 108, 98 84 S 152 60, 184 78 S 244 34, 286 40 S 342 64, 408 44"
                                    fill="none"
                                    strokeWidth="14"
                                    strokeLinecap="round"
                                    opacity="0.45"
                                />
                                <path
                                    className="performanceChartLine"
                                    d="M12 118 C 48 98, 70 108, 98 84 S 152 60, 184 78 S 244 34, 286 40 S 342 64, 408 44"
                                    fill="none"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <line
                                    className="performanceChartAxis"
                                    x1="12"
                                    y1="124"
                                    x2="408"
                                    y2="124"
                                />
                            </svg>
                            <div className="chartLabels">
                                <span>May 1</span>
                                <span>May 6</span>
                                <span>May 11</span>
                                <span>May 16</span>
                                <span>May 20</span>
                            </div>
                        </div>
                    </article>

                    <article className="dashboardCard dashboardPanel shortcutsPanel">
                        <div className="panelHeader">
                            <h2>Shortcuts</h2>
                        </div>

                        <div className="shortcutGrid">
                            <button className="shortcutItem" type="button">
                                <span className="shortcutIcon shortcutBlue">
                                    <FilePlus2 size={20} />
                                </span>
                                <strong>Create Ticket</strong>
                            </button>
                            <button className="shortcutItem" type="button">
                                <span className="shortcutIcon shortcutPurple">
                                    <BookOpen size={20} />
                                </span>
                                <strong>Knowledge Base</strong>
                            </button>
                            <button className="shortcutItem" type="button">
                                <span className="shortcutIcon shortcutGreen">
                                    <ShieldCheck size={20} />
                                </span>
                                <strong>SLA Policies</strong>
                            </button>
                            <button className="shortcutItem" type="button">
                                <span className="shortcutIcon shortcutGray">
                                    <UserCog size={20} />
                                </span>
                                <strong>My Settings</strong>
                            </button>
                        </div>
                    </article>
                </section>
            </div>
        </>
    );
}
