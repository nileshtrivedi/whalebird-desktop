import Status from '@/components/timelines/status/Status'
import { Entity, MegalodonInterface } from 'megalodon'
import { useEffect, useState } from 'react'

type Props = {
  client: MegalodonInterface
  user_id: string
}

export default function Timeline(props: Props) {
  const [statuses, setStatuses] = useState<Array<Entity.Status>>([])

  useEffect(() => {
    if (props.user_id) {
      const f = async () => {
        const res = await props.client.getAccountStatuses(props.user_id)
        setStatuses(res.data)
      }
      f()
    }
  }, [props.user_id, props.client])

  const updateStatus = (current: Array<Entity.Status>, status: Entity.Status) => {
    const renew = current.map(s => {
      if (s.id === status.id) {
        return status
      } else if (s.reblog && s.reblog.id === status.id) {
        return Object.assign({}, s, { reblog: status })
      } else if (status.reblog && s.id === status.reblog.id) {
        return status.reblog
      } else if (status.reblog && s.reblog && s.reblog.id === status.reblog.id) {
        return Object.assign({}, s, { reblog: status.reblog })
      } else {
        return s
      }
    })
    return renew
  }

  return (
    <>
      {statuses.map((status, index) => (
        <Status
          client={props.client}
          status={status}
          key={index}
          onRefresh={status => setStatuses(current => updateStatus(current, status))}
        />
      ))}
    </>
  )
}
