import { useMedia } from 'react-use'

import { Drawer, DrawerContent } from './ui/drawer'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

interface ResponsiveModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const ResponsiveModal = ({
  isOpen,
  onOpenChange,
  children,
}: ResponsiveModalProps) => {
  const isDesktop = useMedia('(min-width: 1024px)')

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTitle className="sr-only">Create Project</DialogTitle>
        <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
