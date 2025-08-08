"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

type Props = {
  title: string
  initialJson: any
  onSave: (data: any) => void
  trigger: React.ReactNode
  a11yLabel: string
}

export default function EditDialog({ title, initialJson, onSave, trigger, a11yLabel }: Props) {
  const [open, setOpen] = React.useState(false)
  const { register, handleSubmit, reset } = useForm<{ json: string }>({
    defaultValues: { json: JSON.stringify(initialJson, null, 2) },
  })

  React.useEffect(() => {
    reset({ json: JSON.stringify(initialJson, null, 2) })
  }, [initialJson, reset])

  const submit = (data: { json: string }) => {
    try {
      const parsed = JSON.parse(data.json)
      onSave(parsed)
      setOpen(false)
    } catch {
      alert("JSON inválido. Verifica la sintaxis.")
    }
  }

  const handleOpen = () => setOpen(true)

  // Prevent nested <button>. If trigger is an element, clone and attach handler.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: (e: any) => {
          trigger.props && typeof (trigger as any).props?.onClick === "function" &&
            (trigger as any).props.onClick(e)
          handleOpen()
        },
        "aria-label": a11yLabel,
      })
    : (
        <button onClick={handleOpen} aria-label={a11yLabel}>
          {trigger}
        </button>
      )

  return (
    <>
      {triggerNode}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 w-[92vw] max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button
                className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-3">
              <textarea
                aria-label="Editor JSON"
                className="w-full h-80 border border-black/10 dark:border-white/10 rounded-lg p-3 font-mono text-xs bg-neutral-50 dark:bg-neutral-950"
                {...register("json")}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}