"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

export function AudioRecorder() {
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<string>();

  async function toggle() {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const next = new MediaRecorder(stream);
      chunks.current = [];
      next.ondataavailable = (event) => chunks.current.push(event.data);
      next.onstop = () => {
        const blob = new Blob(chunks.current, { type: next.mimeType });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };
      next.start();
      recorder.current = next;
      setRecording(true);
      setError(undefined);
    } catch {
      setError("无法使用麦克风。请在浏览器设置中允许录音，或改用文字练习。");
    }
  }

  return (
    <div className="recorder">
      <button className={recording ? "record-button recording" : "record-button"} onClick={toggle}>
        {recording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
        {recording ? "结束录音" : "开始录音"}
      </button>
      {audioUrl && <audio controls src={audioUrl} aria-label="口语练习录音" />}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
