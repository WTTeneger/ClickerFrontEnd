import i18next from "i18next"
import { t } from "i18next"
import { useSelector } from "react-redux"




export const translation = (group) => {
    let lang = i18next.language
    // if (!lang) i18next && i18next.changeLanguage('ru')
    let RT = (el, extra = null) => {
        let text = `${group}.${el}`
        if (extra) text += `.${extra}`
        let _text = t(text)

        if (_text === text) {
            console.log(`[TRANSLATION][${lang}] ${text}`)
            return `${el}` + (extra ? `.${extra}` : '')
        }
        return _text
    }
    return RT;
}