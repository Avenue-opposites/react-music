import * as ScrollArea from '@radix-ui/react-scroll-area'

interface ScrollLazyLoadProps {
  children: React.ReactNode
}

const ScrollLazyLoad: React.FC<ScrollLazyLoadProps> = ({
  children
}) => {
  return (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
 
export default ScrollLazyLoad