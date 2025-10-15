'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Plus,
  Wrench,
  User,
  Edit3
} from 'lucide-react'

const QuickActions = () => {
  const actions = [
    {
      title: "Create New PDF",
      description: "Generate a document with AI",
      icon: Plus,
      href: "/generate",
      color: "bg-primary",
      iconColor: "text-primary-foreground"
    },
    {
      title: "Edit PDF",
      description: "Modify existing PDFs easily",
      icon: Edit3,
      href: "/edit",
      color: "bg-primary",
      iconColor: "text-primary-foreground"
    },
    {
      title: "Toolbox",
      description: "Access PDF tools like merge, split & more",
      icon: Wrench,
      href: "/tools",
      color: "bg-secondary",
      iconColor: "text-secondary-foreground"
    },
    {
      title: "Account",
      description: "Manage your profile and preferences",
      icon: User,
      href: "/account",
      color: "bg-secondary",
      iconColor: "text-secondary-foreground"
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        className="text-center px-2 sm:px-0"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Quick Actions
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Get started with Zendra
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl px-3 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {actions.map((action, idx) => {
              const IconComponent = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -2 }}
                >
                  <Link href={action.href} className="block h-[80px] sm:h-[100px]">
                    <Card className="group h-full border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                      <CardContent className="p-4 sm:p-5 h-full flex items-center gap-4">
                        <div
                          className={`p-2 sm:p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${action.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base text-foreground truncate">
                            {action.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {action.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickActions
