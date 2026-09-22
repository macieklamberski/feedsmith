import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h('img', { class: 'nav-logo', src: '/favicon.svg', alt: '' }),
    })
  },
}
