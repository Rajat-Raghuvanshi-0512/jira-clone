import { Button, buttonVariants } from '@/components/ui/button'
import { JSX, useState } from 'react'
import { ResponsiveModal } from '@/components/responsive-modal'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { VariantProps } from 'class-variance-authority'

export const useConfirm = (
  title: string,
  description: string,
  variant: VariantProps<typeof buttonVariants>['variant'] = 'primary',
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve })
    })
  }
  const handleClose = () => {
    setPromise(null)
  }
  const handleConfirm = () => {
    if (promise) {
      promise.resolve(true)
    }
    handleClose()
  }

  const handleCancel = () => {
    if (promise) {
      promise.resolve(false)
    }
    handleClose()
  }
  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal isOpen={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-4">
            <CardHeader className="pt-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full lg:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant={variant}
                onClick={handleConfirm}
                className="w-full lg:w-auto"
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    )
  }
  return [ConfirmationDialog, confirm]
}
