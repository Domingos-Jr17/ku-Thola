import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";

interface NotificationItem {
  id: string; // id único para key
  recipientEmail: string;
  subject: string;
  message: string;
}

export const CandidateNotificationsRh = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sentNotifications, setSentNotifications] = useState<NotificationItem[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Por favor, informe um email válido.");
      return;
    }

    const newNotification: NotificationItem = {
      id: crypto.randomUUID(), // id único moderno e seguro
      recipientEmail: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    setSentNotifications((prev) => [newNotification, ...prev]);
    setEmail("");
    setSubject("");
    setMessage("");
    setSuccessMsg("Notificação enviada com sucesso!");

    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Enviar Notificação ao Candidato</h1>

      <form onSubmit={handleSend} className="space-y-4" noValidate>
        <InputGroup
          label="Email do Candidato"
          id="email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />

        <InputGroup
          label="Assunto"
          id="subject"
          type="text"
          value={subject}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
          required
        />

        <InputGroup
          label="Mensagem"
          id="message"
          textarea
          rows={5}
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          required
        />

        <div className="flex flex-col items-end gap-2">
          <Button type="submit">Enviar</Button>
          {successMsg && <p className="text-green-600" role="alert">{successMsg}</p>}
        </div>
      </form>

      {sentNotifications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Notificações Enviadas</h2>
          <ul className="space-y-2">
            {sentNotifications.map(({ id, recipientEmail, subject, message }) => (
              <li key={id} className="border p-3 rounded bg-gray-50">
                <p className="text-sm text-gray-700">
                  <strong>Para:</strong> {recipientEmail}<br />
                  <strong>Assunto:</strong> {subject}<br />
                  <strong>Mensagem:</strong> {message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
