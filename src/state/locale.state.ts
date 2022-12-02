import { atom } from 'recoil'
import i18n, { changeLocale, DEFAULT_LOCALE_KEY, getLocaleWithKey, Locale } from 'src/i18n/i18n'

export const localeAtom = atom<Locale>({
  key: 'localeKey',
  default: getLocaleWithKey(DEFAULT_LOCALE_KEY),
  effects: [
    function setLocale({ onSet }) {
      onSet((locale) => {
        changeLocale(i18n, locale.key).catch(console.error)
      })
    },
  ],
})
