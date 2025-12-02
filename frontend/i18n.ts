import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
    const locale = 'en' // For now, only English

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    }
})