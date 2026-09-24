import { motion } from 'framer-motion'
import { Button, Heading, Text } from '@/components/ui'

export default function WelcomeEmpty({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={compact ? 'py-10' : 'py-16'}
    >
      <div className={`mx-auto text-center px-6 ${compact ? 'max-w-sm' : 'max-w-md'}`}>
        <div className={`mx-auto rounded-2xl bg-gradient-to-br from-brand to-violet-600 text-white shadow-lg shadow-brand/25 flex items-center justify-center ${compact ? 'w-11 h-11' : 'w-14 h-14'}`}>
          {Icon && <Icon size={compact ? 20 : 26} />}
        </div>
        <Heading
          size={compact ? 'sm' : 'md'}
          className={`font-bold text-text dark:text-white ${compact ? 'mt-3' : 'mt-4'}`}
        >
          {title}
        </Heading>
        {description && (
          <Text variant="muted" className={`leading-relaxed ${compact ? 'mt-1.5' : 'mt-1.5'}`}>
            {description}
          </Text>
        )}
        {(actionLabel && onAction) || (secondaryLabel && onSecondaryAction) ? (
          <div className={`flex items-center justify-center gap-2.5 ${compact ? 'mt-4' : 'mt-5'}`}>
            {actionLabel && onAction && (
              <Button
                variant="gradient"
                size={compact ? 'md' : 'lg'}
                onClick={onAction}
                className="shadow-md shadow-brand/25 hover:shadow-lg hover:shadow-brand/30"
              >
                {actionLabel}
              </Button>
            )}
            {secondaryLabel && onSecondaryAction && (
              <Button
                variant="secondary"
                size={compact ? 'md' : 'lg'}
                onClick={onSecondaryAction}
                className="rounded-xl font-semibold"
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
