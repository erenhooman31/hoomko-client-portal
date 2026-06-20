import { useEffect, useMemo, useState } from 'react'
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
  { code: 'INV-120', title: 'فاز طراحی و تحلیل', state: 'پرداخت شده', amount: '۲۵ میلیون', date: 'هفته ۱' },
  { code: 'INV-121', title: 'پیاده سازی پنل', state: 'در انتظار', amount: '۴۵ میلیون', date: 'هفته ۳' },
  { code: 'INV-122', title: 'پشتیبانی ماه اول', state: 'برنامه ریزی', amount: '۱۲ میلیون', date: 'بعد از تحویل' },
]
const files = [
  ['مستند نیازمندی پروژه', 'PDF', '۲.۴MB'],
  ['نقشه API و Webhook', 'DOC', '۱.۱MB'],
  ['راهنمای تحویل پنل', 'PDF', '۳.۰MB'],
]

function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  function updateValue(nextValue) {
    setValue((current) => {
      const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue
      window.localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }

  return [value, updateValue]
}

function useApiStatus(path) {
  const [status, setStatus] = useState({ state: 'در حال بررسی', detail: 'اتصال API در حال تست است.' })

  useEffect(() => {
    let ignore = false
    fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((payload) => {
        if (!ignore) setStatus({ state: 'فعال', detail: `${payload.service} - ${payload.capabilities.join('، ')}` })
      })
      .catch(() => {
        if (!ignore) setStatus({ state: 'دموی محلی', detail: 'روی Vercel endpoint زنده دارد؛ در لوکال با داده امن اجرا می شود.' })
      })
    return () => {
      ignore = true
    }
  }, [path])

  return status
}

function Toast({ message }) {
  return message ? <div className="toast" role="status">{message}</div> : null
}

function IntakeForm({ intake, setIntake, notify }) {
  function updateField(field, value) {
    setIntake((current) => ({ ...current, [field]: value }))
  }

  return (
    <article className="panel intake">
      <div className="panel-head">
        <div>
          <p className="label">شروع پروژه</p>
          <h2>فرم دریافت نیازمندی کارفرما</h2>
        </div>
        <span className="badge">ذخیره محلی</span>
      </div>
      <div className="form-grid">
        <label>
          نوع پروژه
          <select value={intake.type} onChange={(event) => updateField('type', event.target.value)}>
            <option>فروشگاه اینترنتی</option>
            <option>اتوماسیون n8n</option>
            <option>پرتال مشتریان</option>
          </select>
        </label>
        <label>
          اولویت
          <select value={intake.priority} onChange={(event) => updateField('priority', event.target.value)}>
            <option>زمان تحویل سریع</option>
            <option>کاهش خطای عملیات</option>
            <option>گزارش مدیریتی دقیق</option>
          </select>
        </label>
        <label className="wide">
          هدف اصلی
          <textarea value={intake.goal} onChange={(event) => updateField('goal', event.target.value)} rows="3" />
        </label>
      </div>
      <button className="primary" onClick={() => notify('نیازمندی پروژه در مرورگر ذخیره شد.')} type="button">ثبت نیازمندی</button>
    </article>
  )
}

function ProjectBoard({ activeProject, setActiveProjectName, approvals, setApprovals, notify }) {
  const approvedCount = milestones.filter((item) => approvals[item]).length
  const accepted = approvedCount === milestones.length

  function toggleMilestone(item) {
    setApprovals((current) => ({ ...current, [item]: !current[item] }))
  }

  return (
    <section className="main-grid">
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
            <button className={approvals[item] ? 'done' : ''} key={item} onClick={() => toggleMilestone(item)} type="button">
              <span>{index + 1}</span>
              <p>{item}</p>
              <small>{approvals[item] ? 'تایید شد' : 'در انتظار تایید'}</small>
            </button>
          ))}
        </div>
        <div className="acceptance">
          <strong>{accepted ? 'تحویل پروژه تایید شده است' : `${approvedCount} از ${milestones.length} مرحله تایید شده`}</strong>
          <button className="secondary" onClick={() => { setApprovals(Object.fromEntries(milestones.map((item) => [item, true]))); notify('همه مراحل برای پذیرش تحویل تایید شد.') }} type="button">
            تایید همه مراحل
          </button>
        </div>
      </article>
    </section>
  )
}

