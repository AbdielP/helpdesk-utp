import { createContext, useCallback, useContext, useMemo, useState } from "react"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState("success")

  const showNotification = useCallback((msg, type = "success") => {
    setMessage(msg)
    setSeverity(type)
    setOpen(true)
  }, [])

  const handleClose = useCallback((_, reason) => {
    if (reason === "clickaway") return
    setOpen(false)
  }, [])

  const contextValue = useMemo(() => ({ showNotification }), [showNotification])

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}
