import useNavRoutes from '~/hooks/useNavRoutes'
import MobileNavItem from './MobileNavItem'

const MobileNav = () => {
  const routes = useNavRoutes('mobile')

  return ( 
    <div 
      className="
        fixed bottom-0 border-t-[1px] w-full
        py-3
        flex items-end
        justify-evenly
        lg:hidden
      "
    >
      {
        routes.map((route) => 
          <MobileNavItem 
            key={route.href} 
            {...route} 
          />
        )
      }
    </div>
  )
}

export default MobileNav