function TicketsPanel({ ticketState, setTicketState, activeTicketCode, setActiveTicketCode, ticketReplies, setTicketReplies, closedTickets, setClosedTickets, notify }) {
  const ticketList = tickets.map((ticket) => ({ ...ticket, state: closedTickets.includes(ticket.code) ? 'بسته شده' : ticket.state }))
  const filteredTickets = ticketState === 'همه' ? ticketList : ticketList.filter((ticket) => ticket.state === ticketState)
  const activeTicket = ticketList.find((ticket) => ticket.code === activeTicketCode) || ticketList[0]
  const replies = ticketReplies[activeTicket.code] || []
  const [draft, setDraft] = useState('')

  function addReply() {
    const trimmed = draft.trim()
    if (!trimmed) return
    const reply = { text: trimmed, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }
    setTicketReplies((current) => ({ ...current, [activeTicket.code]: [reply, ...(current[activeTicket.code] || [])] }))
    setDraft('')
    notify(`پاسخ برای ${activeTicket.code} ثبت شد.`)
  }

  function closeTicket() {
    setClosedTickets((current) => (current.includes(activeTicket.code) ? current : [...current, activeTicket.code]))
    notify(`تیکت ${activeTicket.code} بسته شد.`)
  }

  return (
    <article className="panel tickets">
      <div className="panel-head">
        <div>
          <p className="label">پشتیبانی</p>
          <h2>تیکت ها</h2>
        </div>
        <div className="filters">
          {['همه', 'باز', 'در حال بررسی', 'برنامه ریزی', 'بسته شده'].map((item) => (
            <button className={ticketState === item ? 'active' : ''} key={item} onClick={() => setTicketState(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="ticket-grid">
        <div>
          {filteredTickets.map((ticket) => (
            <button className={activeTicket.code === ticket.code ? 'ticket active-ticket' : 'ticket'} key={ticket.code} onClick={() => setActiveTicketCode(ticket.code)} type="button">
              <strong>{ticket.code}</strong>
              <span>{ticket.title}</span>
              <small>{ticket.priority}</small>
              <em>{ticket.state}</em>
            </button>
          ))}
        </div>
        <section className="ticket-detail" aria-label="جزئیات تیکت">
          <p className="label">پاسخ و بستن تیکت</p>
          <h3>{activeTicket.title}</h3>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="پاسخ نمونه برای کارفرما..." rows="3" />
          <div className="action-row">
            <button className="primary" onClick={addReply} type="button">ثبت پاسخ</button>
            <button className="secondary" onClick={closeTicket} type="button">بستن تیکت</button>
          </div>
          <div className="reply-list">
            {replies.length === 0 && <p className="empty-state">هنوز پاسخی ثبت نشده است.</p>}
            {replies.map((reply) => (
              <div key={`${reply.time}-${reply.text}`}>
                <time>{reply.time}</time>
                <p>{reply.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}

function InvoicesPage() {
  return (
    <section className="list-page">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="label">مالی پروژه</p>
            <h2>صورت حساب و وضعیت پرداخت</h2>
          </div>
        </div>
        <div className="invoice-timeline">
          {invoices.map((invoice) => (
            <div className={invoice.state === 'پرداخت شده' ? 'ledger-row paid' : 'ledger-row'} key={invoice.code}>
              <strong>{invoice.code}</strong>
              <span>{invoice.title}</span>
              <em>{invoice.state}</em>
              <b>{invoice.amount}</b>
              <small>{invoice.date}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

function FilesPage({ activeProject, approvals, intake, notify }) {
  function exportDeliverySummary() {
    const payload = {
      generatedAt: new Date().toISOString(),
      project: activeProject,
      intake,
      approvals,
      files: files.map(([title, type, size]) => ({ title, type, size })),
      note: 'این فایل نمونه برای نمایش فرآیند تحویل است و شامل داده واقعی مشتری نیست.',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'client-delivery-summary.json'
    link.click()
    URL.revokeObjectURL(url)
    notify('خلاصه تحویل پروژه ساخته شد.')
  }

  return (
    <section className="list-page">
      <article className="panel">
        <div className="panel-head">
          <div>
            <p className="label">مستندات تحویل</p>
            <h2>فایل ها و Handoff پروژه</h2>
          </div>
          <button className="primary" onClick={exportDeliverySummary} type="button">خروجی تحویل</button>
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
  )
}

function ValueSection() {
  return (
    <section className="value-panel" aria-label="ارزش پروژه برای کارفرما">
      <div>
        <p className="label">چرا این پروژه برای کارفرما ارزش دارد؟</p>
        <h2>اعتماد کارفرما را با تحویل مرحله ای، تیکت، فایل و صورت حساب بساز.</h2>
      </div>
      <ul>
        <li>کارفرما هر مرحله، تیکت و پرداخت را در یک مسیر شفاف می بیند.</li>
        <li>تیم پروژه می تواند تایید تحویل، پاسخ پشتیبانی و فایل نهایی را بدون پراکندگی مدیریت کند.</li>
        <li>خروجی Handoff نشان می دهد پروژه بعد از تحویل هم قابل پیگیری و پشتیبانی است.</li>
      </ul>
    </section>
  )
}

function ProductStory({ apiStatus }) {
  return (
    <section className="story-grid" aria-label="معرفی محصول پرتال مشتریان">
      <article className="story-main">
        <h2>پرتالی که اعتماد کارفرما را قبل از قرارداد می سازد</h2>
        <p>این محصول مسیر کامل همکاری را نشان می دهد: ثبت نیازمندی، پروژه، تایید مرحله ها، تیکت، صورت حساب و تحویل فایل. برای فروش فردا آماده است و برای نسخه واقعی می تواند به auth، database و file storage متصل شود.</p>
      </article>
      <article className="live-proof">
        <span>وضعیت API</span>
        <strong>{apiStatus.state}</strong>
        <p>{apiStatus.detail}</p>
      </article>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section className="architecture">
      <div>
        <h2>معماری قابل توسعه</h2>
        <p>لایه UI فارسی، API serverless، مدل پروژه، تیکت، تایید تحویل، صورت حساب و Handoff برای اتصال به بک اند واقعی.</p>
      </div>
      {['Client UI', 'Ticket API', 'Milestones', 'Invoices', 'Handoff'].map((item, index) => (
        <div className="arch-node" key={item}>
          <span>{index + 1}</span>
          <strong>{item}</strong>
        </div>
      ))}
    </section>
  )
}

function ProblemSolutionSection() {
  const problems = ['پیگیری پروژه در پیام رسان', 'ابهام در تحویل مرحله ای', 'تیکت های پراکنده', 'فایل و صورت حساب نامنظم']
  const solutions = ['پرتال اختصاصی مشتری', 'تایید مرحله ها', 'تاریخچه تیکت و پاسخ', 'Handoff و invoice timeline']

  return (
    <section className="problem-solution" aria-label="مشکل و راه حل پرتال">
      <div>
        <h2>مشکل کسب و کار</h2>
        {problems.map((item) => <p key={item}>{item}</p>)}
      </div>
      <div>
        <h2>راه حل آماده فروش</h2>
        {solutions.map((item) => <p key={item}>{item}</p>)}
      </div>
    </section>
  )
}

function OfferSection() {
  return (
    <section className="offer-band" aria-label="پیشنهاد فروش پرتال">
      <div>
        <h2>پکیج آماده برای آژانس ها و فریلنسرها</h2>
        <p>پرتال اختصاصی مشتری با داشبورد پروژه، تیکت، تایید مرحله ای، صورت حساب، فایل تحویل و نسخه آماده اتصال به بک اند.</p>
      </div>
      <ul>
        <li>تحویل نسخه نمایشی برندشده در ۳ روز کاری</li>
        <li>قابل توسعه با نقش مشتری، مدیر پروژه و پشتیبانی</li>
        <li>مناسب فروش به تیم های خدماتی، آژانس ها و فروشگاه ها</li>
      </ul>
    </section>
  )
}

function PricingSection() {
  const plans = [
    ['فریلنسر', '۱,۹۹۰,۰۰۰', 'برندینگ، داشبورد پروژه، تیکت پایه'],
    ['تیم حرفه ای', '۴,۴۹۰,۰۰۰', 'تیکت، فایل، صورت حساب، تحویل مرحله ای'],
    ['سازمانی', 'تماس بگیرید', 'نقش ها، بک اند واقعی، فایل استوریج'],
  ]

  return (
    <section className="pricing-grid" aria-label="پکیج های فروش پرتال">
      {plans.map(([name, price, text], index) => (
        <article className={index === 1 ? 'price-card featured' : 'price-card'} key={name}>
          <span>{name}</span>
          <strong>{price}</strong>
          <p>{text}</p>
          <button className={index === 1 ? 'primary' : 'secondary'} type="button">انتخاب پلن</button>
        </article>
      ))}
    </section>
  )
}

function SuiteLinks() {
  return (
    <section className="suite-links" aria-label="دیگر محصولات Hoomko">
      <a href="https://hoomko-commerce-ops.vercel.app">داشبورد فروشگاه</a>
      <a href="https://hoomko-automation-hub.vercel.app">هاب اتوماسیون</a>
      <a href="https://github.com/erenhooman31/hoomko-client-portal">GitHub</a>
    </section>
  )
}

function App() {
  const [section, setSection] = usePersistentState('portal-section', 'داشبورد')
  const [activeProjectName, setActiveProjectName] = usePersistentState('portal-active-project', projects[0].name)
  const [ticketState, setTicketState] = usePersistentState('portal-ticket-state', 'همه')
  const [activeTicketCode, setActiveTicketCode] = usePersistentState('portal-active-ticket', tickets[0].code)
  const [ticketReplies, setTicketReplies] = usePersistentState('portal-ticket-replies', {})
  const [closedTickets, setClosedTickets] = usePersistentState('portal-closed-tickets', [])
  const [approvals, setApprovals] = usePersistentState('portal-approvals', { 'تحلیل نیازمندی': true, 'طراحی ساختار': true })
  const [intake, setIntake] = usePersistentState('portal-intake', {
    type: 'اتوماسیون n8n',
    priority: 'کاهش خطای عملیات',
    goal: 'ساخت پرتال فارسی برای مدیریت پروژه، تیکت، تحویل و صورت حساب.',
  })
  const [toast, setToast] = useState('')
  const apiStatus = useApiStatus('/api/health')
  const activeProject = projects.find((project) => project.name === activeProjectName) || projects[0]

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const openTicketsCount = useMemo(
    () => tickets.filter((ticket) => !closedTickets.includes(ticket.code) && ticket.state !== 'برنامه ریزی').length,
    [closedTickets],
  )

  return (
    <main className="portal" dir="rtl">
      <a className="skip-link" href="#portal-content">رفتن به محتوای اصلی</a>
      <Toast message={toast} />
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
            <p className="hero-copy">یک محصول قابل فروش برای شفاف سازی همکاری، تحویل پروژه و پشتیبانی مشتریان.</p>
          </div>
          <button className="primary" type="button" onClick={() => { setActiveProjectName(projects[2].name); notify('پروژه اتوماسیون انتخاب شد.') }}>
            مشاهده پروژه اتوماسیون
          </button>
        </header>

        {section === 'داشبورد' && (
          <>
            <ProductStory apiStatus={apiStatus} />
            <ProblemSolutionSection />
            <section className="summary">
              <article>
                <span>پروژه فعال</span>
                <strong>{projects.length}</strong>
                <small>با وضعیت و بودجه شفاف</small>
              </article>
              <article>
                <span>تیکت باز</span>
                <strong>{openTicketsCount}</strong>
                <small>قابل فیلتر و پیگیری</small>
              </article>
              <article>
                <span>تحویل میانگین</span>
                <strong>۲۱ روز</strong>
                <small>برای پروژه های مشابه</small>
              </article>
            </section>
            <IntakeForm intake={intake} setIntake={setIntake} notify={notify} />
          </>
        )}

        {(section === 'داشبورد' || section === 'پروژه ها') && <ProjectBoard activeProject={activeProject} setActiveProjectName={setActiveProjectName} approvals={approvals} setApprovals={setApprovals} notify={notify} />}

        {(section === 'داشبورد' || section === 'تیکت ها') && (
          <TicketsPanel ticketState={ticketState} setTicketState={setTicketState} activeTicketCode={activeTicketCode} setActiveTicketCode={setActiveTicketCode} ticketReplies={ticketReplies} setTicketReplies={setTicketReplies} closedTickets={closedTickets} setClosedTickets={setClosedTickets} notify={notify} />
        )}

        {section === 'صورت حساب' && <InvoicesPage />}
        {section === 'فایل ها' && <FilesPage activeProject={activeProject} approvals={approvals} intake={intake} notify={notify} />}
        {(section === 'داشبورد' || section === 'پروژه ها') && (
          <>
            <ArchitectureSection />
            <OfferSection />
            <PricingSection />
            <ValueSection />
            <SuiteLinks />
          </>
        )}
      </section>
    </main>
  )
}

export default App
