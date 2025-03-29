// app/layout.jsx (or any nested layout)
export default function Layout({ children }) {
  // This is server-side by default
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}