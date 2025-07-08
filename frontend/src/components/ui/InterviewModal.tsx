import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";

type InterviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    date: string;
    method: "Presencial" | "Virtual";
    platform?: string; // Para o caso de virtual
    link: string;
    notes: string;
  }) => void;
  initialData?: {
    date: string;
    method?: "Presencial" | "Virtual";
    platform?: string;
    link: string;
    notes: string;
  };
};

export const InterviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}: InterviewModalProps) => {
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<"Presencial" | "Virtual">("Presencial");
  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || "");
      setMethod(initialData.method || "Presencial");
      setPlatform(initialData.platform || "");
      setLink(initialData.link || "");
      setNotes(initialData.notes || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("Por favor, informe a data da entrevista");
      return;
    }

    if (method === "Virtual" && !link) {
      alert("Por favor, informe o link da reunião para entrevistas virtuais");
      return;
    }

    onConfirm({ date, method, platform, link, notes });

    // Opcional: limpar campos após submit
    setDate("");
    setMethod("Presencial");
    setPlatform("");
    setLink("");
    setNotes("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Agendar Entrevista">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputGroup
          label="Data e Hora"
          type="datetime-local"
          id="interviewDate"
          required
          value={date}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setDate(e.target.value)}
        />

        <div>
          <label htmlFor="method" className="block mb-1 font-medium">
            Método da Entrevista
          </label>
          <select
            id="method"
            className="w-full border rounded p-2"
            value={method}
            onChange={(e) => setMethod(e.target.value as "Presencial" | "Virtual")}
          >
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>

        {method === "Virtual" && (
          <>
            <div>
              <label htmlFor="platform" className="block mb-1 font-medium">
                Plataforma
              </label>
              <select
                id="platform"
                className="w-full border rounded p-2"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {platform === "Outro" && (
              <InputGroup
                label="Especifique a Plataforma"
                id="otherPlatform"
                type="text"
                value={platform}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPlatform(e.target.value)}
              />
            )}

            <InputGroup
              label="Link da Reunião (Zoom, Meet, etc.)"
              type="url"
              id="meetingLink"
              placeholder="https://..."
              required
              value={link}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLink(e.target.value)}
            />
          </>
        )}

        {method === "Presencial" && (
          <InputGroup
            label="Local da Entrevista"
            id="meetingLocation"
            type="text"
            placeholder="Ex: Escritório, Sala 305"
            value={link} // Aqui pode reutilizar o campo link para endereço, ou criar outro estado
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLink(e.target.value)}
          />
        )}

        <InputGroup
          label="Observações"
          id="notes"
          placeholder="Ex: Levar portfólio, entrevista técnica..."
          textarea
          rows={3}
          value={notes}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Agendar</Button>
        </div>
      </form>
    </Modal>
  );
};
