import * as A from '@radix-ui/react-avatar'
import { AvatarProps as AProps } from '@radix-ui/react-avatar'
import clsx from 'clsx'

interface AvatarProps extends AProps {
  size?: number | string;
  avatarFrameSrc?: string;
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({
  size = '56px',
  avatarFrameSrc,
  className,
  src,
  alt,
  ...otherProps
}) => {
  return (
    <A.Root
          style={{ width: size, height: size }}
          className={clsx(`
            block flex-none rounded-full
           ring-sky-500 ring-1 ring-offset-base-100 ring-offset-0
            cursor-pointer relative aspect-square
          `,
            className
          )}
          {...otherProps}
        >
          {avatarFrameSrc &&
            <span className="absolute -left-2.5 -top-2.5 w-20 h-20 bg-no-repeat bg-cover" style={{ backgroundImage: `url(${avatarFrameSrc})` }} />}
          <A.Image
            src={src}
            alt={alt}
            className="object-cover h-full w-full rounded-full overflow-hidden" />
        </A.Root>
  )
}

export default Avatar