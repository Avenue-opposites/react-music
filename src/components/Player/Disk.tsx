import clsx from 'clsx'

interface DiskProps {
  name: string;
  isPlaying: boolean;
  image: string;
}

const Disk: React.FC<DiskProps> = ({
  name,
  isPlaying,
  image
}) => {
  return (
    <div>
      <svg 
        className={clsx(`
          relative z-10 top-6 left-[160px] 
          origin-[15px_15px] transition-transform
          duration-300 ease-in-out
        `,
          isPlaying && 'rotate-[30deg]'
        )} 
        width="210" 
        height="125"
      >
        <path className="drop-shadow" d="M15 15 Q 77 72 102 92 T 180 108" fill="none" stroke="white" strokeWidth="6" />
        <rect className="fill-gray-900" x="175" y="107.5" width="6" height="2" rx="1" ry="1" />
        <rect className="drop-shadow" x="180" y="103" width="15" height="10" rx="2" ry="2" fill="white" />
        <rect className="drop-shadow" x="189" y="99" width="18" height="18" rx="3" ry="3" fill="white" />
        <rect className="fill-gray-300" x="192" y="103" width="12" height="1" rx="1" ry="1" fill="black" />
        <rect className="fill-gray-300" x="192" y="112" width="12" height="1" rx="1" ry="1" fill="black" />
        <circle className="fill-white drop-shadow" cx="15" cy="15" r="15" />
        <circle className="fill-gray-300" cx="15" cy="15" r="5" />
      </svg>
      <div 
        className="relative animate-disk-spin inline-flex items-center justify-center"
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
        <svg width="350" height="350">
          <circle className="fill-gray-300" cx="175" cy="175" r="175" />
          <circle className="fill-gray-900" cx="175" cy="175" r="165" />
          <circle className="fill-black" cx="175" cy="175" r="110" />
        </svg>
        <img className="absolute w-52 h-52 rounded-full object-cover" src={image} alt={name} />
      </div>
    </div>
  )
}

export default Disk