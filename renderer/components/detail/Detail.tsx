import { useRouter } from 'next/router'
import { HTMLAttributes, useEffect, useState } from 'react'
import { FaChevronLeft, FaX } from 'react-icons/fa6'
import Thread from './Thread'
import { Entity, MegalodonInterface } from 'megalodon'
import Reply from './Reply'
import Profile from './Profile'

type Props = {
  client: MegalodonInterface
  openMedia: (media: Entity.Attachment) => void
} & HTMLAttributes<HTMLElement>

export default function Detail(props: Props) {
  const [target, setTarget] = useState<'status' | 'reply' | 'profile' | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (router.query.status_id) {
      setTarget('status')
    } else if (router.query.reply_target_id) {
      setTarget('reply')
    } else if (router.query.user_id) {
      setTarget('profile')
    } else {
      setTarget(null)
    }
  }, [router.query])

  const back = () => {
    router.back()
  }

  const close = () => {
    router.push({ query: { id: router.query.id, timeline: router.query.timeline } })
  }

  return (
    <>
      {target && (
        <div className={`bg-white ${props.className}`} style={props.style}>
          <div className="bg-blue-900 text-gray-200 flex justify-between p-2 items-center" style={{ height: '50px' }}>
            <FaChevronLeft onClick={back} className="cursor-pointer text-lg" />
            <FaX onClick={close} className="cursor-pointer text-lg" />
          </div>
          {target === 'status' && <Thread client={props.client} status_id={router.query.status_id as string} openMedia={props.openMedia} />}
          {target === 'reply' && (
            <Reply client={props.client} status_id={router.query.reply_target_id as string} openMedia={props.openMedia} />
          )}
          {target === 'profile' && <Profile client={props.client} user_id={router.query.user_id as string} openMedia={props.openMedia} />}
        </div>
      )}
    </>
  )
}
