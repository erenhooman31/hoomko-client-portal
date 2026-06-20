import { useMemo, useState } from 'react'
import './App.css'

const projects = [
  { name: 'بازطراحی فروشگاه', type: 'WooCommerce', progress: 72, budget: '۸۵ میلیون', status: 'در حال اجرا' },
  { name: 'پنل مدیریت سفارش', type: 'React + Node.js', progress: 54, budget: '۱۲۰ میلیون', status: 'فاز توسعه' },
  { name: 'اتوماسیون CRM', type: 'n8n + API', progress: 88, budget: '۶۰ میلیون', status: 'تست نهایی' },
]

const tickets = [
  { code: 'TK-210', title: 'اتصال پیامک بعد از پرداخت', priority: 'بالا', state: 'باز' },
  { code: 'TK-214', title: 'بهینه سازی گزارش فروش', priority: 'متوسط', state: 'در حال بررسی' },
  { code: 'TK-219', title: 'دسترسی نقش مدیر محتوا', priority: 'پایین', state: 'برنامه ریزی' },
]

const milestones = ['تحلیل نیازمندی', 'طراحی ساختار', 'پیاده سازی', 'تست و تحویل']
const sections = ['داشبورد', 'پروژه ها', 'تیکت ها', 'صورت حساب', 'فایل ها']
const invoices = [
  ['INV-120', 'فاز طراحی و تحلیل', 'پرداخت شده', '۲۵ میلیون'],
  ['INV-121', 'پیاده سازی پنل', 'در انتظار', '۴۵ میلیون'],
  ['INV-122', 'پشتیبانی ماه اول', 'برنامه ریزی', '۱۲ میلیون'],
]
const files = [
  ['مستند نیازمندی پروژه', 'PDF', '۲.۴MB'],
  ['نقشه API و Webhook', 'DOC', '۱.۱MB'],
  ['راهنمای تحویل پنل', 'PDF', '۳.۰MB'],
]

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = window.localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  function updateValue(nextValue) {
    setValue(nextValue)
    window.localStorage.setItem(key, JSON.stringify(nextValue))
  }

  return [value, updateValue]
}

function App() {
  const [section, setSection] = usePersistentState('portal-section', 'داشبورد')
  const [activeProjectName, setActiveProjectName] = usePersistentState('portal-active-project', projects[0].name)
  const [ticketState, setTicketState] = usePersistentState('portal-ticket-state', 'همه')
  const activeProject = projects.find((project) => project.name === activeProjectName) || projects[0]

  const filteredTickets = useMemo(
    () => (ticketState === 'همه' ? tickets : tickets.filter((ticket) => ticket.state === ticketState)),
    [ticketState],
  )

  return (
    <main className="portal" dir="rtl">
      <a className="skip-link" href="#portal-content">رفتن به محتوای اصلی</a>
      <aside className="rail">
        <div className="identity">
          <span>H</span>
          <div>
            <strong>پرتال مشتریان</strong>
            <small>مدیریت پروژه و پشتیبانی</small>
          </div>
        </div>
        <nav aria-label="بخش های پرتال مشتریان">
          {sections.map((item) => (
          <button aria-current={section === item ? 'page' : undefined} className={section === item ? 'active' : ''} key={item} onClick={() => setSection(item)} type="button">
            {item}
          </button>
          ))}
        </nav>
      </aside>

      <section className="page" id="portal-content" tabIndex="-1">
        <header className="header">
          <div>
            <p className="label">نمونه کار full-stack</p>
            <h1>پرتال مدیریت پروژه، تیکت و تحویل مرحله ای</h1>
          </div>
          <button className="primary" type="button" onClick={() => setActiveProjectName(projects[2].name)}>
            مشاهده پروژه اتوماسیون
          </button>
        </header>

        {section === 'داشبورد' && <section className="summary">
          <article>
            <span>پروژه فعال</span>
            <strong>{projects.length}</strong>
            <small>با وضعیت و بودجه شفاف</small>
          </article>
          <article>
            <span>تیکت باز</span>
            <strong>{tickets.filter((ticket) => ticket.state !== 'برنامه ریزی').length}</strong>
            <small>قابل فیلتر و پیگیری</small>
          </article>
          <article>
            <span>تحویل میانگین</span>
            <strong>۲۱ روز</strong>
            <small>برای پروژه های مشابه</small>
          </article>
        </section>}

        {(section === 'داشبورد' || section === 'پروژه ها') && <section className="main-grid">
          <article className="panel projects">
            <div className="panel-head">
              <div>
                <p className="label">Portfolio CRM</p>
                <h2>پروژه ها</h2>
              </div>
            </div>
            {projects.map((project) => (
              <button
                className={project.name === activeProject.name ? 'project selected' : 'project'}
                key={project.name}
                onClick={() => setActiveProjectName(project.name)}
                type="button"
              >
                <span>{project.name}</span>
                <small>{project.type}</small>
                <i><b style={{ width: `${project.progress}%` }} /></i>
              </button>
            ))}
          </article>

          <article className="panel project-detail">
            <p className="label">پروژه انتخاب شده</p>
            <h2>{activeProject.name}</h2>
            <div className="detail-grid">
              <div><span>فناوری</span><strong>{activeProject.type}</strong></div>
              <div><span>بودجه</span><strong>{activeProject.budget}</strong></div>
              <div><span>وضعیت</span><strong>{activeProject.status}</strong></div>
              <div><span>پیشرفت</span><strong>{activeProject.progress}%</strong></div>
            </div>
            <div className="timeline">
              {milestones.map((item, index) => (
                <div className={index < 3 ? 'done' : ''} key={item}>
                  <span>{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>}

        {(section === 'داشبورد' || section === 'تیکت ها') && (
          <article className="panel tickets">
            <div className="panel-head">
              <div>
                <p className="label">پشتیبانی</p>
                <h2>تیکت ها</h2>
              </div>
              <div className="filters">
                {['همه', 'باز', 'در حال بررسی', 'برنامه ریزی'].map((item) => (
                  <button className={ticketState === item ? 'active' : ''} key={item} onClick={() => setTicketState(item)} type="button">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {filteredTickets.map((ticket) => (
              <div className="ticket" key={ticket.code}>
                <strong>{ticket.code}</strong>
                <span>{ticket.title}</span>
                <small>{ticket.priority}</small>
                <em>{ticket.state}</em>
              </div>
            ))}
          </article>
        )}

        {section === 'صورت حساب' && (
          <section className="list-page">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="label">مالی پروژه</p>
                  <h2>صورت حساب ها</h2>
                </div>
              </div>
              {invoices.map(([code, title, state, amount]) => (
                <div className="ledger-row" key={code}>
                  <strong>{code}</strong>
                  <span>{title}</span>
                  <em>{state}</em>
                  <b>{amount}</b>
                </div>
              ))}
            </article>
          </section>
        )}

        {section === 'فایل ها' && (
          <section className="list-page">
            <article className="panel">
              <div className="panel-head">
                <div>
                  <p className="label">مستندات تحویل</p>
                  <h2>فایل های پروژه</h2>
                </div>
              </div>
              {files.map(([title, type, size]) => (
                <div className="file-row" key={title}>
                  <span>{title}</span>
                  <em>{type}</em>
                  <strong>{size}</strong>
                </div>
              ))}
            </article>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
