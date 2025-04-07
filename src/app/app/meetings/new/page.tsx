"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSPASassClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useGlobal } from '@/lib/context/GlobalContext';

export default function NewMeeting() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const client = createSPASassClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);

    try {
      if (!title) {
        throw new Error("Por favor, insira um título para a reunião");
      }

      if (!file) {
        throw new Error("Por favor, selecione um arquivo de gravação");
      }

      const user = await client.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload do arquivo
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await client.uploadFile("files", filePath, file);

      if (uploadError) {
        throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
      }

      // Obter URL pública do arquivo
      const { data: publicUrl } = await client.getPublicUrl("files", filePath);

      // Criar registro da reunião
      const { error: insertError } = await client.from("meetings").insert({
        title,
        description,
        user_id: user.id,
        recording_url: publicUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (insertError) {
        throw new Error(`Erro ao criar reunião: ${insertError.message}`);
      }

      router.push("/app/meetings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar a reunião");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/app/meetings" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Meetings
          </Button>
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Meeting</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Meeting Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting description"
              rows={3}
              disabled={isUploading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="recording" className="block text-sm font-medium">
              Upload Recording
            </label>
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
              {file ? (
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Drag & drop a file or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports MP3, MP4, WAV, M4A (max 200MB)
                  </p>
                  <Input
                    id="recording"
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("recording")?.click()}
                    disabled={isUploading}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Create Meeting"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 