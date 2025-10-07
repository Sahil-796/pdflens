'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Clock,
  TrendingUp,
  FileText,
  Plus
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
    }
  ]

  const stats = [
    {
      label: "Total PDFs",
      value: "12",
      icon: FileText,
      change: "+2 this week"
    },
    {
      label: "This Month",
      value: "8",
      icon: TrendingUp,
      change: "+3 from last month"
    },
    {
      label: "Time Saved",
      value: "4.2h",
      icon: Clock,
      change: "vs manual creation"
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
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
          Get started with your documents
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg space-y-3 sm:space-y-4 px-3 sm:px-0">
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
                <Link href={action.href} className="block">
                  <Card className="group h-20 sm:h-24 border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-3 sm:p-4 h-full flex items-center gap-3 sm:gap-4">
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

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-3 sm:px-0"
      >
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <Card className="border border-border bg-card/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {stat.label}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground truncate">
                        {stat.value}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {stat.change}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 flex-shrink-0">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default QuickActions
