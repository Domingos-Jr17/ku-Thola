import React, { useState } from "react";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle } from "lucide-react";

type StatusEnvio = 
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export const CandidateCommunication = () => {
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState("");
  const [via, setVia] = useState<"email" | "sms" | "whatsapp">("email");
  const [statusEnvio, setStatusEnvio] = useState<StatusEnvio>(null);
  const [loading, setLoading] = useState(false);

  const handleEnviar = () => {
    if (!mensagem.trim() || !email.trim()) {
      setStatusEnvio({ type: "error", message: "Preencha todos os campos." });
      return;
    }

    setLoading(true);
    setStatusEnvio(null);

    // Simulação de envio
    setTimeout(() => {
      setStatusEnvio({
        type: "success",
        message: `Mensagem enviada via ${via.toUpperCase()} para ${email.trim()}`,
      });
      setMensagem("");
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <main className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
        <h1 className="text-2xl font-semibold">Comunicação com o Candidato</h1>

        <InputGroup
          label="Email ou Número do Candidato"
          id="email"
          type="text"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="ex: candidato@email.com ou 82xxxxxxx"
          required
        />

        <div>
          <label htmlFor="via" className="block text-sm font-medium mb-1">
            Via de envio:
          </label>
          <select
            id="via"
            value={via}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVia(e.target.value as "email" | "sms" | "whatsapp")}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <InputGroup
          label="Mensagem"
          id="mensagem"
          value={mensagem}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMensagem(e.target.value)}
          placeholder="Escreva sua mensagem aqui"
          textarea
          rows={5}
          required
        />

        <div className="flex justify-end">
          <Button onClick={handleEnviar} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </div>

        {statusEnvio && (
          <div
            role="alert"
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded ${
              statusEnvio.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {statusEnvio.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span>{statusEnvio.message}</span>
          </div>
        )}
      </main>
    </div>
  );
};
