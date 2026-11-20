import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.AUDIT_BASE_URL ?? 'http://localhost:5174'
const outDir = path.resolve('scripts/audit-output')
fs.mkdirSync(outDir, { recursive: true })

const findings = []
const note = (severity, area, message, extra = {}) => {
  findings.push({ severity, area, message, ...extra })
}

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

const routes = [
  '/',
  '/movies',
  '/series',
  '/genres',
  '/trending',
  '/login',
  '/signup',
  '/home',
  '/not-a-real-page',
]

async function collectConsole(page, bucket) {
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      bucket.push({ type: msg.type(), text: msg.text() })
    }
  })
  page.on('pageerror', (err) => {
    bucket.push({ type: 'pageerror', text: err.message })
  })
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const report = {
    base: BASE,
    testedAt: new Date().toISOString(),
    viewports: {},
    routes: {},
    interactions: [],
    console: [],
  }

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })
    const page = await context.newPage()
    const logs = []
    collectConsole(page, logs)

    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyOverflow: document.body.scrollWidth > document.documentElement.clientWidth + 1,
    }))

    const visible = await page.evaluate(() => {
      const isVisible = (el) => {
        if (!el) return false
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
      }
      const navLinks = [...document.querySelectorAll('nav a')].filter(isVisible).map((a) => a.textContent.trim())
      const buttons = [...document.querySelectorAll('button, a')].filter(isVisible).map((el) => ({
        tag: el.tagName,
        text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 80),
        href: el.getAttribute('href'),
      }))
      const hamburger = [...document.querySelectorAll('button')].find((b) =>
        /toggle navigation/i.test(b.textContent || '') || b.getAttribute('aria-controls') === 'mobile-nav',
      )
      return {
        title: document.title,
        navLinks,
        buttons,
        hamburgerVisible: isVisible(hamburger),
        hamburgerExpanded: hamburger?.getAttribute('aria-expanded'),
        skipHref: document.querySelector('a[href="#main-content"]')?.getAttribute('href'),
        mainId: Boolean(document.getElementById('main-content')),
      }
    })

    await page.screenshot({ path: path.join(outDir, `${viewport.name}-home.png`), fullPage: true })

    report.viewports[viewport.name] = { overflow, visible, console: logs }

    if (overflow.bodyOverflow) {
      note('high', 'responsive', `Horizontal overflow on ${viewport.name}`, overflow)
    }

    await context.close()
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const logs = []
  collectConsole(page, logs)

  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
    const info = await page.evaluate(() => ({
      href: location.pathname,
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
    }))
    report.routes[route] = info
    report.interactions.push({ action: `visit ${route}`, result: info })
  }

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const desktopClicks = ['Home', 'Movies', 'Series', 'Genres', 'Trending', 'Login', 'Sign Up']
  for (const label of desktopClicks) {
    const locator = page.getByRole('link', { name: label, exact: true }).first()
    const count = await locator.count()
    if (!count) {
      note('high', 'navigation', `Desktop link not found: ${label}`)
      continue
    }
    await locator.click()
    await page.waitForTimeout(200)
    report.interactions.push({
      action: `click ${label}`,
      pathname: await page.evaluate(() => location.pathname),
      title: await page.title(),
    })
  }

  const logo = page.getByRole('link', { name: /CINOVA home/i }).first()
  await logo.click()
  report.interactions.push({ action: 'click header logo', pathname: await page.evaluate(() => location.pathname) })

  await page.goto(`${BASE}/missing-title-xyz`, { waitUntil: 'networkidle' })
  await page.getByRole('link', { name: 'Back to Home' }).click()
  report.interactions.push({ action: '404 back home', pathname: await page.evaluate(() => location.pathname) })

  await context.close()

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mpage = await mobile.newPage()
  const mlogs = []
  collectConsole(mpage, mlogs)
  await mpage.goto(BASE, { waitUntil: 'networkidle' })

  const hamburger = mpage.getByRole('button', { name: /toggle navigation/i })
  const hamVisible = await hamburger.isVisible()
  report.interactions.push({ action: 'mobile hamburger visible', hamVisible })

  if (hamVisible) {
    await hamburger.click()
    await mpage.waitForTimeout(200)
    const openState = await mpage.evaluate(() => ({
      expanded: document.querySelector('button[aria-controls="mobile-nav"]')?.getAttribute('aria-expanded'),
      panel: Boolean(document.getElementById('mobile-nav')),
    }))
    report.interactions.push({ action: 'open mobile nav', openState })
    await mpage.screenshot({ path: path.join(outDir, 'mobile-nav-open.png'), fullPage: true })

    await mpage.getByRole('link', { name: 'Movies', exact: true }).last().click()
    await mpage.waitForTimeout(200)
    const afterNav = await mpage.evaluate(() => ({
      pathname: location.pathname,
      panel: Boolean(document.getElementById('mobile-nav')),
      expanded: document.querySelector('button[aria-controls="mobile-nav"]')?.getAttribute('aria-expanded'),
    }))
    report.interactions.push({ action: 'mobile click Movies', afterNav })
    if (afterNav.panel) note('medium', 'mobile-nav', 'Mobile nav stayed open after navigating to Movies')

    await hamburger.click()
    await mpage.waitForTimeout(150)
    await mpage.getByRole('link', { name: /CINOVA home/i }).first().click()
    await mpage.waitForTimeout(200)
    const afterLogo = await mpage.evaluate(() => ({
      pathname: location.pathname,
      panel: Boolean(document.getElementById('mobile-nav')),
    }))
    report.interactions.push({ action: 'logo click while menu open', afterLogo })
    if (afterLogo.panel) note('medium', 'mobile-nav', 'Logo click does not close the mobile menu')

    await hamburger.click()
    await mpage.keyboard.press('Escape')
    await mpage.waitForTimeout(150)
    const afterEsc = await mpage.evaluate(() => Boolean(document.getElementById('mobile-nav')))
    report.interactions.push({ action: 'escape closes mobile nav', afterEsc })
    if (afterEsc) note('medium', 'mobile-nav', 'Escape does not close the mobile menu')
  } else {
    note('high', 'responsive', 'Hamburger not visible at 390px')
  }

  await mpage.goto(BASE, { waitUntil: 'networkidle' })
  await mpage.waitForSelector('text=Checking mock service', { timeout: 1000 }).catch(() => null)
  await mpage.waitForSelector('text=Data source', { timeout: 3000 })
  const statusVisible = await mpage.getByText('mock').first().isVisible()
  report.interactions.push({ action: 'home mock status loaded', statusVisible })

  const searchCount = await mpage.getByPlaceholder(/search/i).count()
  const formCount = await mpage.locator('form').count()
  report.interactions.push({ action: 'search fields', searchCount, formCount })
  if (searchCount === 0) note('info', 'missing', 'No search field in the current frontend')
  if (formCount === 0) note('info', 'missing', 'No forms in the current frontend')

  report.console = [...logs, ...mlogs]
  if (report.console.length) {
    note('high', 'console', 'Browser console issues', { entries: report.console })
  }

  report.findings = findings
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
