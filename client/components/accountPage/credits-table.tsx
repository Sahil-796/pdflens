'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type CreditHistory = {
  id: string,
  user_id: string,
  amount: number,
  reason: string,
  created_at: Date,
}

const CreditsTable = () => {
  const [creditsHistory, setCreditsHistory] = useState<CreditHistory[]>([])

  const fetchCreditHistory = async () => {
    try {
      const res = await fetch('/api/getCreditHistory')
      if (!res.ok) throw new Error("Failed to fetch credit history")
      const data = await res.json()
      setCreditsHistory(data)
    } catch (error) {
      console.error("Error fetching credit history:", error)
      toast.error("Error fetching credit history")
    }
  }
  useEffect(() => {
    fetchCreditHistory()
  }, [])
  return (
    <Table className="p-4 border border-border rounded-lg bg-muted/10">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Credits Used</TableHead>
          <TableHead className="text-center">Reason</TableHead>
          <TableHead className="text-right">Used At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          creditsHistory.length > 0 ? (
            creditsHistory.map((his, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-left">{his.amount}</TableCell>
                <TableCell className="text-center">{his.reason}</TableCell>
                <TableCell className="text-right">{new Date(his.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )
            :
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                No credit history found
              </TableCell>
            </TableRow>
        }
      </TableBody>
    </Table>
  )
}

export default CreditsTable
