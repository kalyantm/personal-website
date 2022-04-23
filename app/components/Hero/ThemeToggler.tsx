import React from 'react';
import {Sun, Moon} from 'react-feather';

const ThemeToggler = () => {
  const [theme, setTheme] = React.useState('light')
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  React.useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.dataset.theme = theme
    } else {
      document.documentElement.dataset.theme = theme
    }
  }, [theme])
  return (
    <button onClick={() => setTheme(nextTheme)}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}

export default ThemeToggler;