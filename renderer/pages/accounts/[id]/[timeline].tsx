import { useRouter } from 'next/router'
import Timeline from '@/components/timelines/Timeline'
import { useEffect, useState } from 'react'
import { Account, db } from '@/db'
import generator, { MegalodonInterface } from 'megalodon'
import Notifications from '@/components/timelines/Notifications'

export default function Page() {
  const router = useRouter()
  const [account, setAccount] = useState<Account | null>(null)
  const [client, setClient] = useState<MegalodonInterface>(null)

  useEffect(() => {
    if (router.query.id) {
      console.log(router)
      const f = async () => {
        const a = await db.accounts.get(parseInt(router.query.id as string))
        if (a) {
          setAccount(a)
          const c = generator(a.sns, a.url, a.access_token, 'Whalebird')
          setClient(c)
        }
      }
      f()
    }
  }, [router.query.id])

  if (!account || !client) return null
  switch (router.query.timeline as string) {
    case 'notifications': {
      return <Notifications account={account} client={client} />
    }
    default: {
      return <Timeline timeline={router.query.timeline as string} account={account} client={client} />
    }
  }
}
