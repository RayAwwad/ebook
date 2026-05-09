"use client"

import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import { CreditCard, Lock, Check } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  })
const [test, setTest] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    onSuccess()
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { bgcolor: "background.paper", backgroundImage: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 } } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(33,150,243,0.1)", display: "flex" }}>
          <CreditCard size={20} color="#2196f3" />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Complete Your Purchase</Typography>
          <Typography variant="caption" color="text.secondary">Unlock your personalized fitness report</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Price row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>FitMetrics Report</Typography>
              <Typography variant="caption" color="text.secondary">Detailed fitness analysis</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>$29.99</Typography>
              <Typography variant="caption" color="text.secondary">One-time payment</Typography>
            </Box>
          </Box>

          <TextField label="Cardholder Name" placeholder="John Doe" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth size="small" />

          <TextField label="Card Number" placeholder="4242 4242 4242 4242" value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
            slotProps={{ htmlInput: { maxLength: 19 }, input: { endAdornment: <CreditCard size={18} color="#9ca3af" /> } }} required fullWidth size="small" />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <TextField label="Expiry (MM/YY)" placeholder="MM/YY" value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
              slotProps={{ htmlInput: { maxLength: 5 } }} required size="small" />
            <TextField label="CVC" placeholder="123" value={formData.cvc}
              onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/[^0-9]/g, "").substring(0, 4) })}
              slotProps={{ htmlInput: { maxLength: 4 } }} required size="small" />
          </Box>

          {/* Security notice */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Lock size={12} color="#9ca3af" />
            <Typography variant="caption" color="text.secondary">Your payment information is secure and encrypted</Typography>
          </Box>

          <Button type="submit" variant="contained" fullWidth disabled={isProcessing} sx={{ py: 1.25 }}
            startIcon={isProcessing ? <CircularProgress size={16} color="inherit" /> : <Check size={16} />}>
            {isProcessing ? "Processing..." : "Pay $29.99"}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
            Demo mode — no real payment will be processed
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
