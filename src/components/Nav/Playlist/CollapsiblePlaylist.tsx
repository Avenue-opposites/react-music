import { Icon } from '@iconify-icon/react'
import { useState } from 'react'
import clsx from 'clsx'
import * as Collapsible from '@radix-ui/react-collapsible'
import PlaylistItem from './PlaylistItem'

interface CollapsiblePlaylist {
  title: string
  playlist: any[]
}

const CollapsiblePlaylist: React.FC<CollapsiblePlaylist> = ({
  title,
  playlist
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-center">
        <Collapsible.Trigger>
          <Icon className={clsx('text-xs transition-transform', isOpen && 'rotate-90')} icon="fluent:triangle-right-16-filled" />
          <span className="ml-2">{title}</span>
        </Collapsible.Trigger>
        <Icon className="text-xl hover:bg-gray-200 rounded transition-colors" icon="material-symbols:add-rounded" />
      </div>
      <Collapsible.Content className="CollapsibleContent" asChild>
        <ul className="mt-2 space-y-1">
          {
            playlist.map(({ id, name }) =>
              <PlaylistItem
                key={id}
                id={id}
                name={name}
              />
            )
          }
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default CollapsiblePlaylist