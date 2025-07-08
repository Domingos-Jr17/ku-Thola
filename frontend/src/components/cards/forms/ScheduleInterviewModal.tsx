/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/Button";

type InterviewMethod = "Presencial" | "Zoom" | "Google Meet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string, time: string, method: InterviewMethod) => void;
  candidateName?: string;
  initialDate?: string;
  initialTime?: string;
  initialMethod?: InterviewMethod;
  isRescheduling?: boolean;
}

const validMethods = ["Presencial", "Zoom", "Google Meet"] as const;
const isValidMethod = (value: any): value is InterviewMethod =>
  validMethods.includes(value);

export const ScheduleInterviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  candidateName = "",
  initialDate = "",
  initialTime = "",
  initialMethod = "Presencial",
  isRescheduling = false,
}: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [method, setMethod] = useState<InterviewMethod>("Presencial");

  useEffect(() => {
    if (isOpen) {
      setDate(initialDate);
      setTime(initialTime);
      setMethod(isValidMethod(initialMethod) ? initialMethod : "Presencial");
    }
  }, [isOpen, initialDate, initialTime, initialMethod]);

  useEffect(() => {
    if (!isOpen) {
      // Limpa estado ao fechar modal para evitar dados antigos
      setDate("");
      setTime("");
      setMethod("Presencial");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (date && time && method) {
      onSubmit(date, time, method);
      onClose();
    }
  };

  const title = useMemo(
    () => (isRescheduling ? "Reagendar Entrevista" : "Agendar Entrevista"),
    [isRescheduling]
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl space-y-4" aria-modal="true">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>

          {candidateName && (
            <Dialog.Description className="text-sm text-gray-700">
              Candidato: <strong>{candidateName}</strong>
            </Dialog.Description>
          )}

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <label htmlFor="interview-date" className="block text-sm font-medium mb-1">
                Data
              </label>
              <input
                id="interview-date"
                type="date"
                className="w-full border rounded px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="interview-time" className="block text-sm font-medium mb-1">
                Hora
              </label>
              <input
                id="interview-time"
                type="time"
                className="w-full border rounded px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="interview-method" className="block text-sm font-medium mb-1">
                Método
              </label>
              <select
                id="interview-method"
                className="w-full border rounded px-3 py-2"
                value={method}
                onChange={(e) => setMethod(e.target.value as InterviewMethod)}
              >
                {validMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={!date || !time}>
                {isRescheduling ? "Reagendar" : "Agendar"}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
