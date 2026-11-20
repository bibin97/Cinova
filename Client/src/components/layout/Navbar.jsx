import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navItems } from '../../data/site'
import { mobileNavClosed, mobileNavToggled } from '../../features/ui/uiSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { cn } from '../../utils/cn'
import Button from '../common/Button'
import Logo from '../common/Logo'

function navClassName({ isActive }) {
  return cn(
    'text-sm transition-colors duration-200',
    isActive ? 'text-gold' : 'text-foreground hover:text-gold',
  )
}

export default function Navbar() {
  const dispatch = useAppDispatch()
  const mobileNavOpen = useAppSelector((state) => state.ui.mobileNavOpen)

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Primary">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClassName} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button as={NavLink} to="/login" variant="outline">
            Login
          </Button>
          <Button as={NavLink} to="/signup" variant="primary">
            Sign Up
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-foreground md:hidden"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-nav"
          onClick={() => dispatch(mobileNavToggled())}
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </nav>

      {mobileNavOpen ? (
        <div id="mobile-nav" className="border-t border-line bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClassName}
                end={item.to === '/'}
                onClick={() => dispatch(mobileNavClosed())}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Button as={NavLink} to="/login" variant="outline" className="flex-1" onClick={() => dispatch(mobileNavClosed())}>
                Login
              </Button>
              <Button as={NavLink} to="/signup" variant="primary" className="flex-1" onClick={() => dispatch(mobileNavClosed())}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
